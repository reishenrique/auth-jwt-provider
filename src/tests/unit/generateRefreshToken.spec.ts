import { CustomException } from "../../domain/exceptions/customExceptions";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { GenerateRefreshTokenUseCase } from "../../domain/useCase/generateRefreshTokenUseCase";
import { authRepositoryInMemory } from "../mock/userRepositoryInMemory";

const makeSut = (
	users?: any,
): {
	sut: GenerateRefreshTokenUseCase;
	mockUserRepository: IUserRepository;
} => {
	const mockUserRepository = new authRepositoryInMemory(users);
	const sut = new GenerateRefreshTokenUseCase(mockUserRepository);

	jest.spyOn(mockUserRepository, "create");
	jest.spyOn(mockUserRepository, "findUserByEmail");

	return { sut, mockUserRepository };
};

jest.mock("jsonwebtoken");

describe("Generate refresh token unit tests", () => {
	beforeEach(async () => {
		jest.clearAllMocks();
	});

	it("Should generate a refresh token for the user (GenerateRefreshToken)", async () => {
		const mockedUser = {
			email: "test@gmail.com",
			refreshToken: "mockedRefreshToken",
		};

		const { sut, mockUserRepository } = makeSut([mockedUser]);

		const createRefreshToken = await sut.execute(mockedUser);

		expect(createRefreshToken).toBeDefined();
		expect(typeof createRefreshToken).toBe("object");

		expect(mockUserRepository.findUserByEmail).toHaveBeenCalledTimes(1);
	});

	it("Should throw an exception when the user is not found by email (GenerateRefreshToken)", async () => {
		const { sut, mockUserRepository } = makeSut();

		const mockedUser = {
			email: "test@gmail.com",
			refreshToken: "mockedRefreshToken",
		};

		expect(sut.execute(mockedUser)).rejects.toThrow(
			CustomException.NotFoundException("User not found"),
		);

		expect(mockUserRepository.findUserByEmail).toHaveBeenCalledTimes(1);
	});

	it("Should throw an exception when the email is not provided (GenerateRefreshToken)", async () => {
		const { sut, mockUserRepository } = makeSut();

		const mockedUser = { email: "", refreshToken: "mockedRefreshToken" };

		expect(sut.execute(mockedUser)).rejects.toThrow(
			CustomException.BadRequestException(
				"User email is required to proceed with the execution",
			),
		);

		expect(mockUserRepository.findUserByEmail).not.toHaveBeenCalled();
	});

	it("Should throw an exception when the refreshToken is not provided (GenerateRefreshToken)", async () => {
		const { sut, mockUserRepository } = makeSut();

		const mockedUser = { email: "teste@email.com", refreshToken: "" };

		expect(sut.execute(mockedUser)).rejects.toThrow(
			CustomException.BadRequestException(
				"Refresh token is required to proceed with the execution",
			),
		);

		expect(mockUserRepository.findUserByEmail).not.toHaveBeenCalled();
	});
});
