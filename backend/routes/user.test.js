const request = require("supertest");
import { describe, beforeAll, afterAll, expect, test } from "vitest";
const mongoose = require("mongoose");
const app = require("../server");

beforeAll(async () => {
  const testDbUri = "mongodb://127.0.0.1:27017/workout-tracker-test";
  await mongoose.connect(testDbUri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("User Auth Api", () => {
  test("POST /api/user/signup creates a new user and returns a JWT token", async () => {
    const res = await request(app).post("/api/user/signup").send({
      name: "test user",
      email: "test@example.com",
      password: "secret",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.message).toBe("User created successfully");
  });

  //test if duplicate email is checked
  test("POST /api/user/signup rejects duplicate email", async () => {
    const res = await request(app).post("/api/user/signup").send({
      name: "Test User 2",
      email: "test@example.com",
      password: "secretpassword",
    });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/already in use/i);
  });

  test("hashed password is saved in database", async () => {
    const plainPassword = "plainpassword";

    await request(app).post("/api/user/signup").send({
      name: "test user 3",
      email: "test2@example.com",
      password: plainPassword,
    });

    const savedUser = await mongoose
      .model("user")
      .findOne({ email: "test2@example.com" });

    expect(savedUser.password).not.toBe(plainPassword);
    expect(savedUser.password).toMatch(/^\$2[aby]\$.{56}$/);
  });

  test("POST /api/user/signup fails when required fields are missing", async () => {
    const res = await request(app).post("/api/user/signup").send({
      name: "Incomplete User",
    });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });


  //SIGN IN
  test("POST /api/user/signin checks if user does not exist", async () => {
    const res = await request(app).post("/api/user/signin").send({
        email: "new@example.com",
        password: "secret"
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/incorrect email or password/i);
  })

  test("POST /api/user/signin generates token", async () => {
    const res = await request(app).post("/api/user/signin").send({
        email: "test@example.com",
        password: "secret"
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("POST /api/user/signin invalidates entry with incomplete input", async () => {
    const res = await request(app).post("/api/user/signin").send({
        name: "user3"
    });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });


  //LOGOUT
  test("POST /api/user/logout", async () => {
    const res = await request(app).post("/api/user/logout").send({});

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully logged out");
  })
});
