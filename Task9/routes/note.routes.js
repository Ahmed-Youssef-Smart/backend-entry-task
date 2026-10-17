const express = require("express");
const router = express.Router();
const noteController = require("../controllers/note.controller");
const { validate, noteSchema } = require("../validators/note.validator");
const { validateUserIdParam } = require("../validators/user.validator");
const authMiddleware = require("../middlewares/auth.middleware");

// حماية جميع المسارات بتسجيل الدخول
router.use(authMiddleware);

// جلب ملاحظات المستخدم الحالي أو الكل للمشرف
router.get("/", noteController.getAll);

// عرض ملاحظات مستخدم معين عبر الـ userId
router.get("/user/:userId", validateUserIdParam, noteController.getByUserId);

// جلب ملاحظة مفردة
router.get("/:id", noteController.getById);

// إنشاء ملاحظة جديدة باستخدام Zod Validation
router.post("/", validate(noteSchema), noteController.create);

// تعديل ملاحظة قائمة
router.put("/:id", validate(noteSchema.partial()), noteController.update);

// حذف ملاحظة
router.delete("/:id", noteController.delete);

module.exports = router;
