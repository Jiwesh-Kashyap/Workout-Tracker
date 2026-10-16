import { vi, expect, test } from "vitest";
import { screen, render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Schedule from "./Schedule";
import { UserContext } from "./UserContext";

test("renders Schedule and displays fetched routine plans", async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          _id: "plan-1",
          dayName: "Leg Day",
          message: "Quads & Hamstrings",
          checker: false,
        },
      ]),
  });

  render(
    <UserContext.Provider value={{ name: "Jiwesh", setName: vi.fn() }}>
      <MemoryRouter>
        <Schedule />
      </MemoryRouter>
    </UserContext.Provider>
  );

  // Check for Header or loaded content
  await waitFor(() => {
    expect(screen.getByText("Leg Day")).toBeInTheDocument();
    expect(screen.getByText("Quads & Hamstrings")).toBeInTheDocument();
  });
});
