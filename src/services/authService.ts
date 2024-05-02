import 'dotenv/config'
import jwt from 'jsonwebtoken'
import { CustomException } from '../exceptions/customExceptions'

export class AuthService {
		private readonly SECRET_KET = process.env.SECRET;

		async authenticate(email: string, password: string): Promise<string> {
			if (email === "email" && password === "password") {
				const token = jwt.sign({ email }, this.SECRET_KET as string);
				return token;
			}

			throw CustomException.UnauthorizedException("Unathorized");
		}
	}