import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegistrationForm } from "@/components/registration-form";
import { useNavigate } from "react-router-dom";

// mock react-router-dom useNavigate
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

// mock ui components
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

// mock lucide-react icons
jest.mock("lucide-react", () => ({
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  EyeOff: () => <div data-testid="eye-off-icon">EyeOff</div>,
  KeyRound: () => <div data-testid="key-icon">KeyRound</div>,
  Mail: () => <div data-testid="mail-icon">Mail</div>,
  User: () => <div data-testid="user-icon">User</div>,
}));

// mock smallloader component
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

  it("renders form correctly", () => {
    render(<RegistrationForm onRegister={mockOnRegister} />);

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

  it("updates fields on user input", async () => {
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

  it("calls onRegister on form submit", async () => {
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

  it("shows loader during submission", async () => {
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

    expect(screen.getByTestId("small-loader")).toBeInTheDocument();

    resolveRegister!();

    await waitFor(() => {
      expect(screen.queryByTestId("small-loader")).not.toBeInTheDocument();
    });
  });

  it("navigates to login page on login link click", async () => {
    render(<RegistrationForm onRegister={mockOnRegister} />);

    const loginLink = screen.getByText(/login/i);
    await userEvent.click(loginLink);

    expect(mockNavigate).toHaveBeenCalledWith("/Login");
  });
});
