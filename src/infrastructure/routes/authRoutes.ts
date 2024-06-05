import { Router } from "express";
import { UserRepository } from "../../application/repositories/userRepository";
import { AuthController } from "../../controllers/authController";
import { SignInUseCase } from "../../domain/useCase/signInUseCase";
import { SignUpUseCase } from "../../domain/useCase/signUpUseCase";
import { GenerateRefreshTokenUseCase } from "../../domain/useCase/generateRefreshTokenUseCase";
import { PasswordRecoveryUseCase } from "../../domain/useCase/passwordRecoveryUseCase";
import { ValidateEmailUseCase } from "../../domain/useCase/validateEmailUseCase";

const authRouter = Router();

const userRepository = new UserRepository();

const signUpUseCase = new SignUpUseCase(userRepository);
const signInUseCase = new SignInUseCase(userRepository);
const generateRefreshTokenUseCase = new GenerateRefreshTokenUseCase(
	userRepository,
);
const passwordRecoveryUseCase = new PasswordRecoveryUseCase(userRepository);
const valiteEmailUseCase = new ValidateEmailUseCase(userRepository);

const authController = new AuthController(
	signUpUseCase,
	signInUseCase,
	generateRefreshTokenUseCase,
	passwordRecoveryUseCase,
	valiteEmailUseCase,
);

authRouter.post("/sign-up", authController.signUp);
authRouter.post("/sign-in", authController.signIn);
authRouter.post("/refresh-token", authController.refreshToken);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/email-verification", authController.emailVerification);

export default authRouter;
