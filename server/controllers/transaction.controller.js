import mongoose from "mongoose";
import transactionModel from "../model/transaction.model.js";

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction (Income or Expense)
 * @access  Private (Requires valid JWT)
 */

async function createTransactionController(req, res) {
  try {
    const { type, amount, category, date, description } = req.body
    if (!type || !amount || !category) {
      return res.status(401).json({
        message: "PLease provide all the information regarding your transaction"
      })
    }
    const newTransaction = await transactionModel.create({
      userId: req.user.id,
      type,
      amount,
      category,
      date: date || Date.now(),
      description
    });
    res.status(201).json({
      success: true,
      data: newTransaction
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions for the logged-in user with month and category filters
 * @access  Private (Requires valid JWT)
 */

async function getTransactionController(req, res) {
  try {
    let query = { userId: req.user.id };
    const { category, month } = req.query;
    if (category) {
      query.category = category
    }
    if (month) {
      const [year, monthnum] = month.split('-')
      const startDate = new Date(year, monthnum - 1, -1)
      const endDate = new Date(year, monthnum, 0)

      query.date = {
        $gte: startDate,
        $lte: endDate
      };
    }


    const transactions = await transactionModel.find(query).sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update a specific transaction
 * @access  Private
 */

async function updateTransactionController(req, res) {
  try {
    const { id } = req.params
    let transaction = await transactionModel.findById(id)
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found!"
      })
    }
    if (transaction.userId.toString() != req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this transaction"
      })
    }
    const { type, amount, category, date, description } = req.body;
    transaction = await transactionModel.findByIdAndUpdate(
      id,
      { type, amount, category, date, description },
      { new: true, runValidators: true }
    )
    res.status(200).json({
      success: true,
      data: transaction
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete a specific transaction
 * @access  Private
 */
async function deleteTransactionController(req, res) {
  try {
    const { id } = req.params
    let transaction = await transactionModel.findById(id)
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found!"
      })
    }
    if (transaction.userId.toString() != req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this transaction"
      })
    }
    await transactionModel.findByIdAndDelete(id)
    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
/**
 *  @route   GET /api/transactions/stats
 * @desc    Get aggregated transaction statistics for the dashboard.
 * Calculates overall totals, category-wise breakdown, and daily spending using MongoDB $facet.
 *@access  Private (Requires valid JWT)
 */
async function getTransactionStatsController(req, res) {
  try{
    const userId = new mongoose.Types.ObjectId(req.user.id)
    const stats = await transactionModel.aggregate([
      {
        $match: {userId: userId}
      },
      {
        $facet:{
          overallStats:[
            {
              $group: {
                _id: null,
                totalIncome:{
                  $sum: {$cond: [{$eq: ["$type","income"]},"$amount",0]}
                },
                totalExpenses:{
                  $sum: {$cond: [{$eq: ["$type","expense"]},"$amount",0]}
                }
              }
            },
            {$project: {
              _id: 0,
              totalIncome:1,
              totalExpenses:1,
              balance:{$subtract: ["$totalIncome","$totalExpenses"]}
            }
          }
          ],
          categoryBreakdown:[
            {$match: {type: "expense"}},
            {$group: {_id: "$category",total: {$sum: "$amount"}}},
            {$sort: {total : -1}}
          ],
          dailySpending: [
            { $match: { type: "expense" } },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                total: { $sum: "$amount" }
              }
            }, 
            { $sort: { _id: 1 } } 
          ]
        }
      }
    ]);
    const result = stats[0];
    const overall = result.overallStats[0] || { totalIncome: 0, totalExpenses: 0, balance: 0 };

    res.status(200).json({
      success: true,
      data: {
        totalIncome: overall.totalIncome,
        totalExpenses: overall.totalExpenses,
        balance: overall.balance,
        categoryBreakdown: result.categoryBreakdown,
        dailySpending: result.dailySpending
      }
    });
  }catch(error){
     res.status(500).json({
      success: false,
      error: error.message
    });
  }
}



export default { createTransactionController, getTransactionController, updateTransactionController, deleteTransactionController,getTransactionStatsController }