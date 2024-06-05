import type { UserEntity } from "../entities/UserEntity";
import { CustomException } from "../exceptions/customExceptions";
import type { IUserRepository } from "../interfaces/IUserRepository";
import bcrypt from "bcrypt";

export class SignUpUseCase {
	constructor(private userRepository: IUserRepository) {
		this.userRepository = userRepository;
	}

	async execute(user: UserEntity): Promise<UserEntity> {
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
}
