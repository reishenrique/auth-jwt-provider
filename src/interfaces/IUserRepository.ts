import type { UserEntity } from "../entities/UserEntity";

export interface IUserRepository {
	create(user: UserEntity): Promise<object>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	findUserByEmail(email: string): Promise<any>;
}
