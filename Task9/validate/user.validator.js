const { z } = require("zod");
const { validate, userSchema, loginSchema } = require("./note.validator");

// مخطط تحديث بيانات المستخدم (حقول اختيارية مع التحقق من إرسال حقل واحد على الأقل)
const updateUserSchema = z
    .object({
        name: z.string().trim().min(3).max(100).optional(),
        email: z.string().email("يرجى إدخال بريد إلكتروني صالح").optional(),
        password: z.string().min(6, "كلمة المرور يجب ألا تقل عن 6 أحرف").optional(),
        role: z.enum(["user", "admin"]).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "يجب تقديم حقل واحد على الأقل للتحديث",
    });

// وسيط التحقق من صحة معامل معرف المستخدم (ID Param) باستخدام Zod
const validateUserIdParam = (req, res, next) => {
    const idParam = req.params.userId || req.params.id;
    const paramSchema = z.coerce.number().int().positive("معرف المستخدم يجب أن يكون رقماً موجباً");

    const result = paramSchema.safeParse(idParam);
    if (!result.success) {
        return res.status(400).json({
            status: "error",
            message: "معرف المستخدم (User ID) غير صالح",
            errors: result.error.errors.map((e) => e.message),
        });
    }
    next();
};

module.exports = {
    validate,
    userSchema,
    loginSchema,
    updateUserSchema,
    validateUserIdParam,
};
