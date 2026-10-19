import { vi, expect, test } from "vitest";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import Input from "./Input";

test("renders exercise input form correctly", () => {
  render(<Input onAddExercise={vi.fn()} />);

  expect(screen.getByText(/Log the exercise/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Bench Press/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /Add Workout/i }),
  ).toBeInTheDocument();
});

test("submits exercise name when form is submitted", async () => {
  const onAddExercise = vi.fn().mockResolvedValue(true);
  render(<Input onAddExercise={onAddExercise} />);

  const input = screen.getByPlaceholderText(/Bench Press/i);
  const submitBtn = screen.getByRole("button", { name: /Add Workout/i });

  fireEvent.change(input, { target: { value: "Squats" } });
  fireEvent.click(submitBtn);

  await waitFor(() => {
    expect(onAddExercise).toHaveBeenCalledWith(
      expect.objectContaining({
        exerciseName: "Squats",
      }),
    );
  });
});

test("submits selected setType when changed", async () => {
  const onAddExercise = vi.fn().mockResolvedValue(true);
  render(<Input onAddExercise={onAddExercise} />);

  const input = screen.getByPlaceholderText(/Bench Press/i);
  const select = screen.getByRole("combobox");
  const submitBtn = screen.getByRole("button", { name: /Add Workout/i });

  fireEvent.change(input, { target: { value: "Incline Press" } });
  fireEvent.change(select, { target: { value: "Partials" } });
  fireEvent.click(submitBtn);

  await waitFor(() => {
    expect(onAddExercise).toHaveBeenCalledWith(
      expect.objectContaining({
        exerciseName: "Incline Press",
        setType: "Partials",
      }),
    );
  });
});

