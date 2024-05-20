import type { UserEntity } from "../../entities/UserEntity";
import type { IUserRepository } from "../../interfaces/IUserRepository";

export class authRepositoryInMemory implements IUserRepository {
	private users: any[] = [];
	constructor(users: any) {
		this.users = users ?? [];
	}

	async create(user: UserEntity): Promise<any> {
		this.users.push(user);
	}

	async findUserByEmail(email: string): Promise<any> {
		const user = this.users.find((user) => user.email === email);
		return user;
	}

	async updateUserById(id: string, newUserData: object): Promise<any> {
		const userIndex = this.users.findIndex((user) => user._id === id);
		if (userIndex !== -1) {
			this.users[userIndex] = { ...this.users[userIndex], ...newUserData };
			return this.users[userIndex];
		}

		return null;
	}

	async updateUserPasswordByEmail(
		email: string,
		newPassword: string,
	): Promise<any> {
		const userIndex = this.users.findIndex((user) => user.email === email);

		if (userIndex !== 1) {
			this.users[userIndex] = {
				...this.users[userIndex],
				password: newPassword,
			};
			return this.users[userIndex];
		}

		return null;
	}
}
