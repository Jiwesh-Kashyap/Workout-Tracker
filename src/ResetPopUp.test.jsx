import { vi, expect, test } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import ResetPopUp from "./ResetPopUp";

test("renders reset confirmation popup with message", () => {
  render(<ResetPopUp varClass="active" onConfirm={vi.fn()} onCancel={vi.fn()} />);

  expect(screen.getByText(/RESET PROGRESS!/i)).toBeInTheDocument();
  expect(
    screen.getByText(/Are you sure you want to reset all progress for this day\?/i)
  ).toBeInTheDocument();
});

test("calls onConfirm and onCancel when confirm button is clicked", () => {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();

  render(<ResetPopUp varClass="active" onConfirm={onConfirm} onCancel={onCancel} />);

  const confirmBtn = screen.getByRole("button", { name: /confirm/i });
  fireEvent.click(confirmBtn);

  expect(onConfirm).toHaveBeenCalledTimes(1);
  expect(onCancel).toHaveBeenCalledTimes(1);
});

test("calls onCancel when cancel button is clicked", () => {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();

  render(<ResetPopUp varClass="active" onConfirm={onConfirm} onCancel={onCancel} />);

  const cancelBtn = screen.getByRole("button", { name: /cancel/i });
  fireEvent.click(cancelBtn);

  expect(onCancel).toHaveBeenCalledTimes(1);
  expect(onConfirm).not.toHaveBeenCalled();
});
