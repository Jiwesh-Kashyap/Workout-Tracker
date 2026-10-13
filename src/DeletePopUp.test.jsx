import { vi, expect, test } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import DeletePopUp from "./DeletePopUp";

test("renders portal delete popup with custom type in message", () => {
  render(
    <DeletePopUp
      varClass="active"
      onDelFunc={vi.fn()}
      onCancel={vi.fn()}
      type="routine"
    />
  );

  expect(screen.getByText(/WARNING!/i)).toBeInTheDocument();
  expect(
    screen.getByText(/This will delete this routine permanently!/i)
  ).toBeInTheDocument();
});

test("triggers onDelFunc and onCancel when confirm button is clicked", () => {
  const onDelFunc = vi.fn();
  const onCancel = vi.fn();

  render(
    <DeletePopUp
      varClass="active"
      onDelFunc={onDelFunc}
      onCancel={onCancel}
      type="exercise"
    />
  );

  const confirmBtn = screen.getByRole("button", { name: /confirm/i });
  fireEvent.click(confirmBtn);

  expect(onDelFunc).toHaveBeenCalledTimes(1);
  expect(onCancel).toHaveBeenCalledTimes(1);
});

test("triggers only onCancel when cancel button is clicked", () => {
  const onDelFunc = vi.fn();
  const onCancel = vi.fn();

  render(
    <DeletePopUp
      varClass="active"
      onDelFunc={onDelFunc}
      onCancel={onCancel}
    />
  );

  const cancelBtn = screen.getByRole("button", { name: /cancel/i });
  fireEvent.click(cancelBtn);

  expect(onCancel).toHaveBeenCalledTimes(1);
  expect(onDelFunc).not.toHaveBeenCalled();
});
