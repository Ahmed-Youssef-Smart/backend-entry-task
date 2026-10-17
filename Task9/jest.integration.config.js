module.exports = {
    testEnvironment: "node",
    testMatch: [
        "**/tests/integration/**/*.test.js",
        "**/*.integration.test.js",
    ],
    verbose: true,
    testTimeout: 10000, // مهلة كافية لطلبات HTTP
};
