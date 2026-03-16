import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the Tic Tac Toe title and initial turn status", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /tic tac toe/i })).toBeInTheDocument();
  expect(screen.getByText(/turn:\s*x/i)).toBeInTheDocument();
});
