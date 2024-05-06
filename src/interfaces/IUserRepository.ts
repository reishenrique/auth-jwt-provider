import type { UserEntity } from "../entities/UserEntity";

export interface IUserRepository {
	create(user: UserEntity): Promise<object>;
	findUserByEmail(email: string): Promise<any>;
}
