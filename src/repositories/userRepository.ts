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

	async updateUserById(id: string, newUserData: object) {
		const findUserAndUpdate = await UserModel.findByIdAndUpdate(
			id,
			newUserData,
			{ new: true },
		);

		return findUserAndUpdate;
	}

	async updateUserPasswordByEmail(email: string, newPassword: string) {
		const findUserAndUpdate = await UserModel.updateOne(
			{ email },
			{ $set: { password: newPassword } },
		);

		return findUserAndUpdate;
	}
}
