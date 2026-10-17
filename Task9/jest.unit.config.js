module.exports = {
    // بيئة التشغيل Node.js
    testEnvironment: "node",

    // أسماء ومسارات ملفات اختبارات الوحدة
    testMatch: [
        "**/*.service.test.js",
        "**/tests/unit/**/*.test.js",
    ],

    // مسح وتصفير الـ Mocks تلقائياً قبل كل اختبار
    clearMocks: true,

    // إظهار تقرير تفصيلي لكل حالة اختبار
    verbose: true,

    // تجميع تقارير تغطية الكود (اختياري)
    collectCoverage: false,
    coverageDirectory: "coverage/unit",
};
