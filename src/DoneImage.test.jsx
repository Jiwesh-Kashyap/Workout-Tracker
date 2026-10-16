import { expect, test } from "vitest";
import { screen, render } from "@testing-library/react";
import DoneImage from "./DoneImage";

test("renders mark as completed text container", () => {
  render(<DoneImage className="test-done" />);

  expect(screen.getByText(/mark as completed/i)).toBeInTheDocument();
});
