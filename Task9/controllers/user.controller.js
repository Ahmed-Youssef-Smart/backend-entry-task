const userService = require("../services/user.service");

class UserController {
    constructor() {
        this.userService = userService;
    }

    async getAll(req, res) {
        try {
            const users = await this.userService.getAllUsers();
            res.json({ status: "success", data: users });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const user = await this.userService.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ status: "error", message: "User not found" });
            }
            res.json({ status: "success", data: user });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    }

    async create(req, res) {
        try {
            const newUser = await this.userService.createUser(req.body);
            res.status(201).json({ status: "success", data: newUser });
        } catch (error) {
            res.status(400).json({ status: "error", message: error.message });
        }
    }

    async update(req, res) {
        try {
            if (req.user.id !== req.params.id && req.user.role !== "admin") {
                return res.status(403).json({ status: "error", message: "Access forbidden" });
            }

            const updatedUser = await this.userService.updateUser(req.params.id, req.body);
            if (!updatedUser) {
                return res.status(404).json({ status: "error", message: "User not found" });
            }
            res.json({ status: "success", data: updatedUser });
        } catch (error) {
            res.status(400).json({ status: "error", message: error.message });
        }
    }

    async delete(req, res) {
        try {
            if (req.user.id !== req.params.id && req.user.role !== "admin") {
                return res.status(403).json({ status: "error", message: "Access forbidden" });
            }

            const deleted = await this.userService.deleteUser(req.params.id);
            if (!deleted) {
                return res.status(404).json({ status: "error", message: "User not found" });
            }
            res.json({ status: "success", message: "User deleted successfully" });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    }
}

module.exports = new UserController();
