const request = require("supertest");
import { describe, beforeAll, afterAll, expect, test } from "vitest";
const mongoose = require("mongoose");
const app = require("../server");
import USER from "../models/user";

beforeAll(async () => {
  const testDbUri = "mongodb://127.0.0.1:27017/workout-tracker-test";
  await mongoose.connect(testDbUri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Testing for Schedule API", () => {
  //Unauthorised access
  test("Unauthorized POST request", async () => {
    const res = await request(app).post("/").send({});
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("You must be logged in to add a plan");
  });

  test("Unauthorized GET request", async () => {
    const res = await request(app).get("/").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid user!");
  });

  //Authorized access
  test("Authorized POST request", async () => {
    const email = "test2@example.com";
    const password = "secret";

    const user = await request(app).post("/api/user/signup").send({
      name: "test user2",
      email: email,
      password: password,
    });

    const token = user.body.token;

    const res = await request(app)
      .post("/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        dayName: "Push Day",
        message: "Incline Press",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Plan added to schedule successfully!");
  });

  test("Authorized GET request", async () => {
    const user = await request(app).post("/api/user/signin").send({
      email: "test2@example.com",
      password: "secret",
    });

    const token = user.body.token;
    const res = await request(app)
      .get("/")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty("dayName").toHaveProperty("message").toHaveProperty("createdBy");
  });

});
