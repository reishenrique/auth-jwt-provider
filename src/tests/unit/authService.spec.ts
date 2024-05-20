import { IUserRepository } from "../../interfaces/IUserRepository";
import { AuthService } from "../../services/authService";
import { authRepositoryInMemory } from "../mock/userRepositoryInMemory";

const makeSut = (users?: any): { sut: AuthService, mockUserRepository: IUserRepository} => {
    const mockUserRepository = new authRepositoryInMemory(users)
    const sut = new AuthService(mockUserRepository)

    jest.spyOn(mockUserRepository, "create")
    jest.spyOn(mockUserRepository, "findUserByEmail")
    jest.spyOn(mockUserRepository, "updateUserById")
    jest.spyOn(mockUserRepository, "updateUserPasswordByEmail")

    return { sut, mockUserRepository }
}

describe("Auth Service unit tests", () => {
    beforeEach( async () => {
        jest.clearAllMocks()
    })

    it("Should return a successfully registered new user", async () => {
        const user = {
            userName: "John Doe",
            email: "test@email.com",
            password: "testpassword@123"
        }

        const { sut, mockUserRepository } = makeSut()

        const newUser = await sut.signUp(user)

        expect(newUser.email).toBe(user.email)
        
        expect(mockUserRepository.create).toHaveBeenCalledTimes(1)
        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledTimes(1)
    })
})