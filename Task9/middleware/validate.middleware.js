const { z } = require("zod");

const userSchema = z.object({
    name: z.string({ required_error: "Name is required" }).min(3, "Name must be at least 3 characters").max(100),
    email: z.string({ required_error: "Email is required" }).email("Invalid email address"),
    password: z.string({ required_error: "Password is required" }).min(6, "Password must be at least 6 characters"),
    role: z.enum(["user", "admin"]).optional().default("user"),
});

const updateUserSchema = z.object({
    name: z.string().min(3).max(100).optional(),
    email: z.string().email("Invalid email address").optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    role: z.enum(["user", "admin"]).optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
});

const loginSchema = z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email address"),
    password: z.string({ required_error: "Password is required" }).min(1, "Password is required"),
});

const noteSchema = z.object({
    title: z.string({ required_error: "Title is required" }).trim().min(1, "Title cannot be empty").max(255),
    content: z.string({ required_error: "Content is required" }).trim().min(1, "Content cannot be empty"),
});

const updateNoteSchema = z.object({
    title: z.string().trim().min(1).max(255).optional(),
    content: z.string().trim().min(1).optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
});

const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                status: "error",
                message: "Validation failed",
                errors: error.errors.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                })),
            });
        }
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

module.exports = {
    validate,
    userSchema,
    updateUserSchema,
    loginSchema,
    noteSchema,
    updateNoteSchema,
};
