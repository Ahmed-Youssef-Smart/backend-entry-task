const userRepository = require("../repositories/user.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthService {
    constructor() {
        this.userRepository = userRepository;
    }

    async register(data) {
        const existing = await this.userRepository.findByEmail(data.email);
        if (existing) {
            const error = new Error("Email already exists");
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = await this.userRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role || "user",
        });

        return { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    }

    async login(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;
        }

        // إنشاء التوكن
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || "default_secret_key",
            { expiresIn: "1d" }
        );

        return {
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        };
    }
}

module.exports = new AuthService();
