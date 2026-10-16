import { expect, test } from "vitest";
import { screen, render } from "@testing-library/react";
import WorkoutComparison from "./DirectWorkoutComparsion";

test("renders fallback when comparisonData is empty or has message", () => {
  render(<WorkoutComparison comparisonData={null} />);
  expect(screen.getByText(/Not enough data to compare/i)).toBeInTheDocument();
});

test("renders weight and volume differences correctly", () => {
  const comparisonData = {
    weightDiff: 5,
    volumeDiff: -50,
  };

  render(<WorkoutComparison comparisonData={comparisonData} />);

  expect(screen.getByText(/Compared to last session/i)).toBeInTheDocument();
  expect(screen.getByText(/5 kg/i)).toBeInTheDocument();
  expect(screen.getByText(/50 kg/i)).toBeInTheDocument();
});
