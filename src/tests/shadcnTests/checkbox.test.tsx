import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "@/components/ui/checkbox";

jest.mock("lucide-react", () => ({
  Check: () => <svg role="img" />,
}));

describe("Checkbox Component", () => {
  test("renders without crashing", () => {
    render(<Checkbox data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  test("toggles checked state when clicked", () => {
    render(<Checkbox data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");

    expect(checkbox).not.toHaveAttribute("data-state", "checked");
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("data-state", "checked");
    fireEvent.click(checkbox);
    expect(checkbox).not.toHaveAttribute("data-state", "checked");
  });

  test("renders check icon when checked", () => {
    render(<Checkbox data-testid="checkbox" defaultChecked />);
    const checkIcon = screen.getByRole("img", { hidden: true });
    expect(checkIcon).toBeInTheDocument();
  });

  test("is disabled when disabled prop is set", () => {
    render(<Checkbox data-testid="checkbox" disabled />);
    const checkbox = screen.getByTestId("checkbox");
    expect(checkbox).toBeDisabled();
  });
});
