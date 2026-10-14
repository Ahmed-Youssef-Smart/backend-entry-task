const { z } = require("zod");

const userSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(50),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["user", "admin"]).optional(),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

const postSchema = z.object({
    post_title: z.string().min(1, "Title is required").max(255),
    post_content: z.string().min(1, "Content cannot be empty"),
});

// Middleware للتحقق باستخدام Zod
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        // Zod يُرجع مصفوفة أخطاء تحت issues
        const errorMessage = result.error.issues[0].message;
        return res.status(400).json({ message: errorMessage });
    }
    req.body = result.data; // ميزة Zod: يقوم بتنظيف وتمرير البيانات المطابقة فقط
    next();
};

module.exports = {
    validate,
    userSchema,
    loginSchema,
    postSchema,
};
