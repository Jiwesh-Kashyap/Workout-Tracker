import { vi, expect, test } from "vitest";
import { screen, render, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ReportPage from "./ReportPage";

test("renders ReportPage with dayName from route parameter and options", async () => {
  global.fetch = vi.fn().mockImplementation((url) => {
    if (url.includes("/tracker/")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { exerciseName: "Squats" },
            { exerciseName: "Leg Press" },
          ]),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          { date: "2026-10-01", volume: 1000 },
          { date: "2026-10-08", volume: 1200 },
        ]),
    });
  });

  render(
    <MemoryRouter initialEntries={["/Legs/report"]}>
      <Routes>
        <Route path="/:dayName/report" element={<ReportPage />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByRole("heading", { name: /Legs Report/i })).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText("Squats")).toBeInTheDocument();
  });
});
