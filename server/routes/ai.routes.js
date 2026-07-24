import express from "express";
import authUser from "../middlewares/auth.Middleware.js";
import aiReport from "../controllers/ai.controller.js";

const aiRouter = express.Router()

/**
 * @route POST /api/ai/report
 * @description Provides the AI report to the authenticated user
 * @access Private
 */

aiRouter.post("/report",authUser,aiReport.getAiReportController)

export default aiRouter;