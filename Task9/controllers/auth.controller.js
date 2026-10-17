const authService = require("../services/auth.service");

class AuthController {
    constructor() {
        this.authService = authService;
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }

    async register(req, res) {
        try {
            const user = await this.authService.register(req.body);
            res.status(201).json({
                status: "success",
                message: "User registered successfully",
                data: user,
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                status: "error",
                message: error.message,
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.status(200).json({
                status: "success",
                message: "Logged in successfully",
                data: result,
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                status: "error",
                message: error.message,
            });
        }
    }
}

module.exports = new AuthController();
