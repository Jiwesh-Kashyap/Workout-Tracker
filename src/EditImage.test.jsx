import { vi, expect, test } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import EditImage from "./EditImage";

test("renders edit icon and calls onClickFunc when clicked", () => {
  const onClickFunc = vi.fn();
  render(<EditImage onClickFunc={onClickFunc} className="edit-test" />);

  expect(screen.getByText(/edit exercise/i)).toBeInTheDocument();

  const editIcon = document.querySelector(".lucide-square-pen") || document.querySelector("svg");
  fireEvent.click(editIcon);

  expect(onClickFunc).toHaveBeenCalledTimes(1);
});
