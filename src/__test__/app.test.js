const request = require("supertest");
const app = require("../api/app");

describe("GET /health", () => {
  it("should return 200 with status ok", async () => {
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("should return Content-Type application/json", async () => {
    const res = await request(app).get("/health");

    expect(res.headers["content-type"]).toMatch(/json/);
  });
});