import { renderHook, act } from "@testing-library/react";
import { useForm } from "@/hooks/assetHook/add-form-hook";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

import { toast } from "sonner";

// Mock dependencies
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
}));

jest.mock("@/firebase/firebase", () => ({
  db: {},
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("useForm hook", () => {
  // Common test variables
  const mockUser = { uid: "test-user-id" };
  const mockInitialValues = { name: "", age: "", email: "" };
  const mockOnSuccess = jest.fn();
  const mockEvent = { preventDefault: jest.fn() } as unknown as React.FormEvent;

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    (getAuth as jest.Mock).mockReturnValue({
      currentUser: mockUser,
    });

    (collection as jest.Mock).mockReturnValue("mockCollectionRef");
    (query as jest.Mock).mockReturnValue("mockQuery");
    (where as jest.Mock).mockImplementation((field, op, value) => ({
      field,
      op,
      value,
    }));
    (getDocs as jest.Mock).mockResolvedValue({ empty: true });
    (addDoc as jest.Mock).mockResolvedValue({});
  });

  test("should initialize with initial values", () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: mockInitialValues,
        collectionName: "testCollection",
        onSuccess: mockOnSuccess,
        userEmail: "test@example.com",
      })
    );

    expect(result.current.formData).toEqual(mockInitialValues);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.open).toBe(false);
  });

  test("should update form data when handleInputChange is called", () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: mockInitialValues,
        collectionName: "testCollection",
        onSuccess: mockOnSuccess,
        userEmail: "test@example.com",
      })
    );

    act(() => {
      result.current.handleInputChange({
        target: { name: "name", value: "Test Name" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.name).toBe("Test Name");
  });

  test("should update form data when handleSelectChange is called", () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: mockInitialValues,
        collectionName: "testCollection",
        onSuccess: mockOnSuccess,
        userEmail: "test@example.com",
      })
    );

    act(() => {
      result.current.handleSelectChange("age")("30");
    });

    expect(result.current.formData.age).toBe("30");
  });

  test("should update form data when handleDateChange is called", () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { ...mockInitialValues, birthdate: "" },
        collectionName: "testCollection",
        onSuccess: mockOnSuccess,
        userEmail: "test@example.com",
      })
    );

    const testDate = new Date("2023-01-01");

    act(() => {
      result.current.handleDateChange("birthdate")(testDate);
    });

    expect(result.current.formData.birthdate).toBe(testDate.toISOString());
  });

  test("should reset form to initial values", () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: mockInitialValues,
        collectionName: "testCollection",
        onSuccess: mockOnSuccess,
        userEmail: "test@example.com",
      })
    );

    act(() => {
      result.current.handleInputChange({
        target: { name: "name", value: "Test Name" },
      } as React.ChangeEvent<HTMLInputElement>);

      result.current.resetForm();
    });

    expect(result.current.formData).toEqual(mockInitialValues);
  });

  test("should show error when user is not logged in", async () => {
    (getAuth as jest.Mock).mockReturnValue({
      currentUser: null,
    });

    const { result } = renderHook(() =>
      useForm({
        initialValues: mockInitialValues,
        collectionName: "testCollection",
        onSuccess: mockOnSuccess,
        userEmail: "test@example.com",
      })
    );

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(toast.error).toHaveBeenCalledWith(
      "You must be logged in to add this item!"
    );
    expect(result.current.isSubmitting).toBe(false);
  });

  test("should show error when userEmail is null", async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: mockInitialValues,
        collectionName: "testCollection",
        onSuccess: mockOnSuccess,
        userEmail: null,
      })
    );

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(toast.error).toHaveBeenCalledWith(
      "You must be logged in to add this item!"
    );
    expect(result.current.isSubmitting).toBe(false);
  });

  test("should validate required fields", async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: mockInitialValues,
        collectionName: "testCollection",
        onSuccess: mockOnSuccess,
        userEmail: "test@example.com",
        validationRules: {
          required: ["name"],
        },
      })
    );

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(toast.error).toHaveBeenCalledWith("name is required!");
    expect(result.current.isSubmitting).toBe(false);
  });

  test("should apply custom validation", async () => {
    const customValidation = jest.fn().mockReturnValue({
      isValid: false,
      errorMessage: "Custom validation failed",
    });

    const { result } = renderHook(() =>
      useForm({
        initialValues: { ...mockInitialValues, name: "Test" },
        collectionName: "testCollection",
        onSuccess: mockOnSuccess,
        userEmail: "test@example.com",
        customValidation,
      })
    );

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(customValidation).toHaveBeenCalledWith({
      ...mockInitialValues,
      name: "Test",
    });
    expect(toast.error).toHaveBeenCalledWith("Custom validation failed");
    expect(result.current.isSubmitting).toBe(false);
  });

  test("should check for unique fields", async () => {
    (getDocs as jest.Mock).mockResolvedValue({ empty: false });

    const { result } = renderHook(() =>
      useForm({
        initialValues: { ...mockInitialValues, email: "test@example.com" },
        collectionName: "testCollection",
        onSuccess: mockOnSuccess,
        userEmail: "test@example.com",
        validationRules: {
          unique: [{ field: "email", errorMessage: "Email already exists" }],
        },
      })
    );

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(query).toHaveBeenCalled();
    expect(getDocs).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Email already exists");
    expect(result.current.isSubmitting).toBe(false);
  });

  test("should apply transformBeforeSave function when provided", async () => {
    const transformBeforeSave = jest.fn().mockReturnValue({
      transformedData: true,
      userId: mockUser.uid,
    });

    const { result } = renderHook(() =>
      useForm({
        initialValues: { ...mockInitialValues, name: "Test" },
        collectionName: "testCollection",
        onSuccess: mockOnSuccess,
        userEmail: "test@example.com",
        transformBeforeSave,
      })
    );

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(transformBeforeSave).toHaveBeenCalledWith(
      { ...mockInitialValues, name: "Test" },
      mockUser.uid
    );

    expect(addDoc).toHaveBeenCalledWith("mockCollectionRef", {
      transformedData: true,
      userId: mockUser.uid,
    });
  });

  test("should save data with default transformation when transformBeforeSave is not provided", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2023-01-01"));

    const { result } = renderHook(() =>
      useForm({
        initialValues: { ...mockInitialValues, name: "Test" },
        collectionName: "testCollection",
        onSuccess: mockOnSuccess,
        userEmail: "test@example.com",
      })
    );

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(addDoc).toHaveBeenCalledWith("mockCollectionRef", {
      ...mockInitialValues,
      name: "Test",
      userId: mockUser.uid,
      createdAt: new Date().toISOString(),
    });

    jest.useRealTimers();
  });

  test("should call onSuccess and reset form after successful submission", async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { ...mockInitialValues, name: "Test" },
        collectionName: "testCollection",
        onSuccess: mockOnSuccess,
        userEmail: "test@example.com",
      })
    );

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(toast.success).toHaveBeenCalledWith("Added successfully!");
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(result.current.open).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
  });

  test("should handle errors during submission", async () => {
    const error = new Error("Submission failed");
    (addDoc as jest.Mock).mockRejectedValue(error);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const { result } = renderHook(() =>
      useForm({
        initialValues: { ...mockInitialValues, name: "Test" },
        collectionName: "testCollection",
        onSuccess: mockOnSuccess,
        userEmail: "test@example.com",
      })
    );

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(consoleSpy).toHaveBeenCalledWith("Error adding item:", error);
    expect(toast.error).toHaveBeenCalledWith("Failed to add item");
    expect(result.current.isSubmitting).toBe(false);

    consoleSpy.mockRestore();
  });
});
