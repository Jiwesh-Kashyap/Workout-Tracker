import { vi, expect, test } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import CustomCheckBox from "./CustomCheckBox";

test("renders unchecked checkbox showing index number", () => {
  render(<CustomCheckBox ind={0} func={vi.fn()} checked={false} />);

  const checkbox = screen.getByRole("checkbox");
  expect(checkbox).toBeInTheDocument();
  expect(checkbox).toHaveAttribute("aria-checked", "false");
  expect(checkbox).toHaveTextContent("1"); // ind + 1 = 1
});

test("renders checked checkbox showing checkmark", () => {
  render(<CustomCheckBox ind={2} func={vi.fn()} checked={true} />);

  const checkbox = screen.getByRole("checkbox");
  expect(checkbox).toHaveAttribute("aria-checked", "true");
  expect(checkbox).toHaveTextContent("✓");
  expect(checkbox).toHaveClass("checked");
});

test("calls func with index when clicked", () => {
  const mockFunc = vi.fn().mockReturnValue(true);
  render(<CustomCheckBox ind={1} func={mockFunc} checked={false} />);

  const checkbox = screen.getByRole("checkbox");
  fireEvent.click(checkbox);

  expect(mockFunc).toHaveBeenCalledWith(1);
});

test("triggers func when Enter or Space key is pressed (accessibility)", () => {
  const mockFunc = vi.fn().mockReturnValue(true);
  render(<CustomCheckBox ind={3} func={mockFunc} checked={false} />);

  const checkbox = screen.getByRole("checkbox");

  fireEvent.keyDown(checkbox, { key: "Enter" });
  expect(mockFunc).toHaveBeenCalledWith(3);

  fireEvent.keyDown(checkbox, { key: " " });
  expect(mockFunc).toHaveBeenCalledTimes(2);
});

test("adds shaking class when func returns false (invalid action)", () => {
  // If func returns false, the checkbox should shake
  const mockFunc = vi.fn().mockReturnValue(false);
  render(<CustomCheckBox ind={0} func={mockFunc} checked={false} />);

  const checkbox = screen.getByRole("checkbox");
  fireEvent.click(checkbox);

  expect(checkbox).toHaveClass("shaking");
});
