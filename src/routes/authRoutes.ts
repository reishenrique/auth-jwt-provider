import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { AuthService } from "../services/authService";
import { AuthController } from "../controllers/authController";
import { UserRepository } from "../repositories/userRepository";

const authRouter = Router();

const userRepository = new UserRepository();

const authService = new AuthService(userRepository);

const authController = new AuthController(authService);

authRouter.post("/signup", authController.signUp);
authRouter.post("/signin", verifyToken, authController.signIn);

export default authRouter;
