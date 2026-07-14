import aiReportModel from "../model/aiReport.model.js";

/**
 * @route   POST /api/ai/report
 * @desc    Generate or retrieve the AI financial report for the authenticated user.
 *           First checks if a report for the requested month already exists (cache hit).
 *           If found, returns the cached report.
 *           Otherwise, generates a mock AI report, stores it in the database,
 *           and returns it. This mock implementation will be replaced with
 *           Gemini integration in a later phase.
 * @access  Private
 */

async function getAiReportController(req, res) {
  try {
    const userId = req.user.id
    const { month } = req.body ?? {}
    if (!month) {
      return res.status(400).json({ success: false, message: "Month is required" })
    }
    const existingReport = await aiReportModel.findOne({ userId, month })
    if (existingReport) {
      console.log("Cache Hit! Take DB from cache")
      return res.status(200).json({
        success: true,
        source: "cache",
        data: existingReport
      })
    }
      console.log("Cache Miss! Generate new report")
      const mockSummary = `Your spending in ${month} was slightly higher in the Entertainment category, but overall your savings are on track. Maintaining this balance will help you achieve your long-term financial goals.`;

      const mockRecommendations = [
        "Try reducing food delivery expenses on weekends—you could save up to ₹1,500 per month.",
        "Consider increasing your monthly investments by ₹2,000 to strengthen your long-term financial growth.",
        "Enable auto-pay for your utility bills to avoid late payment charges and improve financial discipline."
      ];
      const mockHealthScore = 78;

      const newReport = await aiReportModel.create({
        userId,
        month,
        summary: mockSummary,
        recommendations: mockRecommendations,
        aiHealthScore: mockHealthScore
      })
      return res.status(201).json({
      success: true,
      source: "gemini_skeleton", 
      data: newReport
    });
    
  } catch (error) {
    console.error("AI Report Error:", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
} 

export default {getAiReportController}