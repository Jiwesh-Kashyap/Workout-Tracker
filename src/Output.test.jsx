import { vi, expect, test } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import Output from "./Output";

test("renders Output table with exercise items and reset button", () => {
  const list = [
    {
      _id: "1",
      exerciseName: "Bench Press",
      numOfSets: 3,
      numOfReps: 8,
      weight: 80,
      completed: false,
      sets: [],
    },
    {
      _id: "2",
      exerciseName: "Incline Dumbbell Press",
      numOfSets: 3,
      numOfReps: 10,
      weight: 24,
      completed: false,
      sets: [],
    },
  ];

  render(
    <Output
      list={list}
      setList={vi.fn()}
      onDelete={vi.fn()}
      dayName="Chest Day"
      handleReset={vi.fn()}
    />
  );

  expect(screen.getByText("PLAN 1")).toBeInTheDocument();
  expect(screen.getByText("Bench Press")).toBeInTheDocument();
  expect(screen.getByText("Incline Dumbbell Press")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /reset progress/i })).toBeInTheDocument();
});

test("shows reset confirmation modal when reset button is clicked", () => {
  const handleReset = vi.fn();

  render(
    <Output
      list={[]}
      setList={vi.fn()}
      onDelete={vi.fn()}
      dayName="Chest Day"
      handleReset={handleReset}
    />
  );

  const resetBtn = screen.getByRole("button", { name: /reset progress/i });
  fireEvent.click(resetBtn);

  expect(screen.getByText(/RESET PROGRESS!/i)).toBeInTheDocument();
});
