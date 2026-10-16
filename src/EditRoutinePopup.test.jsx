import { vi, expect, test } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import EditRoutinePopup from "./EditRoutinePopup";

test("renders EditRoutinePopup with old values and handles save/cancel", () => {
  const onSave = vi.fn();
  const onCancel = vi.fn();

  render(
    <EditRoutinePopup
      oldName="Chest Day"
      oldMessage="Bench & Flys"
      onSave={onSave}
      onCancel={onCancel}
    />
  );

  expect(screen.getByText(/EDIT ROUTINE/i)).toBeInTheDocument();

  const nameInput = screen.getByDisplayValue("Chest Day");
  const messageInput = screen.getByDisplayValue("Bench & Flys");

  fireEvent.change(nameInput, { target: { value: "Chest & Triceps" } });
  fireEvent.change(messageInput, { target: { value: "Push power" } });

  const saveBtn = screen.getByRole("button", { name: /save/i });
  fireEvent.click(saveBtn);

  expect(onSave).toHaveBeenCalledWith("Chest & Triceps", "Push power");

  const cancelBtn = screen.getByRole("button", { name: /cancel/i });
  fireEvent.click(cancelBtn);
  expect(onCancel).toHaveBeenCalledTimes(1);
});
