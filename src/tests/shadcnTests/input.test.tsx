import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Input } from "@/components/ui/input";

describe("Input Component", () => {
  it("renders the input component", () => {
    render(<Input data-testid="custom-input" />);
    expect(screen.getByTestId("custom-input")).toBeInTheDocument();
  });

  it("accepts and displays user input", () => {
    render(<Input data-testid="custom-input" />);
    const input = screen.getByTestId("custom-input");

    fireEvent.change(input, { target: { value: "Hello World" } });

    expect(input).toHaveValue("Hello World");
  });

  it("applies additional class names", () => {
    render(<Input data-testid="custom-input" className="custom-class" />);
    expect(screen.getByTestId("custom-input")).toHaveClass("custom-class");
  });

  it("is disabled when the disabled prop is set", () => {
    render(<Input data-testid="custom-input" disabled />);
    expect(screen.getByTestId("custom-input")).toBeDisabled();
  });
});
