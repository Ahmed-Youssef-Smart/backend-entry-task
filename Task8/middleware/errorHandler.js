const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    // التعامل مع الأخطاء العامة
    res.status(err.status || 500).json({
        message: err.message || "An unexpected error occurred",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

module.exports = errorHandler;
