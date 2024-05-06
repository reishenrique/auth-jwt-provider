import { StatusCodes } from "http-status-codes";

export class CustomException extends Error {
	public readonly statusCode: number;
	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
	}

	static UnauthorizedException(message: string): CustomException {
		return new CustomException(message, StatusCodes.UNAUTHORIZED);
	}

	static ConflictException(message: string): CustomException {
		return new CustomException(message, StatusCodes.CONFLICT);
	}

	static NotFoundException(message: string): CustomException {
		return new CustomException(message, StatusCodes.NOT_FOUND);
	}
}
