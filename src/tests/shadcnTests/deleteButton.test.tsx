import { render, screen, fireEvent } from "@testing-library/react";
import DeleteButton from "@/components/ui/deleteButton";

describe("DeleteButton", () => {
  test("renders DeleteButton correctly", () => {
    render(<DeleteButton />);

    const button = screen.getByRole("button", { name: /delete/i });
    expect(button).toBeInTheDocument();
  });

  test("triggers onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<DeleteButton onClick={handleClick} />);

    const button = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("renders children inside the button if provided", () => {
    render(<DeleteButton>Delete</DeleteButton>);

    const buttonText = screen.getByText(/delete/i);
    expect(buttonText).toBeInTheDocument();
  });
});
