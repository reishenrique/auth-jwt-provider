import { StatusCodes } from "http-status-codes";
import { passwordRecoveryValidation } from "../application/validation/passwordRecoveryValidation";
import { refreshTokenValidation } from "../application/validation/refreshTokenValidation";
import { SignInValidation } from "../application/validation/signInValidation";
import { signUpValidation } from "../application/validation/signUpValidation";
import { validateEmailValidation } from "../application/validation/validateEmailValidation";
import { isCustomException } from "../infrastructure/utils/isCustomException";
import type { AuthService } from "../domain/services/authService";
import type { Request, Response } from "express";

interface IAuthController {
	signUp(req: Request, res: Response): Promise<object>;
	signIn(req: Request, res: Response): Promise<object>;
	refreshToken(req: Request, res: Response): Promise<object>;
	forgotPassword(req: Request, res: Response): Promise<object>;
	emailVerification(req: Request, res: Response): Promise<object>;
}

export class AuthController implements IAuthController {
	constructor(private readonly authService: AuthService) {
		this.signUp = this.signUp.bind(this);
		this.signIn = this.signIn.bind(this);
		this.refreshToken = this.refreshToken.bind(this);
		this.forgotPassword = this.forgotPassword.bind(this);
		this.emailVerification = this.emailVerification.bind(this);
	}

	async signUp(req: Request, res: Response): Promise<object> {
		try {
			const user = signUpValidation.parse(req.body);
			const newUser = await this.authService.signUp(user);

			return res.status(StatusCodes.CREATED).json({
				statusCode: StatusCodes.CREATED,
				message: "User created successfully",
				user: newUser,
			});
		} catch (error) {
			console.log("Handler error: SignUp in AuthController", error);

			if (isCustomException(error)) {
				return res.status(error.statusCode).json({
					message: error.message,
				});
			}

			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
				message: "Error ocurred while executing the sign up endpoint",
			});
		}
	}

	async signIn(req: Request, res: Response): Promise<object> {
		try {
			const userCredentials = SignInValidation.parse(req.body);
			const token = await this.authService.signIn(userCredentials);

			return res.status(StatusCodes.OK).json({
				message: "Authentication successful",
				...token,
			});
		} catch (error) {
			console.log("Handler error: SignIn in AuthController");

			if (isCustomException(error)) {
				return res.status(error.statusCode).json({
					message: error.message,
				});
			}

			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
				message: "Internal Server Error",
			});
		}
	}

	async refreshToken(req: Request, res: Response): Promise<object> {
		try {
			const refreshToken = refreshTokenValidation.parse(req.body);
			const refreshAuthToken =
				await this.authService.generateRefreshToken(refreshToken);

			return res.status(StatusCodes.OK).json({
				message: "New token for user successfully generated",
				...refreshAuthToken,
			});
		} catch (error) {
			console.log("Handler error: Refresh Token in AuthController");

			if (isCustomException(error)) {
				return res.status(error.statusCode).json({
					message: error.message,
				});
			}

			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				statusCodes: StatusCodes.INTERNAL_SERVER_ERROR,
				message: "Internal Server Error",
			});
		}
	}

	async forgotPassword(req: Request, res: Response): Promise<object> {
		try {
			const { email } = passwordRecoveryValidation.parse(req.body);
			await this.authService.passwordRecovery(email);

			return res.status(StatusCodes.OK).json({
				message: "New password updated",
			});
		} catch (error) {
			console.log("Handler error: Password Recovery in AuthController");

			if (isCustomException(error)) {
				return res.status(error.statusCode).json({
					message: error.message,
				});
			}

			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				statusCodes: StatusCodes.INTERNAL_SERVER_ERROR,
				message: "Internal Server Error",
			});
		}
	}

	async emailVerification(req: Request, res: Response): Promise<object> {
		try {
			const { email } = validateEmailValidation.parse(req.body);
			await this.authService.validateEmail(email);

			return res.status(StatusCodes.OK).json({
				message: "The email sent is valid",
			});
		} catch (error) {
			console.log("Handler error: Email Verification in AuthController");

			if (isCustomException(error)) {
				return res.status(error.statusCode).json({
					message: error.message,
				});
			}

			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				statusCodes: StatusCodes.INTERNAL_SERVER_ERROR,
				message: "Internal Server Error",
			});
		}
	}
}
