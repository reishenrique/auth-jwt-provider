import { CustomException } from "../../exceptions/customExceptions";
import { AuthService } from "../../services/authService";
import { authRepositoryInMemory } from "../mock/userRepositoryInMemory";
import type { IUserRepository } from "../../interfaces/IUserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const makeSut = (
	users?: any,
): { sut: AuthService; mockUserRepository: IUserRepository } => {
	const mockUserRepository = new authRepositoryInMemory(users);
	const sut = new AuthService(mockUserRepository);

	jest.spyOn(mockUserRepository, "create");
	jest.spyOn(mockUserRepository, "findUserByEmail");
	jest.spyOn(mockUserRepository, "updateUserById");
	jest.spyOn(mockUserRepository, "updateUserPasswordByEmail");

	return { sut, mockUserRepository };
};

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth Service unit tests", () => {
	const mockedBcryptCompare = bcrypt.compare as jest.Mock;
	const mockedJwtSign = jwt.sign as jest.Mock;

	beforeEach(async () => {
		jest.clearAllMocks();
	});

	it("Should return a successfully registered new user", async () => {
		const user = {
			userName: "John Doe",
			email: "test@email.com",
			password: "testpassword@123",
		};

		const { sut, mockUserRepository } = makeSut();

		const newUser = await sut.signUp(user);

		expect(newUser.email).toBe(user.email);

		expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
		expect(mockUserRepository.findUserByEmail).toHaveBeenCalledTimes(1);
	});

	it("Should throw an exception when email already registered in the system", async () => {
		const user = {
			userName: "John Doe",
			email: "test@email.com",
			password: "testpassword@123",
		};

		const { sut, mockUserRepository } = makeSut([user]);

		expect(sut.signUp(user)).rejects.toThrow(
			CustomException.ConflictException("E-mail already registered"),
		);

		expect(mockUserRepository.findUserByEmail).toHaveBeenCalledTimes(1);
		expect(mockUserRepository.create).not.toHaveBeenCalled;
	});

	it("Should return token and refresh token when credentials are correct", async () => {
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

		const signIn = await sut.signIn(mockUser);

		// the signIn function should return the tokens according to the mocked values above
		expect(signIn).toEqual({
			token: "mockedToken",
			refreshToken: "mockedRefreshToken",
		});

		expect(mockUserRepository.findUserByEmail).toHaveBeenCalledTimes(1);
	});

	it("Should throw an exception when the passwords do not match", async () => {
		const mockUser = {
			email: "test@gmail.com",
			password: "testpassword@123",
		};

		const { sut } = makeSut([mockUser]);

		mockedBcryptCompare.mockResolvedValue(false);

		expect(sut.signIn(mockUser)).rejects.toThrow(
			CustomException.UnauthorizedException("Invalid password"),
		);

		expect(sut.signIn).not.toHaveBeenCalled;
	});

	it("Should throw an exception when the user not found to login", async () => {
		const { sut, mockUserRepository } = makeSut();

		const mockUser = {
			email: "test@gmail.com",
			password: "testpassword@123",
		};

		expect(sut.signIn(mockUser)).rejects.toThrow(
			CustomException.UnauthorizedException("Unauthorized"),
		);

		expect(mockUserRepository.findUserByEmail).toHaveBeenCalledTimes(1);
		expect(sut.signIn).not.toHaveBeenCalled;
	});
});
