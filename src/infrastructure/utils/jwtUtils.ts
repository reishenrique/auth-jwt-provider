import { env } from "../config/validateEnv";
import jwt from "jsonwebtoken";

export const generateAccessToken = (user: any) => {
	const payload = {
		id: user._id,
		email: user.email,
		username: user.userName,
	};

	const secret = env.SECRET as string;

	const expiresIn: jwt.SignOptions = {
		expiresIn: "8h",
	};

	const refreshExpiresIn: jwt.SignOptions = {
		expiresIn: "7d",
	};

	const token = jwt.sign(payload, secret, expiresIn);

	const refreshToken = jwt.sign(payload, secret, refreshExpiresIn);

	return { token, refreshToken };
};

export const refreshAccessToken = (refreshToken: string, user: any) => {
	const secret = env.SECRET as string;

	const verifyRefreshToken = jwt.verify(refreshToken, secret || "");
	if (!verifyRefreshToken) return;

	const { token }: { token: string } = generateAccessToken(user);

	return token;
};
