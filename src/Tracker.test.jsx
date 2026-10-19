import { vi, expect, test } from "vitest";
import { screen, render, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Tracker from "./Tracker";

test("renders Tracker for a specific day with workouts", async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          _id: "w-1",
          exerciseName: "Barbell Squat",
          numOfSets: 4,
          numOfReps: 6,
          weight: 100,
          completed: false,
          sets: [],
        },
      ]),
  });

  render(
    <MemoryRouter initialEntries={["/tracker/Legs"]}>
      <Routes>
        <Route path="/tracker/:dayName" element={<Tracker />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("Barbell Squat")).toBeInTheDocument();
    expect(screen.getByText("PLAN 1")).toBeInTheDocument();
  });
});

test("resets plan and opens WorkoutCompletionModal when finish-workout event is triggered", async () => {
  global.fetch = vi.fn().mockImplementation((url) => {
    if (url.includes("/api/reports/finish")) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ message: "Workout saved successfully! " }) });
    }
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            _id: "w-1",
            exerciseName: "Barbell Squat",
            completed: true,
            sets: [{ reps: 5, weight: 120, completed: true }],
          },
        ]),
    });
  });

  render(
    <MemoryRouter initialEntries={["/tracker/Legs"]}>
      <Routes>
        <Route path="/tracker/:dayName" element={<Tracker />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("Barbell Squat")).toBeInTheDocument();
  });

  // Dispatch finish-workout event
  window.dispatchEvent(new CustomEvent("finish-workout", { detail: { updateTemplate: false } }));

  await waitFor(() => {
    expect(screen.getByText("Workout Completed!")).toBeInTheDocument();
    expect(screen.getByText(/automatically reset/i)).toBeInTheDocument();
  });
});

