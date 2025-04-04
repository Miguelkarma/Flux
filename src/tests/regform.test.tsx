import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegistrationForm } from "@/components/registration-form";
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

jest.mock("@/components/ui/label", () => ({
  Label: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: any;
  }) => <label {...props}>{children}</label>,
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  EyeOff: () => <div data-testid="eye-off-icon">EyeOff</div>,
  KeyRound: () => <div data-testid="key-icon">KeyRound</div>,
  Mail: () => <div data-testid="mail-icon">Mail</div>,
  User: () => <div data-testid="user-icon">User</div>,
}));

// Mock the SmallLoader component
jest.mock("@/Animation/SmallLoader", () => ({
  __esModule: true,
  default: () => <div data-testid="small-loader">Loading...</div>,
}));

describe("RegistrationForm", () => {
  const mockOnRegister = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it("renders the registration form correctly", () => {
    render(<RegistrationForm onRegister={mockOnRegister} />);

    // Check if important elements are rendered
    expect(screen.getByText("START FOR FREE")).toBeInTheDocument();
    expect(screen.getByText(/create your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it("updates username, email, and password fields when user types", async () => {
    render(<RegistrationForm onRegister={mockOnRegister} />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(usernameInput, "testuser");
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    expect(usernameInput).toHaveValue("testuser");
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("calls onRegister with username, email, and password when form is submitted", async () => {
    mockOnRegister.mockResolvedValueOnce(undefined);

    render(<RegistrationForm onRegister={mockOnRegister} />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    await userEvent.type(usernameInput, "testuser");
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    expect(mockOnRegister).toHaveBeenCalledWith(
      "testuser",
      "test@example.com",
      "password123"
    );
  });

  it("shows loader when form is submitting", async () => {
    // Create a promise that we can resolve manually to control the timing
    let resolveRegister: () => void;
    const registerPromise = new Promise<void>((resolve) => {
      resolveRegister = resolve;
    });

    mockOnRegister.mockReturnValueOnce(registerPromise);

    render(<RegistrationForm onRegister={mockOnRegister} />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    await userEvent.type(usernameInput, "testuser");
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    // Loader should be visible
    expect(screen.getByTestId("small-loader")).toBeInTheDocument();

    // Resolve the register promise
    resolveRegister!();

    // Wait for the loader to disappear
    await waitFor(() => {
      expect(screen.queryByTestId("small-loader")).not.toBeInTheDocument();
    });
  });

  it("navigates to login page when login link is clicked", async () => {
    render(<RegistrationForm onRegister={mockOnRegister} />);

    const loginLink = screen.getByText(/login/i);
    await userEvent.click(loginLink);

    expect(mockNavigate).toHaveBeenCalledWith("/Login");
  });
});
