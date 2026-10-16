import { expect, test } from "vitest";
import { screen, render } from "@testing-library/react";
import ProgressChart from "./ProgressChart";

test("renders ProgressChart header and chart container", () => {
  const chartData = [
    { date: "2026-10-01", volume: 1200 },
    { date: "2026-10-08", volume: 1450 },
  ];

  render(<ProgressChart data={chartData} />);

  expect(screen.getByText(/Volume Over Time/i)).toBeInTheDocument();
});
