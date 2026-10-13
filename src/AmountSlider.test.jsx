import { vi, expect, test } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import AmountSlider from "./AmountSlider";

test("renders amount slider with initial weight value", () => {
  render(<AmountSlider sliderVal={25} setSliderVal={vi.fn()} />);

  expect(screen.getByText(/Amount->25/i)).toBeInTheDocument();
  const slider = screen.getByRole("slider");
  expect(slider).toBeInTheDocument();
  expect(slider).toHaveValue("25");
});

test("calls setSliderVal when slider range input changes", () => {
  const setSliderVal = vi.fn();
  render(<AmountSlider sliderVal={20} setSliderVal={setSliderVal} />);

  const slider = screen.getByRole("slider");
  fireEvent.change(slider, { target: { value: "35" } });

  expect(setSliderVal).toHaveBeenCalledWith(35);
});

test("increases value when add button is clicked (mouse down)", () => {
  const setSliderVal = vi.fn();
  render(<AmountSlider sliderVal={10} setSliderVal={setSliderVal} />);

  const addBtn = screen.getByRole("button", { name: /increase weight/i });
  fireEvent.mouseDown(addBtn);

  // setSliderVal was called with an updater function
  expect(setSliderVal).toHaveBeenCalled();
  const updater = setSliderVal.mock.calls[0][0];
  if (typeof updater === "function") {
    expect(updater(10)).toBe(10.5);
  }

  // Release mouse
  fireEvent.mouseUp(addBtn);
});
