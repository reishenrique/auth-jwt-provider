import { StatusCodes } from 'http-status-codes'

export class CustomException extends Error {
    public readonly statusCode: number
    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
    }

    static UnathorizedException(message: string): CustomException {
        return new CustomException(message, StatusCodes.UNAUTHORIZED)
    }
}