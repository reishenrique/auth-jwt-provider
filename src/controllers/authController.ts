import { StatusCodes } from "http-status-codes";
import { AuthInput } from "../validation/authValidation";
import { signUpValidation } from "../validation/signUpValidation";
import type { Request, Response } from "express";
import type { AuthService } from "../services/authService";
import { refreshTokenValidation } from "../validation/refreshTokenValidation";

interface IAuthController {
	signUp(req: Request, res: Response): Promise<object>;
	signIn(req: Request, res: Response): Promise<object>;
	refreshToken(req: Request, res: Response): Promise<object>;
	passwordRecovery(req: Request, res: Response): unknown;
	emailVerification(req: Request, res: Response): unknown;
}

export class AuthController implements IAuthController {
	constructor(private readonly authService: AuthService) {
		this.signUp = this.signUp.bind(this);
		this.signIn = this.signIn.bind(this);
		this.refreshToken = this.refreshToken.bind(this);
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

	async passwordRecovery(req: Request, res: Response) {}

	async emailVerification(req: Request, res: Response) {}
}
