import { Router } from "express";
import { AuthService } from "../services/authService";
import { AuthController } from "../controllers/authController";
import { UserRepository } from "../repositories/userRepository";

const authRouter = Router();

const userRepository = new UserRepository();

const authService = new AuthService(userRepository);

const authController = new AuthController(authService);

authRouter.post("/sign-up", authController.signUp);
authRouter.post("/sign-in", authController.signIn);
authRouter.post("/refresh-token", authController.refreshToken);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/email-verification", authController.emailVerification);

export default authRouter;
