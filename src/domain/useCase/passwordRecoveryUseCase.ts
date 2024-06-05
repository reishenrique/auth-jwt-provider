import { send } from "../../infrastructure/utils/mailerUtils";
import { CustomException } from "../exceptions/customExceptions";
import { IUserRepository } from "../interfaces/IUserRepository";
import crypto from "node:crypto";
import bcrypt from "bcrypt";

export class PasswordRecoveryUseCase {
	constructor(private userRepository: IUserRepository) {
		this.userRepository = userRepository;
	}

	async execute(email: string): Promise<void> {
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
}
