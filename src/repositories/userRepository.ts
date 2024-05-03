import type { UserEntity } from "../entities/UserEntity";
import type { IUserRepository } from "./../interfaces/IUserRepository";
import { UserModel } from "../model/userModel";

export class UserRepository implements IUserRepository {
	async create(user: UserEntity): Promise<UserEntity> {
		const newUser = await UserModel.create(user);
		return newUser;
	}

	async findUserByEmail(email: string) {
		const userExistsByEmail = await UserModel.findOne({ email });
		return userExistsByEmail;
	}
}
