import { vi, expect, test, beforeAll } from "vitest";
import { screen, render } from "@testing-library/react";
import App from "./App";

beforeAll(() => {
  // Lenis uses ResizeObserver which is not built into jsdom
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

test("renders App and shows loading state or schedule", async () => {
  // Mock fetch so Schedule component inside App doesn't fail on network call
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([]),
  });

  render(<App />);

  // App defaults to "/" which renders Schedule with welcome header or loading
  const welcomeHeading = screen.getByRole("heading", { name: /welcome/i });
  expect(welcomeHeading).toBeInTheDocument();
});