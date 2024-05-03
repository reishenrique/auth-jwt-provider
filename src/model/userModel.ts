import { Schema, model } from "mongoose";

export interface IUserModel {
	userName: string;
	email: string;
	password: string;
}

const userSchema = new Schema<IUserModel>({
	userName: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
});

export const UserModel = model<IUserModel>("User", userSchema);
