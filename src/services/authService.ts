import "dotenv/config";
import bcrypt from "bcrypt";
import { CustomException } from "../exceptions/customExceptions";
import type { UserEntity } from "../entities/UserEntity";
import type { IUserRepository } from "../interfaces/IUserRepository";
import { generateAccesToken } from "../utils/jwtUtils";

export class AuthService {
	constructor(private userRepository: IUserRepository) {
		this.userRepository = userRepository;
	}

	async signUp(user: UserEntity): Promise<UserEntity> {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

	async signIn(userCredentials: object): Promise<string> {
		const { email, password }: { email: string; password: string } =
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

		const token = generateAccesToken(user);

		return token;
	}

	// Generate refresh token for authenticated user
	async generateRefreshToken(userId: string) {}

	// Verify access token
	async verifyAccessToken(token: string) {}
}
