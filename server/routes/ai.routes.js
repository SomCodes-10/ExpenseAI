import express from "express";
import authUser from "../middlewares/auth.Middleware.js";
import aiReport from "../controllers/ai.controller.js";

const aiRouter = express.Router()

/**
 * @route GET
 * @description provides the ai report to the user
 * @access private
 */

aiRouter.post("/report",authUser,aiReport.getAiReportController)

export default aiRouter;