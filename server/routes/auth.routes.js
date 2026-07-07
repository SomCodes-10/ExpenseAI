import express from 'express';
import authController from '../controllers/auth.controller.js';
import authUser from '../middlewares/auth.Middleware.js';

const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */

authRouter.post('/register', authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @description Login a new user
 * @access Public
 */

authRouter.post('/login', authController.loginUserController);

/**
 * @route POST /api/auth/logout
 * @description Logout the user
 * @access Public
 */

authRouter.post("/logout",authController.logoutUserController)

/**
 * @route GET /api/auth/getme
 * @description Get currently logged in user details
 * @access Private
 */

authRouter.get('/getme',authUser,authController.getMeUserController)

export default authRouter;
