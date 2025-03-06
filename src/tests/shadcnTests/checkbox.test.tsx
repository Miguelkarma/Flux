import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "@/components/ui/checkbox";

describe("Checkbox Component", () => {
  test("renders checkbox component", () => {
    render(<Checkbox data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveClass(
      "h-4 w-4 shrink-0 rounded-sm border border-primary"
    );
  });

  test("toggles checked state when clicked", async () => {
    render(<Checkbox data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");
    expect(checkbox).not.toHaveAttribute("data-state", "checked");

    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("data-state", "checked");
  });

  test("applies disabled styles when disabled", () => {
    render(<Checkbox disabled data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");
    expect(checkbox).toHaveClass(
      "disabled:cursor-not-allowed disabled:opacity-50"
    );
    expect(checkbox).toBeDisabled();
  });

  test("renders check icon when checked", async () => {
    render(<Checkbox data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");

    await userEvent.click(checkbox);

    expect(screen.getByText("MockedCheckIcon")).toBeInTheDocument();
  });
});
