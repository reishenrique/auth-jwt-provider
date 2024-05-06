import "dotenv/config";
import jwt from "jsonwebtoken";

export const generateAccesToken = (user: any) => {
	const payload = {
		id: user._id,
		email: user.email,
		username: user.userName,
	};

	const secret = process.env.SECRET as string;

	const expiresIn: jwt.SignOptions = {
		expiresIn: "8h",
	};

	const token = jwt.sign(payload, secret, expiresIn);

	return token;
};
