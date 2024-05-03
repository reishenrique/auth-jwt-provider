import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { AuthInput } from "../validation/authValidation";
import type { Request, Response } from "express";
import type { AuthService } from "../services/authService";

interface IAuthController {
	signUp(req: Request, res: Response): Promise<object>;
	signIn(req: Request, res: Response): Promise<object>;
}

export class AuthController implements IAuthController {
	constructor(private readonly authService: AuthService) {
		this.signUp = this.signUp.bind(this);
	}

	async signUp(req: Request, res: Response): Promise<object> {
		try {
			const userSchema = z.object({
				userName: z.string().optional(),
				email: z.string().email().optional(),
				password: z.string().optional(),
			});

			const user = userSchema.parse(req.body);
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
			const authorization = await this.authService.signIn(userCredentials);

			return res.status(StatusCodes.OK).json({
				message: "Successful authentication",
				token: authorization,
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
}
