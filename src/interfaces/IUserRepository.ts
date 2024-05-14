import type { UserEntity } from "../entities/UserEntity";

export interface IUserRepository {
	create(user: UserEntity): Promise<object>;
	findUserByEmail(email: string): Promise<any>;
	updateUserById(id: string, newUserData: object): Promise<any>;
	updateUserPasswordByEmail(email: string, newPassword: string): Promise<any>;
}
