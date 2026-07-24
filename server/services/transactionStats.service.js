import mongoose from "mongoose";
import transactionModel from "../model/transaction.model.js";

/**
 * Computes aggregated transaction statistics for a given user.
 *
 * @param {string | mongoose.Types.ObjectId} userId - The authenticated user's ID.
 * @param {string} [month] - Optional month filter in "YYYY-MM" format.
 *                           When provided, only transactions within that calendar
 *                           month are included in the aggregation.
 *
 * @returns {Promise<{
 *   totalIncome: number,
 *   totalExpenses: number,
 *   balance: number,
 *   categoryBreakdown: Array<{ name: string, total: number }>,
 *   dailySpending:     Array<{ date: string, total: number }>,
 *   recentTransactions: object[]
 * }>}
 */
async function getTransactionStats(userId, month) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Build the base $match stage — always filter by user
  const matchStage = { userId: userObjectId };

  // If a month filter is provided, restrict the date range to that calendar month
  if (month) {
    const [year, monthNum] = month.split("-");
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0); // last day of the month
    matchStage.date = { $gte: startDate, $lte: endDate };
  }

  // ── Aggregation pipeline (unchanged from original controller) ──────────────
  const stats = await transactionModel.aggregate([
    {
      $match: matchStage,
    },
    {
      $facet: {
        overallStats: [
          {
            $group: {
              _id: null,
              totalIncome: {
                $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
              },
              totalExpenses: {
                $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
              },
            },
          },
          {
            $project: {
              _id: 0,
              totalIncome: 1,
              totalExpenses: 1,
              balance: { $subtract: ["$totalIncome", "$totalExpenses"] },
            },
          },
        ],
        categoryBreakdown: [
          { $match: { type: "expense" } },
          { $group: { _id: "$category", total: { $sum: "$amount" } } },
          { $sort: { total: -1 } },
        ],
        dailySpending: [
          { $match: { type: "expense" } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
              total: { $sum: "$amount" },
            },
          },
          { $sort: { _id: 1 } },
        ],
      },
    },
  ]);

  // Fetch the 5 most recent transactions separately (unchanged from original)
  const recentTransactions = await transactionModel
    .find({ userId: userObjectId })
    .sort({ date: -1, createdAt: -1 })
    .limit(5);

  // ── Shape the result (unchanged from original controller) ──────────────────
  const result = stats[0];
  const overall = result.overallStats[0] || {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  };

  /* Rename aggregation group keys so callers never see `_id` */
  const categoryBreakdown = result.categoryBreakdown.map(({ _id, total }) => ({
    name: _id,
    total,
  }));
  const dailySpending = result.dailySpending.map(({ _id, total }) => ({
    date: _id,
    total,
  }));

  return {
    totalIncome: overall.totalIncome,
    totalExpenses: overall.totalExpenses,
    balance: overall.balance,
    categoryBreakdown,
    dailySpending,
    recentTransactions: recentTransactions.map((t) => t.toJSON()),
  };
}

export default getTransactionStats;
