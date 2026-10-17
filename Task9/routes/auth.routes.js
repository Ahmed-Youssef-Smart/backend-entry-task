const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { validate, userSchema, loginSchema } = require("../validators/note.validator");

// تسجيل مستخدم جديد
router.post("/register", validate(userSchema), authController.register);

// تسجيل الدخول
router.post("/login", validate(loginSchema), authController.login);

module.exports = router;
