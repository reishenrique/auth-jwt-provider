import { CustomException } from "../../domain/exceptions/customExceptions";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { AuthService } from "../../domain/services/authService";
import { authRepositoryInMemory } from "../mock/userRepositoryInMemory";

const makeSut = (
	users?: any,
): { sut: AuthService; mockUserRepository: IUserRepository } => {
	const mockUserRepository = new authRepositoryInMemory(users);
	const sut = new AuthService(mockUserRepository);

	jest.spyOn(mockUserRepository, "create");
	jest.spyOn(mockUserRepository, "findUserByEmail");

	return { sut, mockUserRepository };
};

describe("Sign up unit tests", () => {
	beforeEach(async () => {
		jest.clearAllMocks();
	});

	it("Should return a successfully registered new user (SignUp)", async () => {
		const user = {
			userName: "John Doe",
			email: "test@email.com",
			password: "testpassword@123",
		};

		const { sut, mockUserRepository } = makeSut();

		const newUser = await sut.signUp(user);

		expect(newUser.email).toBe(user.email);
		expect(newUser).toBeDefined();

		expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
		expect(mockUserRepository.findUserByEmail).toHaveBeenCalledTimes(1);
	});

	it("Should throw an exception when email already registered in the system (SignUp)", async () => {
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
});
