import { validateEmailDomain } from "../../infrastructure/utils/dnsUtils";
import { validateMailbox } from "../../infrastructure/utils/mailerUtils";
import { CustomException } from "../exceptions/customExceptions";
import { IUserRepository } from "../interfaces/IUserRepository";

export class ValidateEmailUseCase {
	constructor(private userRepository: IUserRepository) {
		this.userRepository = userRepository;
	}

	async execute(email: string): Promise<boolean> {
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
