import aiReportModel from "../model/aiReport.model.js";
import model from "../config/gemini.js";
import buildAIPrompt from "../utils/buildAIPrompt.js";
import getTransactionStats from "../services/transactionStats.service.js";

/**
 * @route   POST /api/ai/report
 * @desc    Generate or retrieve the AI financial report for the authenticated user.
 *          Checks for cached report unless force=true.
 *          Validates transaction existence, Gemini API response, JSON format, and schema before saving.
 * @access  Private
 */
async function getAiReportController(req, res) {
  try {
    const userId = req.user.id;
    const { month } = req.body ?? {};

    if (!month) {
      return res.status(400).json({ success: false, message: "Month is required" });
    }

    const force = req.query.force === "true";
    const existingReport = await aiReportModel.findOne({ userId, month });

    // 1. Cache Hit check
    if (existingReport && !force) {
      console.log(`[AI Service] Cache Hit for user: ${userId}, month: ${month}`);
      return res.status(200).json({
        success: true,
        source: "cache",
        data: existingReport,
      });
    }

    console.log(`[AI Service] Cache Miss for user: ${userId}, month: ${month}`);

    // If force=true, delete stale cached report so unique index doesn't collide
    if (existingReport && force) {
      await aiReportModel.deleteOne({ userId, month });
    }

    // 2. Fetch stats for requested month
    const stats = await getTransactionStats(userId, month);

    // 3. No Transactions Check: skip Gemini if user has no transactions for the month
    const hasNoTransactions =
      stats.totalIncome === 0 &&
      stats.totalExpenses === 0 &&
      (!stats.categoryBreakdown || stats.categoryBreakdown.length === 0) &&
      (!stats.dailySpending || stats.dailySpending.length === 0);

    if (hasNoTransactions) {
      console.log(`[AI Service] No transactions found for user: ${userId}, month: ${month}. Skipping Gemini.`);
      return res.status(200).json({
        success: true,
        code: "NO_TRANSACTIONS",
        message: "No transactions found for this month.",
        data: null,
      });
    }

    // 4. Build Prompts
    const { systemPrompt, userPrompt } = buildAIPrompt(stats);

    // 5. Call Gemini API with safety wrapper
    console.log(`[AI Service] Gemini Request Started for user: ${userId}, month: ${month}`);
    let result;
    try {
      result = await model.generateContent([systemPrompt, userPrompt]);
    } catch (geminiErr) {
      console.error(`[AI Service Error] Gemini API request failed: ${geminiErr.message}`);
      return res.status(503).json({
        success: false,
        code: "GEMINI_SERVICE_UNAVAILABLE",
        message: "AI Insights service is temporarily unavailable. Please try again later.",
      });
    }

    console.log(`[AI Service] Gemini Request Finished successfully for user: ${userId}`);

    // 6. Extract and parse response JSON
    const text = result.response.text();
    let aiReport;
    try {
      const cleanedText = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
      aiReport = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error(`[AI Service Error] Gemini Parse Failed. Raw response snippet: "${text.slice(0, 150)}..."`);
      return res.status(502).json({
        success: false,
        code: "GEMINI_PARSE_FAILED",
        message: "Failed to parse AI response. Please try again.",
      });
    }

    // 7. Validate required AI report fields before DB persistence
    const { financialScore, summary, strengths, concerns, recommendations, riskLevel } = aiReport ?? {};

    const isValidScore = typeof financialScore === "number" && Number.isFinite(financialScore) && financialScore >= 0 && financialScore <= 100;
    const isValidSummary = typeof summary === "string" && summary.trim().length > 0;
    const isValidStrengths = Array.isArray(strengths);
    const isValidConcerns = Array.isArray(concerns);
    const isValidRecommendations = Array.isArray(recommendations);
    const isValidRisk = ["Low", "Medium", "High"].includes(riskLevel);

    if (!isValidScore || !isValidSummary || !isValidStrengths || !isValidConcerns || !isValidRecommendations || !isValidRisk) {
      console.error(`[AI Service Error] Validation Failed for AI response:`, {
        isValidScore,
        isValidSummary,
        isValidStrengths,
        isValidConcerns,
        isValidRecommendations,
        isValidRisk,
      });
      return res.status(422).json({
        success: false,
        code: "VALIDATION_FAILED",
        message: "AI response failed validation standards. Please try again.",
      });
    }

    // 8. Persist validated report to MongoDB
    const newReport = await aiReportModel.create({
      userId,
      month,
      summary: summary.trim(),
      recommendations,
      aiHealthScore: Math.round(financialScore),
      strengths,
      concerns,
      riskLevel,
    });

    console.log(`[AI Service] Report Saved Successfully to DB for user: ${userId}, month: ${month}`);

    return res.status(201).json({
      success: true,
      source: "gemini",
      data: newReport,
    });
  } catch (error) {
    console.error("[AI Service Error] Internal server failure:", error);
    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred while processing the AI report.",
    });
  }
}

export default { getAiReportController };