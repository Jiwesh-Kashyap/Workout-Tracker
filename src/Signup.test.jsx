import { vi, expect, test } from "vitest";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Signup from "./Signup";
import { UserContext } from "./UserContext";

test("renders Signup form with name, email, password and submit button", () => {
  render(
    <UserContext.Provider value={{ setName: vi.fn() }}>
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    </UserContext.Provider>
  );

  expect(screen.getByRole("heading", { name: /Sign Up/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Sign up/i })).toBeInTheDocument();
});

test("submits Signup form and triggers user creation API", async () => {
  const mockSetName = vi.fn();
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve({
        token: "fake-signup-token",
        message: "User created successfully",
      }),
  });

  render(
    <UserContext.Provider value={{ setName: mockSetName }}>
      <MemoryRouter initialEntries={["/signup"]}>
        <Signup />
      </MemoryRouter>
    </UserContext.Provider>
  );

  fireEvent.change(screen.getByLabelText(/Name/i), {
    target: { value: "Jiwesh" },
  });
  fireEvent.change(screen.getByLabelText(/Email/i), {
    target: { value: "jiwesh@test.com" },
  });
  fireEvent.change(screen.getByLabelText(/Password/i), {
    target: { value: "mypassword" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/user/signup"),
      expect.objectContaining({
        method: "POST",
      })
    );
    expect(mockSetName).toHaveBeenCalledWith("Jiwesh");
  });
});
