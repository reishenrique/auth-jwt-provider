import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { CustomException } from "../exceptions/customExceptions";
import type { UserEntity } from "../entities/UserEntity";
import type { IUserRepository } from "../interfaces/IUserRepository";

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

		const secret = process.env.SECRET as string;

		const payload = {
			id: user._id,
			email: user.email,
			username: user.userName,
		};

		const options: jwt.SignOptions = {
			expiresIn: "8h",
		};

		const token = jwt.sign(payload, secret, options);

		return token;
	}

	// Generate token for authenticated user
	async generateAccessToken(userId: string) {}

	// Generate refresh token for authenticated user
	async generateRefreshToken(userId: string) {}

	// Verify access token
	async verifyAccessToken(token: string) {}
}
