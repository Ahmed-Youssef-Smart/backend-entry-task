const { z } = require("zod");

// دالة وسيطة عامة (Middleware) للتحقق من صحة المدخلات باستخدام Zod
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            status: "error",
            message: "Validation Error",
            errors: result.error.errors.map((err) => ({
                field: err.path.join("."),
                message: err.message,
            })),
        });
    }
    // إسناد البيانات بعد التحقق والتنظيف
    req.body = result.data;
    next();
};

// مخطط التحقق من الملاحظة (Note Schema)
const noteSchema = z.object({
    title: z
        .string({ required_error: "العنوان حقل إجباري" })
        .trim()
        .min(3, "يجب ألا يقل العنوان عن 3 أحرف")
        .max(255, "لا يمكن أن يتجاوز العنوان 255 حرفاً"),
    content: z
        .string({ required_error: "المحتوى حقل إجباري" })
        .trim()
        .min(1, "لا يمكن ترك المحتوى فارغاً"),
});

// مخطط إنشاء / تسجيل المستخدم (User Schema)
const userSchema = z.object({
    name: z
        .string({ required_error: "اسم المستخدم إجباري" })
        .trim()
        .min(3, "يجب ألا يقل الاسم عن 3 أحرف")
        .max(100, "لا يمكن أن يتجاوز الاسم 100 حرف"),
    email: z
        .string({ required_error: "البريد الإلكتروني إجباري" })
        .email("يرجى إدخال بريد إلكتروني صالح"),
    password: z
        .string({ required_error: "كلمة المرور إجبارية" })
        .min(6, "كلمة المرور يجب ألا تقل عن 6 أحرف"),
    role: z.enum(["user", "admin"]).default("user").optional(),
});

// مخطط تسجيل الدخول (Login Schema)
const loginSchema = z.object({
    email: z
        .string({ required_error: "البريد الإلكتروني إجباري" })
        .email("يرجى إدخال بريد إلكتروني صالح"),
    password: z
        .string({ required_error: "كلمة المرور إجبارية" })
        .min(1, "كلمة المرور مطلوبة"),
});

module.exports = {
    validate,
    userSchema,
    loginSchema,
    noteSchema,
};
