import {
  submitEmployeeForm,
  submitAssetForm,
} from "@/hooks/tableHooks/edit-form-hook";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  doc,
  where,
} from "firebase/firestore";

import { toast } from "sonner";
import React from "react";

// Comprehensive Mock Setup
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  updateDoc: jest.fn(),
  where: jest.fn(),
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

describe("submitEmployeeForm", () => {
  const mockEvent = {
    preventDefault: jest.fn(),
  } as unknown as React.FormEvent;

  const mockEmployee = {
    id: "emp-1",
    employeeId: "E001",
    email: "john@example.com",
  };

  const mockFormData = {
    id: "emp-1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    employeeId: "E001",
  };

  const mockSetIsSubmitting = jest.fn();
  const mockOnEmployeeUpdated = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // More robust mock for auth
    (getAuth as jest.Mock).mockReturnValue({
      currentUser: {
        email: "user@example.com",
        uid: "user-123",
      },
    });

    // Reset mock implementations
    (collection as jest.Mock).mockReturnValue({});
    (doc as jest.Mock).mockReturnValue({});
    (query as jest.Mock).mockReturnValue({});
    (where as jest.Mock).mockReturnValue({});
  });

  test("should update employee when form is valid and no duplicates", async () => {
    // Simulate no duplicates found
    (getDocs as jest.Mock).mockResolvedValue({
      empty: true,
      docs: [],
    });
    (updateDoc as jest.Mock).mockResolvedValue({});

    await submitEmployeeForm({
      e: mockEvent,
      formData: mockFormData,
      employee: mockEmployee,
      setIsSubmitting: mockSetIsSubmitting,
      onEmployeeUpdated: mockOnEmployeeUpdated,
      onClose: mockOnClose,
    });

    // Verify core interactions
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockSetIsSubmitting).toHaveBeenCalledTimes(2);
    expect(updateDoc).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(
      "employee updated successfully!"
    );
    expect(mockOnEmployeeUpdated).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("should handle duplicate employee ID", async () => {
    const newFormData = {
      ...mockFormData,
      employeeId: "NEW-ID",
    };

    // Simulate duplicate found
    (getDocs as jest.Mock).mockResolvedValue({
      empty: false,
      docs: [{}],
    });

    await submitEmployeeForm({
      e: mockEvent,
      formData: newFormData,
      employee: mockEmployee,
      setIsSubmitting: mockSetIsSubmitting,
      onEmployeeUpdated: mockOnEmployeeUpdated,
      onClose: mockOnClose,
    });

    // Verify error handling
    expect(toast.error).toHaveBeenCalledWith(
      "employee with this ID already exists!"
    );
    expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    expect(updateDoc).not.toHaveBeenCalled();
  });

  test("should validate required fields", async () => {
    const invalidFormData = {
      firstName: "", // Missing required field
      lastName: "Doe",
      email: "john@example.com",
    };

    await submitEmployeeForm({
      e: mockEvent,
      formData: invalidFormData,
      employee: mockEmployee,
      setIsSubmitting: mockSetIsSubmitting,
      onEmployeeUpdated: mockOnEmployeeUpdated,
      onClose: mockOnClose,
    });

    expect(toast.error).toHaveBeenCalledWith(
      "first name, last name, and email are required!"
    );
    expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    expect(updateDoc).not.toHaveBeenCalled();
  });
});

describe("submitAssetForm", () => {
  const mockEvent = {
    preventDefault: jest.fn(),
  } as unknown as React.FormEvent;

  const mockAsset = {
    id: "asset-1",
    serialNo: "SN12345",
    assetTag: "AT001",
  };

  const mockFormData = {
    serialNo: "SN12345",
    type: "Laptop",
    assetTag: "AT001",
  };

  const mockSetIsSubmitting = jest.fn();
  const mockOnAssetUpdated = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // More robust mock for auth
    (getAuth as jest.Mock).mockReturnValue({
      currentUser: {
        email: "user@example.com",
        uid: "user-123",
      },
    });

    // Reset mock implementations
    (collection as jest.Mock).mockReturnValue({});
    (doc as jest.Mock).mockReturnValue({});
    (query as jest.Mock).mockReturnValue({});
    (where as jest.Mock).mockReturnValue({});
  });

  test("should update asset when form is valid and no duplicates", async () => {
    // Simulate no duplicates found
    (getDocs as jest.Mock).mockResolvedValue({
      empty: true,
      docs: [],
    });
    (updateDoc as jest.Mock).mockResolvedValue({});

    await submitAssetForm({
      e: mockEvent,
      formData: mockFormData,
      asset: mockAsset,
      setIsSubmitting: mockSetIsSubmitting,
      onAssetUpdated: mockOnAssetUpdated,
      onClose: mockOnClose,
    });

    // Verify core interactions
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockSetIsSubmitting).toHaveBeenCalledTimes(2);
    expect(updateDoc).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("asset updated successfully!");
    expect(mockOnAssetUpdated).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('should validate required fields for asset type "Other"', async () => {
    const otherTypeFormData = {
      serialNo: "SN12345",
      type: "Other",
      customType: "", // Missing required field when type is Other
      assetTag: "AT001",
    };

    await submitAssetForm({
      e: mockEvent,
      formData: otherTypeFormData,
      asset: mockAsset,
      setIsSubmitting: mockSetIsSubmitting,
      onAssetUpdated: mockOnAssetUpdated,
      onClose: mockOnClose,
    });

    expect(toast.error).toHaveBeenCalledWith(
      "custom type is required when 'Other' is selected!"
    );
    expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    expect(updateDoc).not.toHaveBeenCalled();
  });

  test("should show error when duplicate serial number is found", async () => {
    const newFormData = {
      ...mockFormData,
      serialNo: "NEW-SN", // Different serial to trigger duplicate check
    };

    // Simulate duplicate found
    (getDocs as jest.Mock).mockResolvedValue({
      empty: false,
      docs: [{}],
    });

    await submitAssetForm({
      e: mockEvent,
      formData: newFormData,
      asset: mockAsset,
      setIsSubmitting: mockSetIsSubmitting,
      onAssetUpdated: mockOnAssetUpdated,
      onClose: mockOnClose,
    });

    // Verify error handling
    expect(toast.error).toHaveBeenCalledWith(
      "asset with this serial number already exists!"
    );
    expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    expect(updateDoc).not.toHaveBeenCalled();
  });
});
