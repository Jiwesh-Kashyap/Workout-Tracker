const request = require("supertest");
import { describe, beforeAll, afterAll, expect, test } from "vitest";
const mongoose = require("mongoose");
const app = require("../server");

describe("Workout Routes API (/tracker)", () => {
  let token;
  let scheduleId;
  const dayName = "Chest Day";

  beforeAll(async () => {
    const testDbUri = "mongodb://127.0.0.1:27017/workout-tracker-test-workout";
    await mongoose.connect(testDbUri);

    // Create a test user
    const signupRes = await request(app).post("/api/user/signup").send({
      name: "Workout Tester",
      email: "workout_test@example.com",
      password: "password123",
    });
    token = signupRes.body.token;

    // Create a schedule for this user
    const scheduleRes = await request(app)
      .post("/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        dayName: dayName,
        message: "Chest routine",
      });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  test("Unauthorized request returns 401", async () => {
    const res = await request(app).get(`/tracker/${encodeURIComponent(dayName)}`);
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
  });

  test("GET /tracker/:dayName returns 404 for non-existent schedule", async () => {
    const res = await request(app)
      .get("/tracker/NonExistentDay")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Schedule not found!");
  });

  let createdWorkoutId;

  test("POST /tracker/:dayName creates a new workout in the schedule", async () => {
    const res = await request(app)
      .post(`/tracker/${encodeURIComponent(dayName)}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ exerciseName: "Bench Press" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.exerciseName).toBe("Bench Press");
    expect(res.body.sets).toEqual([]);
    expect(res.body.completed).toBe(false);

    createdWorkoutId = res.body._id;
  });

  test("GET /tracker/:dayName returns the workouts list", async () => {
    const res = await request(app)
      .get(`/tracker/${encodeURIComponent(dayName)}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].exerciseName).toBe("Bench Press");
  });

  test("PUT /tracker/:dayName with EDIT_WORKOUT updates sets", async () => {
    const updatedSets = [
      { reps: 10, weight: 60, completed: true },
      { reps: 8, weight: 65, completed: false },
    ];

    const res = await request(app)
      .put(`/tracker/${encodeURIComponent(dayName)}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        intent: "EDIT_WORKOUT",
        name: "Bench Press",
        sets: updatedSets,
      });

    expect(res.status).toBe(200);
    expect(res.body.sets.length).toBe(2);
    expect(res.body.sets[0].reps).toBe(10);
    expect(res.body.sets[0].weight).toBe(60);
    expect(res.body.sets[0].completed).toBe(true);
  });

  test("PUT /tracker/:dayName with COMPLETE_WORKOUT toggles workout completion", async () => {
    const res = await request(app)
      .put(`/tracker/${encodeURIComponent(dayName)}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        intent: "COMPLETE_WORKOUT",
        name: "Bench Press",
      });

    expect(res.status).toBe(200);
    expect(res.body.workout.completed).toBe(true);
    expect(res.body.message).toBe("successfully updated workout in db");
  });

  test("PUT /tracker/:dayName with SORT_WORKOUT updates order", async () => {
    // Add a second workout first
    const secondWorkoutRes = await request(app)
      .post(`/tracker/${encodeURIComponent(dayName)}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ exerciseName: "Incline Dumbbell Press" });

    const secondWorkoutId = secondWorkoutRes.body._id;

    // Reverse order: second workout first, first workout second
    const res = await request(app)
      .put(`/tracker/${encodeURIComponent(dayName)}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        intent: "SORT_WORKOUT",
        orderOfObjectIds: [secondWorkoutId, createdWorkoutId],
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Sorting successful in database");

    // Verify ordering via GET
    const getRes = await request(app)
      .get(`/tracker/${encodeURIComponent(dayName)}`)
      .set("Authorization", `Bearer ${token}`);

    expect(getRes.body[0].exerciseName).toBe("Incline Dumbbell Press");
    expect(getRes.body[1].exerciseName).toBe("Bench Press");
  });

  test("PATCH /tracker/:dayName resets all completed statuses", async () => {
    const res = await request(app)
      .patch(`/tracker/${encodeURIComponent(dayName)}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((workout) => {
      expect(workout.completed).toBe(false);
      workout.sets.forEach((set) => {
        expect(set.completed).toBe(false);
      });
    });
  });

  test("DELETE /tracker/:dayName deletes a workout", async () => {
    const res = await request(app)
      .delete(`/tracker/${encodeURIComponent(dayName)}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Incline Dumbbell Press" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully deleted");

    // Verify it is removed
    const getRes = await request(app)
      .get(`/tracker/${encodeURIComponent(dayName)}`)
      .set("Authorization", `Bearer ${token}`);

    expect(getRes.body.length).toBe(1);
    expect(getRes.body[0].exerciseName).toBe("Bench Press");
  });

  test("DELETE /tracker/:dayName returns 404 for non-existent workout", async () => {
    const res = await request(app)
      .delete(`/tracker/${encodeURIComponent(dayName)}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "NonExistentExercise" });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Workout not found!");
  });
});
