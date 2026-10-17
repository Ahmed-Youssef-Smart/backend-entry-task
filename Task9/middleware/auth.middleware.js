const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                status: "error",
                message: "Access denied. No token provided or invalid format (Bearer token required).",
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");

        // إرفاق بيانات المستخدم في الطلب لاستخدامها في Controllers
        req.user = decoded; // يحتوي على: { id, email, role }
        next();
    } catch (error) {
        return res.status(401).json({
            status: "error",
            message: "Invalid or expired token.",
        });
    }
};

module.exports = authMiddleware;
