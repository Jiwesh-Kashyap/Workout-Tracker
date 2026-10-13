import { vi, expect, test } from "vitest";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Signin from "./Signin";
import { UserContext } from "./UserContext";

test("renders Signin form with email, password inputs and submit button", () => {
  render(
    <UserContext.Provider value={{ setName: vi.fn() }}>
      <MemoryRouter>
        <Signin />
      </MemoryRouter>
    </UserContext.Provider>
  );

  expect(screen.getByRole("heading", { name: /Sign In/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Sign in/i })).toBeInTheDocument();
});

test("submits form and calls signin API and updates user state", async () => {
  const mockSetName = vi.fn();
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve({
        user: { name: "Jiwesh" },
        token: "fake-jwt-token",
      }),
  });

  render(
    <UserContext.Provider value={{ setName: mockSetName }}>
      <MemoryRouter initialEntries={["/signin"]}>
        <Signin />
      </MemoryRouter>
    </UserContext.Provider>
  );

  fireEvent.change(screen.getByLabelText(/Email/i), {
    target: { value: "jiwesh@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/Password/i), {
    target: { value: "password123" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Sign in/i }));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/user/signin"),
      expect.objectContaining({
        method: "POST",
      })
    );
    expect(mockSetName).toHaveBeenCalledWith("Jiwesh");
  });
});
