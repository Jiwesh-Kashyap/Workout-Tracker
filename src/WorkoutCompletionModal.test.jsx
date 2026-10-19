import { vi, expect, test } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import WorkoutCompletionModal from "./WorkoutCompletionModal";

test("does not render when isOpen is false", () => {
  render(
    <WorkoutCompletionModal
      isOpen={false}
      dayName="Chest Day"
      onClose={vi.fn()}
      onViewReport={vi.fn()}
    />
  );

  expect(screen.queryByText(/Workout Completed!/i)).not.toBeInTheDocument();
});

test("renders title, dayName, and triggers callbacks when open", () => {
  const onClose = vi.fn();
  const onViewReport = vi.fn();

  render(
    <WorkoutCompletionModal
      isOpen={true}
      dayName="Chest Day"
      onClose={onClose}
      onViewReport={onViewReport}
    />
  );

  expect(screen.getByText(/Workout Completed!/i)).toBeInTheDocument();
  expect(screen.getByText("Chest Day")).toBeInTheDocument();
  expect(screen.getByText(/automatically reset/i)).toBeInTheDocument();

  const reportBtn = screen.getByRole("button", { name: /view report/i });
  fireEvent.click(reportBtn);
  expect(onViewReport).toHaveBeenCalledTimes(1);

  const backBtn = screen.getByRole("button", { name: /back to schedule/i });
  fireEvent.click(backBtn);
  expect(onClose).toHaveBeenCalledTimes(1);
});
