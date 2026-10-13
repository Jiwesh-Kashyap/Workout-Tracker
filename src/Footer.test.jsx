import { expect, test } from "vitest";
import { screen, render } from "@testing-library/react";
import Footer from "./Footer";

test("renders the footer with greeting and social links", () => {
  render(<Footer />);

  // Check the greeting text
  expect(screen.getByText(/THANK YOU FOR USING/i)).toBeInTheDocument();

  // Check links
  const gitLink = screen.getByRole("link", { name: /git/i });
  expect(gitLink).toHaveAttribute("href", "https://github.com/Jiwesh-Kashyap");

  const linkedInLink = screen.getByRole("link", { name: /linkedin/i });
  expect(linkedInLink).toHaveAttribute("href", "https://www.linkedin.com/in/jiwesh-kashyap-1364b8375/");

  // Check author attribution
  expect(screen.getByText("JIWESH")).toBeInTheDocument();
});
