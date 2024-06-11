import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { PasswordRecoveryUseCase } from "../../domain/useCase/passwordRecoveryUseCase";
import { authRepositoryInMemory } from "../mock/userRepositoryInMemory";
import { CustomException } from "../../domain/exceptions/customExceptions";

const makeSut = (
	users?: any,
): {
	sut: PasswordRecoveryUseCase;
	mockUserRepository: IUserRepository;
} => {
	const mockUserRepository = new authRepositoryInMemory(users);
	const sut = new PasswordRecoveryUseCase(mockUserRepository);

	jest.spyOn(mockUserRepository, "findUserByEmail");
	jest.spyOn(mockUserRepository, "updateUserPasswordByEmail");

	return { sut, mockUserRepository };
};

describe("Password recovery unit tests", () => {
	beforeEach(async () => {
		jest.clearAllMocks();
	});

	it("Should throw an exception when email is not found to update password", async () => {
		const { sut, mockUserRepository } = makeSut();

		const email = "test@gmail.com";

		expect(sut.execute(email)).rejects.toThrow(
			CustomException.NotFoundException("User not found by email"),
		);

		expect(mockUserRepository.findUserByEmail).toHaveBeenCalledTimes(1);
	});

	it("Should throw an exception when email is no provided", async () => {
		const { sut, mockUserRepository } = makeSut();

		expect(sut.execute(undefined)).rejects.toThrow(
			CustomException.BadRequestException("Email is required to proceed"),
		);

		expect(mockUserRepository.findUserByEmail).not.toHaveBeenCalled();
		expect(mockUserRepository.updateUserPasswordByEmail).not.toHaveBeenCalled();
	});
});
