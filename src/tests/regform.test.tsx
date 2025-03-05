import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegistrationForm from "@/components/registration-form";
import { auth } from "@/firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Mock Firebase and React Router
jest.mock("@/firebase/firebase", () => ({
  auth: {
    currentUser: { uid: "123" },
  },
}));

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));


jest.mock("sonner", () => ({
  Toaster: () => <div>Toaster Mock</div>,
  toast: {
    error: jest.fn(),
    success: jest.fn(),

  },
}));

describe("RegistrationForm", () => {
  const mockNavigate = jest.fn();
  const mockCreateUserWithEmailAndPassword =
    createUserWithEmailAndPassword as jest.Mock;
  const mockUpdateProfile = updateProfile as jest.Mock;
  const mockToastError = toast.error as jest.Mock;

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    mockCreateUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: "123" },
    });
    mockUpdateProfile.mockResolvedValue({});
    mockToastError.mockImplementation(() => {}); 
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the registration form", () => {
    render(<RegistrationForm />);
    expect(screen.getByText("Create an Account")).toBeInTheDocument();
    expect(screen.getByTestId("username-input")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  test("validates form inputs", async () => {
    render(<RegistrationForm />);

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Username is required.");
      expect(mockToastError).toHaveBeenCalledWith("Email is required.");
      expect(mockToastError).toHaveBeenCalledWith("Password is required.");
    });
  });

  test("submits the form with valid inputs", async () => {
    render(<RegistrationForm />);

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        "test@example.com",
        "password123"
      );
      expect(mockUpdateProfile).toHaveBeenCalledWith(
        { uid: "123" },
        { displayName: "testuser" }
      );
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  test("handles registration error", async () => {
    mockCreateUserWithEmailAndPassword.mockRejectedValueOnce(
      new Error("Registration failed")
    );

    render(<RegistrationForm />);

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByText("Registration failed")).toBeInTheDocument();
    });
  });
});
