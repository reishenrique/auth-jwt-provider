import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { authRepositoryInMemory } from "../mock/userRepositoryInMemory";
import { CustomException } from "../../domain/exceptions/customExceptions";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SignInUseCase } from "../../domain/useCase/signInUseCase";

const makeSut = (
	users?: any,
): { sut: SignInUseCase; mockUserRepository: IUserRepository } => {
	const mockUserRepository = new authRepositoryInMemory(users);
	const sut = new SignInUseCase(mockUserRepository);

	jest.spyOn(mockUserRepository, "findUserByEmail");

	return { sut, mockUserRepository };
};

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Sign in unit tests", () => {
	const mockedBcryptCompare = bcrypt.compare as jest.Mock;
	const mockedJwtSign = jwt.sign as jest.Mock;

	beforeEach(async () => {
		jest.clearAllMocks();
	});

	it("Should return token and refresh token when credentials are correct (SignIn)", async () => {
		const mockUser = {
			email: "test@gmail.com",
			password: "testpassword@123",
		};

		const { sut, mockUserRepository } = makeSut([mockUser]);

		// mocking compare method of bcrypt to return true in the user password comparison
		mockedBcryptCompare.mockResolvedValue(true);

		// mocking jwt.sign to set fixed values in the user's sign-in return
		mockedJwtSign.mockReturnValueOnce("mockedToken");
		mockedJwtSign.mockReturnValueOnce("mockedRefreshToken");

		const signIn = await sut.execute(mockUser);

		// the signIn function should return the tokens according to the mocked values above
		expect(signIn).toEqual({
			token: "mockedToken",
			refreshToken: "mockedRefreshToken",
		});

		expect(signIn).toBeDefined();

		expect(mockUserRepository.findUserByEmail).toHaveBeenCalledTimes(1);
	});

	it("Should throw an exception when the passwords do not match (SignIn)", async () => {
		const mockUser = {
			email: "test@gmail.com",
			password: "testpassword@123",
		};

		const { sut } = makeSut([mockUser]);

		mockedBcryptCompare.mockResolvedValue(false);

		expect(sut.execute(mockUser)).rejects.toThrow(
			CustomException.UnauthorizedException("Invalid password"),
		);

		expect(sut.execute).not.toHaveBeenCalled;
	});

	it("Should throw an exception when the user not found to login (SignIn)", async () => {
		const { sut, mockUserRepository } = makeSut();

		const mockUser = {
			email: "test@gmail.com",
			password: "testpassword@123",
		};

		expect(sut.execute(mockUser)).rejects.toThrow(
			CustomException.UnauthorizedException("Unauthorized"),
		);

		expect(mockUserRepository.findUserByEmail).toHaveBeenCalledTimes(1);
		expect(sut.execute).not.toHaveBeenCalled;
	});
});
