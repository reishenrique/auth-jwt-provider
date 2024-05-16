import { StatusCodes } from "http-status-codes";
import { AuthInput } from "../validation/authValidation";
import { signUpValidation } from "../validation/signUpValidation";
import type { Request, Response } from "express";
import type { AuthService } from "../services/authService";
import { refreshTokenValidation } from "../validation/refreshTokenValidation";
import { passwordRecoveryValidation } from "../validation/passwordRecoveryValidation";
import { validateEmailValidation } from "../validation/validateEmailValidation";
import { CustomException } from "../exceptions/customExceptions";

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

			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
				message: "Error ocurred while executing the sign up endpoint",
			});
		}
	}

	async signIn(req: Request, res: Response): Promise<object> {
		try {
			const userCredentials = AuthInput.parse(req.body);
			const token = await this.authService.signIn(userCredentials);

			return res.status(StatusCodes.OK).json({
				message: "Authentication successful",
				...token,
			});
		} catch (error) {
			console.log("Handler error: SignIn in AuthController");

			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
				message:
					"Error while executing the user sign in/authentication endpoint",
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

			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				statusCodes: StatusCodes.INTERNAL_SERVER_ERROR,
				message: "Error while executing the refresh token endpoint",
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

			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				statusCodes: StatusCodes.INTERNAL_SERVER_ERROR,
				message: "Error while executing the password recovery endpoint",
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

			if (error instanceof CustomException) {
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
