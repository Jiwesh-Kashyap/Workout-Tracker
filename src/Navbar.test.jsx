import { vi, expect, test, beforeEach } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { UserContext } from "./UserContext";

test("check if signin link is rendered correcty", () => {
  render(
    //memory router is a fake router that mocks browser router
    //initial entries simulates a history, so here it is only home page
    <UserContext.Provider value={{ setName: vi.fn() }}>
      <MemoryRouter initialEntries={["/"]}>
        <Navbar name="User" />
      </MemoryRouter>
    </UserContext.Provider>,
  );
  const signIn = screen.getByRole("link", { name: /sign\s*in/i });
  expect(signIn).toBeInTheDocument();

  expect(signIn).toHaveAttribute("href", "/signin");
});

test("check if logout is rendered correctly", () => {
  render(
    <UserContext.Provider value={{ setName: vi.fn() }}>
      <MemoryRouter initialEntries={["/"]}>
        <Navbar name="Jiwesh" />
      </MemoryRouter>
    </UserContext.Provider>,
  );
  const logout = screen.getByRole("button", { name: /log\s*out/i });
  expect(logout).toBeInTheDocument();
});

test("clicking logout triggers logout api", async () => {
  global.fetch = vi.fn().mockResolvedValue({ ok: true });
  const mockSetName = vi.fn();

  render(
    <UserContext.Provider value={{ setName: mockSetName }}>
      <MemoryRouter initialEntries={["/"]}>
        <Navbar name="Jiwesh"></Navbar>
      </MemoryRouter>
    </UserContext.Provider>,
  );

  const logout = screen.getByRole("button", {name: /log out/i});
  fireEvent.click(logout);

  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining("/api/user/logout"),
    expect.any(Object)
  );
});
