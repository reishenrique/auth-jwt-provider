import "dotenv/config";
import bcrypt from "bcrypt";
import { CustomException } from "../exceptions/customExceptions";
import type { UserEntity } from "../entities/UserEntity";
import type { IUserRepository } from "../interfaces/IUserRepository";
import { generateAccessToken, refreshAccessToken } from "../utils/jwtUtils";

export class AuthService {
	constructor(private userRepository: IUserRepository) {
		this.userRepository = userRepository;
	}

	async signUp(user: UserEntity): Promise<UserEntity> {
		const { email }: { email: string } = user as any;

		const userExistsByEmail = await this.userRepository.findUserByEmail(email);

		if (userExistsByEmail) {
			throw CustomException.ConflictException("E-mail already registered");
		}

		const saltRounds = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(user.password as string, saltRounds);

		const newUser = { ...user, password: hashPassword };

		await this.userRepository.create(newUser);

		return newUser;
	}

	async signIn(userCredentials: object): Promise<object> {
		const { email, password }: { email: string; password: string } =
			userCredentials as any;

		const user = await this.userRepository.findUserByEmail(email);

		if (!user) {
			throw CustomException.UnauthorizedException("Unauthorized");
		}

		const isValidPassword = await bcrypt.compareSync(
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

	async generateRefreshToken(refreshAuthCredentials: object): Promise<object> {
		const { refreshToken, email }: { refreshToken: string; email: string } =
			refreshAuthCredentials as any;

		if (!refreshToken || refreshToken === "") {
			throw CustomException.BadRequestException(
				"Refresh token is required to proceed with the execution",
			);
		}

		if (!email || email === "") {
			throw CustomException.BadRequestException(
				"User email is required to proceed with the execution",
			);
		}

		const user = this.userRepository.findUserByEmail(email);

		if (!user) {
			throw CustomException.NotFoundException("User not found");
		}

		const token = refreshAccessToken(refreshToken, user);

		return { token };
	}
}
