import { vi, expect, test } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import DeleteImage from "./DeleteImage";

test("renders delete icon and shows tooltip on hover", () => {
  render(<DeleteImage className="test-del" onDelFunc={vi.fn()} type="exercise" />);

  expect(screen.getByText(/delete exercise/i)).toBeInTheDocument();
});

test("opens confirmation popup when delete icon is clicked", () => {
  const onDelFunc = vi.fn();
  render(<DeleteImage className="test-del" onDelFunc={onDelFunc} type="workout" />);

  const deleteIcon = document.querySelector(".lucide-trash") || document.querySelector("svg");
  fireEvent.click(deleteIcon);

  // The DeletePopUp should be displayed
  expect(screen.getByText(/WARNING!/i)).toBeInTheDocument();
  expect(screen.getByText(/delete this workout permanently/i)).toBeInTheDocument();

  // Clicking confirm calls onDelFunc
  const confirmBtn = screen.getByRole("button", { name: /confirm/i });
  fireEvent.click(confirmBtn);
  expect(onDelFunc).toHaveBeenCalledTimes(1);
});
