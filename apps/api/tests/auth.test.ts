import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/utils/prisma";
import bcrypt from "bcryptjs";

describe("Auth endpoints", () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = "password123";
  const testName = "Test User";

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { contains: "test-" } } });
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ email: testEmail, password: testPassword, name: testName });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testEmail);
      expect(res.body.data.user.role).toBe("USER");
    });

    it("should not register with duplicate email", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ email: testEmail, password: testPassword, name: testName });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it("should validate input", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ email: "invalid", password: "short", name: "" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should login with valid credentials", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: testEmail, password: testPassword });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testEmail);
    });

    it("should reject invalid credentials", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: testEmail, password: "wrongpassword" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/auth/me", () => {
    it("should return current user with valid token", async () => {
      const loginRes = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: testEmail, password: testPassword });

      const token = loginRes.body.data.token;

      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testEmail);
    });

    it("should reject without token", async () => {
      const res = await request(app).get("/api/v1/auth/me");
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/v1/auth/logout", () => {
    it("should logout successfully", async () => {
      const res = await request(app).post("/api/v1/auth/logout");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
