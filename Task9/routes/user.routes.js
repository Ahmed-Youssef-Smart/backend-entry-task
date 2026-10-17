const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const noteController = require("../controllers/note.controller");
const { validate, userSchema, updateUserSchema, validateUserIdParam } = require("../validators/user.validator");
const authMiddleware = require("../middlewares/auth.middleware");

// حماية مسارات المستخدمين بتسجيل الدخول
router.use(authMiddleware);

// جلب جميع المستخدمين
router.get("/", userController.getAll);

// جلب مستخدم بواسطة ID مع التحقق من صحة الرقم
router.get("/:id", validateUserIdParam, userController.getById);

// إنشاء مستخدم جديد
router.post("/", validate(userSchema), userController.create);

// تحديث بيانات المستخدم مع التحقق من صحة الحقول المدخلة بـ Zod
router.put("/:id", validateUserIdParam, validate(updateUserSchema), userController.update);

// حذف مستخدم
router.delete("/:id", validateUserIdParam, userController.delete);

// جلب ملاحظات مستخدم محدد
router.get("/:userId/notes", validateUserIdParam, noteController.getByUserId);

module.exports = router;
