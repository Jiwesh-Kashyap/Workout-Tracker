import { vi, expect, test } from "vitest";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import { Plus } from "lucide-react";

import Row from "./Row";

test("rendered correctly with exercise name and index", () => {
  const item = {
    exerciseName: "lat pull downs",
    numOfSets: 3,
    numOfReps: 8,
    weight: 70,
    completed: false,
    sets: [],
  };
  render(
    <table>
      <tbody>
        <Row
          item={item}
          index={1}
          handleDelete={vi.fn()}
          dayName="Pull Day"
          onEditClick={vi.fn()}
          onUpdateItem={vi.fn()}
        />
      </tbody>
    </table>,
  );

  const row = screen.getByRole("row");
  expect(row).toBeInTheDocument();

  expect(screen.getByText("2")).toBeInTheDocument();

  // 3. Check the exercise name
  expect(screen.getByText("lat pull downs")).toBeInTheDocument();
});

test("renders setType badge when setType is present", () => {
  const item = {
    exerciseName: "lateral raises",
    setType: "Partials",
    sets: [],
  };
  render(
    <table>
      <tbody>
        <Row
          item={item}
          index={0}
          handleDelete={vi.fn()}
          dayName="Shoulder Day"
          onEditClick={vi.fn()}
          onUpdateItem={vi.fn()}
        />
      </tbody>
    </table>,
  );

  expect(screen.getByText("lateral raises")).toBeInTheDocument();
  expect(screen.getByText("Partials")).toBeInTheDocument();
});

//tests for all the functions


//add set
test("handle add set button", () => {
  const onUpdateItem = vi.fn();

  global.fetch = vi.fn().mockResolvedValue({ ok: true });

  const item = {
    exerciseName: "lat pull downs",
    numOfSets: 3,
    numOfReps: 8,
    weight: 70,
    completed: false,
    sets: [],
  };
  render(
    <table>
      <tbody>
        <Row
          item={item}
          index={1}
          handleDelete={vi.fn()}
          dayName="Pull Day"
          onEditClick={vi.fn()}
          onUpdateItem={onUpdateItem}
        />
      </tbody>
    </table>,
  );
  const addButton = screen.getByRole("button", { name: /add set/i });
  fireEvent.click(addButton);

  expect(screen.getByPlaceholderText(/reps/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/weight/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText(/reps/i), {
    target: {
      value: "10"
    },
  });
  fireEvent.change(screen.getByPlaceholderText(/weight/i), {
    target: {
      value: "75"
    },
  });

  const saveButton = screen.getByRole("button", { name: /save/i });
  fireEvent.click(saveButton);

  expect(onUpdateItem).toHaveBeenCalledWith(
    expect.objectContaining({
      exerciseName: "lat pull downs",
      sets: [
        expect.objectContaining({ reps: 10, weight: 75, completed: false }),
      ],
    }),
  );
});
