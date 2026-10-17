module.exports = (roles = []) => {
    if (typeof roles === "string") {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.user || (roles.length > 0 && !roles.includes(req.user.role))) {
            return res.status(403).json({ status: "error", message: "Forbidden: You do not have permission to access this resource." });
        }
        next();
    };
};
