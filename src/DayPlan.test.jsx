import { vi, expect, test } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DayPlan from "./DayPlan";

test("renders DayPlan with name and content", () => {
  render(
    <MemoryRouter>
      <DayPlan
        name="Push Day"
        content="Chest, Shoulders, Triceps"
        checker={false}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    </MemoryRouter>
  );

  expect(screen.getByText("Push Day")).toBeInTheDocument();
  expect(screen.getByText("Chest, Shoulders, Triceps")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /view report/i })).toBeInTheDocument();
});

test("opens options dropdown and triggers delete and edit callbacks", () => {
  const onDelete = vi.fn();
  const onEdit = vi.fn();

  render(
    <MemoryRouter>
      <DayPlan
        name="Pull Day"
        content="Back & Biceps"
        checker={false}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </MemoryRouter>
  );

  // Click options dropdown
  const ellipsis = document.querySelector(".lucide-ellipsis-vertical") || document.querySelector("svg");
  fireEvent.click(ellipsis);

  // Click Edit Plan
  const editOption = screen.getByText(/Edit Plan/i);
  fireEvent.click(editOption);
  expect(onEdit).toHaveBeenCalledTimes(1);

  // Open again and click Delete Plan
  fireEvent.click(ellipsis);
  const deleteOption = screen.getByText(/Delete Plan/i);
  fireEvent.click(deleteOption);
  expect(onDelete).toHaveBeenCalledWith("Pull Day");
});
