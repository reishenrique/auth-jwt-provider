import type { Request, Response } from 'express'
import type { AuthService } from '../services/authService'
import { StatusCodes } from 'http-status-codes';
import { AuthInput } from '../validation/authValidation';

interface IAuthController {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    signIn(req: Request, res: Response): Promise<any>
}

class AuthController implements IAuthController {
	constructor(private readonly authService: AuthService) {
		this.signIn = this.signIn.bind(this);
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	async signIn(req: Request, res: Response): Promise<any> {
		try {
			const { email, password } = AuthInput.parse(req.body)
			const authorization = await this.authService.authenticate(email, password);

			res.status(StatusCodes.OK).json({
				message: "Successful authentication",
				token: authorization,
			});
		} catch (error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
				message:
					"Error while executing the user sign in/authentication endpoint",
			});
		}
	}
}

export default AuthController

