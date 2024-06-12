import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/validateEnv";
import { CustomException } from "../../domain/exceptions/customExceptions";

export const verifyToken = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const secret = env.SECRET;
	const tokenHeader = req.headers.authorization;

	const token = tokenHeader?.split(" ")[1];

	if (!token) {
		return next(CustomException.UnauthorizedException("Token Unauthorized"));
	}

	try {
		const decodedToken = jwt.verify(token, secret || "");
		res.locals.token = decodedToken;

		next();
	} catch (error) {
		console.log(
			"Error when executing token verification, invalid JWT signature",
		);

		next(error);
	}
};
