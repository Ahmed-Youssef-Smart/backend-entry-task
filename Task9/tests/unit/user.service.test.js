const userService = require("../../services/user.service");
const userRepository = require("../../repositories/user.repository");
const bcrypt = require("bcrypt");

// عمل Mock للطبقات الخارجية
jest.mock("../../repositories/user.repository");
jest.mock("bcrypt");

describe("UserService - Unit Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getUserById", () => {
        it("يجب أن يرجع بيانات المستخدم عند العثور عليه", async () => {
            const mockUser = { id: 1, name: "Ahmed", email: "ahmed@example.com" };
            userRepository.findById.mockResolvedValue(mockUser);

            const result = await userService.getUserById(1);

            expect(userRepository.findById).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockUser);
        });

        it("يجب أن يرمي خطأ 404 عند عدم وجود المستخدم", async () => {
            userRepository.findById.mockResolvedValue(null);

            await expect(userService.getUserById(99)).rejects.toThrow("User not found");
        });
    });

    describe("createUser", () => {
        it("يجب أن يرمي خطأ إذا كان البريد الإلكتروني مسجلاً مسبقاً", async () => {
            userRepository.findByEmail.mockResolvedValue({ id: 2, email: "exist@mail.com" });

            await expect(
                userService.createUser({ email: "exist@mail.com", password: "123" })
            ).rejects.toThrow("Email already registered");

            expect(userRepository.create).not.toHaveBeenCalled();
        });

        it("يجب أن يشفر كلمة المرور وينشئ المستخدم بنجاح", async () => {
            userRepository.findByEmail.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue("hashed_secret_password");

            const newUser = {
                id: 1,
                name: "Sara",
                email: "sara@mail.com",
                password: "hashed_secret_password",
            };
            userRepository.create.mockResolvedValue(newUser);

            const result = await userService.createUser({
                name: "Sara",
                email: "sara@mail.com",
                password: "plain_password",
            });

            expect(bcrypt.hash).toHaveBeenCalledWith("plain_password", 10);
            expect(userRepository.create).toHaveBeenCalledWith({
                name: "Sara",
                email: "sara@mail.com",
                password: "hashed_secret_password",
            });
            expect(result).toEqual(newUser);
        });
    });

    describe("deleteUser", () => {
        it("يجب أن يرمي خطأ 404 إذا لم يتم العثور على المستخدم لحذفه", async () => {
            userRepository.findById.mockResolvedValue(null);

            await expect(userService.deleteUser(999)).rejects.toThrow("User not found");
            expect(userRepository.delete).not.toHaveBeenCalled();
        });

        it("يجب أن يحذف المستخدم بنجاح عند وجوده", async () => {
            userRepository.findById.mockResolvedValue({ id: 1 });
            userRepository.delete.mockResolvedValue(true);

            const result = await userService.deleteUser(1);

            expect(userRepository.delete).toHaveBeenCalledWith(1);
            expect(result).toBe(true);
        });
    });
});
