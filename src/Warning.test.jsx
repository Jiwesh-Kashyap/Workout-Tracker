import { expect, test } from "vitest";
import { screen, render } from "@testing-library/react";
import Warning from "./Warning";

test("renders warning message and buttons", () => {
  render(<Warning />);

  expect(screen.getByText(/this will delete this record/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
});
