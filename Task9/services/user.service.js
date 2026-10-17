const userRepository = require("../repositories/user.repository");
const bcrypt = require("bcrypt"); // لتشفير كلمة المرور إن تم تحديثها

class UserService {
    constructor() {
        this.userRepository = userRepository;
    }

    async getAllUsers() {
        return await this.userRepository.findAll();
    }

    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        return user;
    }

    async createUser(userData) {
        // التحقق من عدم تكرار البريد الإلكتروني
        const existing = await this.userRepository.findByEmail(userData.email);
        if (existing) {
            const error = new Error("Email already registered");
            error.statusCode = 400;
            throw error;
        }

        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        return await this.userRepository.create({
            ...userData,
            password: hashedPassword,
        });
    }

    async updateUser(id, updateData) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        // إذا تم تغيير الإيميل نتأكد أنه غير مستخدم
        if (updateData.email && updateData.email !== user.email) {
            const emailExists = await this.userRepository.findByEmail(updateData.email);
            if (emailExists) {
                const error = new Error("Email already in use");
                error.statusCode = 400;
                throw error;
            }
        }

        // إذا تم تغيير كلمة المرور نشفرها
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        return await this.userRepository.update(id, updateData);
    }

    async deleteUser(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        return await this.userRepository.delete(id);
    }
}

module.exports = new UserService();
