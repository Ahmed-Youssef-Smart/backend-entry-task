const request = require("supertest");
const app = require("../../app");

describe("Health Check API - Integration Test", () => {
    it("GET /health يجب أن يعيد حالة 200 و status OK", async () => {
        const response = await request(app).get("/health");

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("OK");
        expect(response.body).toHaveProperty("timestamp");
    });
});
