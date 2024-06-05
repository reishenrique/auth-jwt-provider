import { generateAccessToken } from "../../infrastructure/utils/jwtUtils";
import { CustomException } from "../exceptions/customExceptions";
import { IUserRepository } from "../interfaces/IUserRepository";
import bcrypt from "bcrypt";

export class SignInUseCase {
	constructor(private userRepository: IUserRepository) {
		this.userRepository = userRepository;
	}

	async execute(userCredentials: object): Promise<object> {
		const { email, password }: { email: string; password: string } =
			userCredentials as any;

		const user = await this.userRepository.findUserByEmail(email);

		if (!user) {
			throw CustomException.UnauthorizedException("Unauthorized");
		}

		const isValidPassword = await bcrypt.compare(
			password as string,
			user.password,
		);

		if (!isValidPassword) {
			throw CustomException.UnauthorizedException("Invalid password");
		}

		const { token, refreshToken }: { token: string; refreshToken: string } =
			generateAccessToken(user);

		return { token, refreshToken };
	}
}
