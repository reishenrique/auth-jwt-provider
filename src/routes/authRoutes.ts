import { Router } from 'express'
import { verifyToken } from '../middleware/verifyToken'
import { AuthService } from '../services/authService';
import AuthController from '../controllers/authController';

const authRouter = Router()

const authService = new AuthService()

const authController = new AuthController(authService);

authRouter.post("/auth", verifyToken, authController.signIn);

export default authRouter