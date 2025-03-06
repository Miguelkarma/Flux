import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/login-form";
import { MemoryRouter } from "react-router-dom";

describe("LoginForm", () => {
  const mockOnLogin = jest.fn();

  const setup = () => {
    render(
      <MemoryRouter>
        <LoginForm onLogin={mockOnLogin} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setup();
  });

  test("renders the login form correctly", () => {
    expect(screen.getByText(/login to your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("updates email and password inputs correctly", async () => {
    const user = userEvent.setup();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("calls onLogin with email and password when form is submitted", async () => {
    const user = userEvent.setup();
    const email = "test@example.com";
    const password = "password123";

    await user.type(screen.getByLabelText(/email/i), email);
    await user.type(screen.getByLabelText(/password/i), password);
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(mockOnLogin).toHaveBeenCalledWith(email, password);
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });
});
