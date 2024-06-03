import "dotenv/config";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { CustomException } from "../exceptions/customExceptions";
import type { UserEntity } from "../entities/UserEntity";
import type { IUserRepository } from "../interfaces/IUserRepository";
import {
	generateAccessToken,
	refreshAccessToken,
} from "../../infrastructure/utils/jwtUtils";
import { send, validateMailbox } from "../../infrastructure/utils/mailerUtils";
import { validateEmailDomain } from "../../infrastructure/utils/dnsUtils";

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

	async generateRefreshToken(refreshAuthCredentials: object): Promise<object> {
		const { refreshToken, email }: { refreshToken: string; email: string } =
			refreshAuthCredentials as any;

		if (!email || email === "") {
			throw CustomException.BadRequestException(
				"User email is required to proceed with the execution",
			);
		}

		if (!refreshToken || refreshToken === "") {
			throw CustomException.BadRequestException(
				"Refresh token is required to proceed with the execution",
			);
		}

		const user = await this.userRepository.findUserByEmail(email);

		if (!user) {
			throw CustomException.NotFoundException("User not found");
		}

		const token = refreshAccessToken(refreshToken, user);

		return { token };
	}

	async passwordRecovery(email: string): Promise<void> {
		if (!email) {
			throw CustomException.BadRequestException("Email is required to proceed");
		}

		const user = await this.userRepository.findUserByEmail(email);

		if (!user) {
			throw CustomException.NotFoundException("User not found by email");
		}

		const newPassword = crypto.randomBytes(8).toString("hex");

		const subject = "Password Recovery Email";

		const body = `Your new password is ${newPassword}`;

		const sendNewPassword: any = send(user.email, subject, body);

		if (sendNewPassword instanceof Error) {
			throw CustomException.InternalServerException("Error sending email");
		}

		const saltRounds = await bcrypt.genSalt(10);

		const hashNewPassword = await bcrypt.hash(
			newPassword as string,
			saltRounds,
		);

		await this.userRepository.updateUserPasswordByEmail(email, hashNewPassword);
	}

	async validateEmail(email: string): Promise<boolean> {
		if (!email) {
			throw CustomException.BadRequestException("Email is required to proceed");
		}

		const user = await this.userRepository.findUserByEmail(email);

		if (!user) {
			throw CustomException.NotFoundException("Email not found");
		}

		const isDomainValid = await validateEmailDomain(email);

		if (!isDomainValid) {
			throw CustomException.BadRequestException(
				"The email domain does not exist",
			);
		}

		const isMailboxValid = await validateMailbox(email);

		if (!isMailboxValid) {
			throw CustomException.BadRequestException(
				"The email mailbox does not exist or cannot receive emails ",
			);
		}

		return true;
	}
}
