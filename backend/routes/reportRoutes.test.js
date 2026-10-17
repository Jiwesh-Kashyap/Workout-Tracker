const request = require("supertest");
import { describe, beforeAll, afterAll, expect, test } from "vitest";
const mongoose = require("mongoose");
const app = require("../server");

describe("Report Routes API (/api/reports)", () => {
  let token;
  const dayName = "Chest Day";
  let templateWorkoutId;

  beforeAll(async () => {
    const testDbUri = "mongodb://127.0.0.1:27017/workout-tracker-test-report";
    await mongoose.connect(testDbUri);

    // Create a test user
    const signupRes = await request(app).post("/api/user/signup").send({
      name: "Report Tester",
      email: "report_tester@example.com",
      password: "password123",
    });
    token = signupRes.body.token;

    // Create a schedule and initial workout template
    await request(app)
      .post("/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        dayName: dayName,
        message: "Chest Routine",
      });

    const workoutRes = await request(app)
      .post(`/tracker/${encodeURIComponent(dayName)}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ exerciseName: "Bench Press" });

    templateWorkoutId = workoutRes.body._id;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  test("GET /api/reports/compare-last returns message when fewer than 2 sessions exist", async () => {
    const res = await request(app)
      .get("/api/reports/compare-last?exerciseName=Bench%20Press")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Not enough data to compare yet.");
  });

  test("POST /api/reports/finish saves workout session logs", async () => {
    const firstSession = {
      exercises: [
        {
          _id: templateWorkoutId,
          exerciseName: "Bench Press",
          sets: [
            { reps: 10, weight: 80, completed: true },
            { reps: 8, weight: 85, completed: true },
            { reps: 6, weight: 90, completed: false }, // uncompleted set should be ignored in volume
          ],
        },
      ],
      updateTemplate: false,
    };

    const res = await request(app)
      .post("/api/reports/finish")
      .set("Authorization", `Bearer ${token}`)
      .send(firstSession);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Workout saved successfully! ");
  });

  test("GET /api/reports/progressive-overload computes correct volume, reps, and max weight", async () => {
    const res = await request(app)
      .get("/api/reports/progressive-overload?exerciseName=Bench%20Press")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);

    const sessionData = res.body[0];
    expect(sessionData.weight).toBe(85); // max completed weight
    expect(sessionData.sets).toBe(2); // 2 completed sets
    expect(sessionData.reps).toBe(18); // 10 + 8
    expect(sessionData.volume).toBe(1480); // (10 * 80) + (8 * 85) = 800 + 680 = 1480
    expect(sessionData).toHaveProperty("date");
  });

  test("GET /api/reports/compare-last calculates diff between two sessions correctly", async () => {
    // Log a second session with higher performance
    const secondSession = {
      exercises: [
        {
          _id: templateWorkoutId,
          exerciseName: "Bench Press",
          sets: [
            { reps: 10, weight: 85, completed: true }, // 850 volume
            { reps: 8, weight: 90, completed: true }, // 720 volume
          ],
        },
      ],
      updateTemplate: true, // Also test template update
    };

    const finishRes = await request(app)
      .post("/api/reports/finish")
      .set("Authorization", `Bearer ${token}`)
      .send(secondSession);

    expect(finishRes.status).toBe(200);

    const compareRes = await request(app)
      .get("/api/reports/compare-last?exerciseName=Bench%20Press")
      .set("Authorization", `Bearer ${token}`);

    expect(compareRes.status).toBe(200);
    expect(compareRes.body.exerciseName).toBe("Bench Press");
    expect(compareRes.body.weightDiff).toBe(5); // 90 - 85 = +5
    expect(compareRes.body.repsDiff).toBe(0); // 18 - 18 = 0
    expect(compareRes.body.volumeDiff).toBe(90); // 1570 - 1480 = +90

    // Verify template was updated in the tracker
    const trackerRes = await request(app)
      .get(`/tracker/${encodeURIComponent(dayName)}`)
      .set("Authorization", `Bearer ${token}`);

    expect(trackerRes.body[0].sets.length).toBe(2);
    expect(trackerRes.body[0].sets[0].weight).toBe(85);
  });
});
