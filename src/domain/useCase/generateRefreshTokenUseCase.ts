import { refreshAccessToken } from "../../infrastructure/utils/jwtUtils";
import { CustomException } from "../exceptions/customExceptions";
import { IUserRepository } from "../interfaces/IUserRepository";

export class GenerateRefreshTokenUseCase {
	constructor(private userRepository: IUserRepository) {
		this.userRepository = userRepository;
	}

	async execute(refreshAuthCredentials: object): Promise<object> {
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
}
