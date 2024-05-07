import "dotenv/config";
import jwt from "jsonwebtoken";

export const generateAccessToken = (user: any) => {
	const payload = {
		id: user._id,
		email: user.email,
		username: user.userName,
	};

	const secret = process.env.SECRET as string;

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
