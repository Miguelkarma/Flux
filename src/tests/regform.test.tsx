import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RegistrationForm } from "@/components/registration-form";
import { MemoryRouter } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

// Mock Firebase functions for testing
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({ currentUser: null })),
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
}));

const mockNavigate = jest.fn(); // Mock navigation function

// Mock useNavigate to return the mocked function
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("RegistrationForm", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  // Test successful registration
  test("handles successful registration", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: "1234" },
    });

    render(
      <MemoryRouter>
        <RegistrationForm />
      </MemoryRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "TestUser" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Check if functions were called and navigation occurred
    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(updateProfile).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  // Test registration failure
  test("displays error message on registration failure", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
      new Error("Registration failed")
    );

    render(
      <MemoryRouter>
        <RegistrationForm />
      </MemoryRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "TestUser" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    });
  });

  // Test missing username error
  test("displays an error when username is missing", async () => {
    render(
      <MemoryRouter>
        <RegistrationForm />
      </MemoryRouter>
    );

    // Simulate user input for email and password only
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Check for missing username error message
    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    });
  });
});
