const Joi = require("joi");

const userSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("user", "admin").optional(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const postSchema = Joi.object({
    post_title: Joi.string().min(1).max(255).required(),
    post_content: Joi.string().min(1).required(),
});

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = {
    validate,
    userSchema,
    loginSchema,
    postSchema,
};
