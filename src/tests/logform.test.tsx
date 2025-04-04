import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/login-form";
import { useNavigate } from "react-router-dom";

// Mock the react-router-dom useNavigate hook
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

// Mock the UI components
jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: any;
  }) => <button {...props}>{children}</button>,
}));

jest.mock("@/components/ui/input", () => ({
  Input: ({
    icon: Icon,
    ...props
  }: {
    icon?: React.ElementType;
    [key: string]: any;
  }) => (
    <div>
      {Icon && <span data-testid="input-icon"></span>}
      <input {...props} />
    </div>
  ),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  EyeOff: () => <div data-testid="eye-off-icon">EyeOff</div>,
  KeyRound: () => <div data-testid="key-icon">KeyRound</div>,
  Mail: () => <div data-testid="mail-icon">Mail</div>,
}));

// Mock the SmallLoader component
jest.mock("@/Animation/SmallLoader", () => ({
  __esModule: true,
  default: () => <div data-testid="small-loader">Loading...</div>,
}));

describe("LoginForm", () => {
  const mockOnLogin = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it("renders the login form correctly", () => {
    render(<LoginForm onLogin={mockOnLogin} />);

    // Check if important elements are rendered
    expect(screen.getByText("START FOR FREE")).toBeInTheDocument();
    expect(screen.getByText(/login to your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("updates email and password fields when user types", async () => {
    render(<LoginForm onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("calls onLogin with email and password when form is submitted", async () => {
    mockOnLogin.mockResolvedValueOnce(undefined);

    render(<LoginForm onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    expect(mockOnLogin).toHaveBeenCalledWith("test@example.com", "password123");
  });

  it("shows loader when form is submitting", async () => {
    let resolveLogin: () => void;
    const loginPromise = new Promise<void>((resolve) => {
      resolveLogin = resolve;
    });

    mockOnLogin.mockReturnValueOnce(loginPromise);

    render(<LoginForm onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    // Loader should be visible
    expect(screen.getByTestId("small-loader")).toBeInTheDocument();

    // Resolve the login promise
    resolveLogin!();

    // Wait for the loader to disappear
    await waitFor(() => {
      expect(screen.queryByTestId("small-loader")).not.toBeInTheDocument();
    });
  });

  it("navigates to registration page when sign up link is clicked", async () => {
    render(<LoginForm onLogin={mockOnLogin} />);

    const signUpLink = screen.getByText(/sign up/i);
    await userEvent.click(signUpLink);

    expect(mockNavigate).toHaveBeenCalledWith("/Registration");
  });
});
