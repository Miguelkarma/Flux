import { renderHook, act } from "@testing-library/react";
import { useForm } from "./useForm";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, query, getDocs, where } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/firebase/firebase";

// Mock Firebase dependencies
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  getDocs: jest.fn(),
  where: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("@/firebase/firebase", () => ({
  db: {},
}));

describe("useForm Hook", () => {
  const mockUser = { uid: "test-user-id" };
  const mockUnsubscribe = jest.fn();
  const mockUserEmail = "test@example.com";
  const mockOnSuccess = jest.fn();

  const initialValues = {
    name: "",
    description: "",
    price: "",
  };

  const validationRules = {
    required: ["name", "price"],
    unique: [
      { field: "name", errorMessage: "An item with this name already exists!" },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (getAuth as jest.Mock).mockReturnValue({
      currentUser: mockUser,
    });

    // Fixed implementation with both auth and callback parameters
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return mockUnsubscribe;
    });

    (query as jest.Mock).mockReturnValue("mocked-query");
    (collection as jest.Mock).mockReturnValue("mocked-collection");
    (getDocs as jest.Mock).mockResolvedValue({
      empty: true,
      docs: [],
    });
    (addDoc as jest.Mock).mockResolvedValue({ id: "new-doc-id" });
  });

  test("initializes with correct default values", () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        collectionName: "items",
        onSuccess: mockOnSuccess,
        userEmail: mockUserEmail,
        validationRules,
      })
    );

    expect(result.current.formData).toEqual(initialValues);
    expect(result.current.isSubmitting).toBe(false);
  });

  test("updates form data when input changes", () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        collectionName: "items",
        onSuccess: mockOnSuccess,
        userEmail: mockUserEmail,
        validationRules,
      })
    );

    act(() => {
      result.current.handleInputChange({
        target: { name: "name", value: "Test Item" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.name).toBe("Test Item");
  });

  test("validates required fields on submit", async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        collectionName: "items",
        onSuccess: mockOnSuccess,
        userEmail: mockUserEmail,
        validationRules,
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });

    expect(toast.error).toHaveBeenCalled();
    expect(addDoc).not.toHaveBeenCalled();
  });

  test("validates unique fields on submit", async () => {
    // Mock query result to indicate a duplicate exists
    (getDocs as jest.Mock).mockResolvedValueOnce({
      empty: false,
      docs: [{ id: "existing-doc" }],
    });

    const { result } = renderHook(() =>
      useForm({
        initialValues: { ...initialValues, name: "Duplicate", price: "100" },
        collectionName: "items",
        onSuccess: mockOnSuccess,
        userEmail: mockUserEmail,
        validationRules,
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });

    expect(toast.error).toHaveBeenCalledWith(
      "An item with this name already exists!"
    );
    expect(addDoc).not.toHaveBeenCalled();
  });

  test("successfully submits when all validations pass", async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { ...initialValues, name: "Valid Item", price: "100" },
        collectionName: "items",
        onSuccess: mockOnSuccess,
        userEmail: mockUserEmail,
        validationRules,
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });

    expect(addDoc).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("item added successfully!");
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  test("handles special case for IT assets with Other type", async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: {
          ...initialValues,
          name: "Test Asset",
          price: "100",
          type: "Other",
          customType: "",
        },
        collectionName: "it-assets",
        onSuccess: mockOnSuccess,
        userEmail: mockUserEmail,
        validationRules,
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });

    expect(toast.error).toHaveBeenCalledWith(
      "custom type is required when 'other' is selected!"
    );
  });
});
