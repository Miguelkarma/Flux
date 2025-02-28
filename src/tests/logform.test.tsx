import { render, screen, fireEvent } from "@testing-library/react";
import { LoginForm } from "@/components/login-form";
import { MemoryRouter } from "react-router-dom";

describe("LoginForm", () => {
  const mockOnLogin = jest.fn(); // Mock function for login

  beforeEach(() => {
    render(
      <MemoryRouter>
        <LoginForm onLogin={mockOnLogin} />
      </MemoryRouter>
    );
  });

  // Test if the login form renders correctly
  test("renders the login form correctly", () => {
    expect(screen.getByText(/login to your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  // Test if email and password inputs update correctly
  test("updates email and password inputs correctly", () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  // Test if onLogin is called with the correct values on form submission
  test("calls onLogin with email and password when form is submitted", () => {
    const email = "test@example.com";
    const password = "password123";

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: email },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: password },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(mockOnLogin).toHaveBeenCalledWith(email, password);
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });
});
