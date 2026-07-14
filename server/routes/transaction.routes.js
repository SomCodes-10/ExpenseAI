import express from "express";
import authUser from "../middlewares/auth.Middleware.js";
import transactionController from "../controllers/transaction.controller.js";
import { validateResult } from "../validators/transaction.validator.js";

const transactionRouter = express.Router()

/**
 * @route  POST /api/transactions
 * @desc   Create a new transaction (Income or Expense)
 * @access Private
 */

transactionRouter.post("/",authUser,validateResult,transactionController.createTransactionController)

/**
 * @route   GET /api/transactions/stats
 * @desc    Get dashboard statistics (Total Income, Total Expenses, Balance, Category Breakdown, Daily Spending)
 * @access  Private
 */

transactionRouter.get("/stats",authUser,transactionController.getTransactionStatsController)

/**
 * @route  GET /api/transactions
 * @desc   Get all transactions for the logged in user
 * @access Private
 */

transactionRouter.get("/",authUser,transactionController.getTransactionController)

/**
 * @route  POST /api/transactions
 * @desc   Update transactions for the logged in user
 * @access Private
 */

transactionRouter.put("/:id",authUser,validateResult,transactionController.updateTransactionController)

/**
 * @route  DELETE /api/transactions
 * @desc   Delete transactions for the logged in user
 * @access Private
 */

transactionRouter.delete("/:id",authUser,transactionController.deleteTransactionController)

export default transactionRouter;