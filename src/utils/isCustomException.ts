import { CustomException } from "../exceptions/customExceptions";

export function isCustomException(error: any): error is CustomException {
	return (
		error instanceof CustomException ||
		(error &&
			error.statusCode !== undefined &&
			typeof error.message === "string")
	);
}
