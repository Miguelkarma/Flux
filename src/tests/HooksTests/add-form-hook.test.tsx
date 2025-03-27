import type React from "react";
import { renderHook, act } from "@testing-library/react";
import {
  useForm,
  submitAddEmployeeForm,
  submitAddAssetForm,
} from "@/hooks/tableHooks/add-form-hook";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { toast } from "sonner";

// Mock dependencies
jest.mock("firebase/auth");
jest.mock("firebase/firestore");
jest.mock("sonner");
jest.mock("@/firebase/firebase", () => ({
  db: {},
}));

const mockAuth = {
  currentUser: { uid: "test-uid", email: "test@example.com" },
};

describe("useForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAuth as jest.Mock).mockReturnValue(mockAuth);
    (collection as jest.Mock).mockReturnValue("mock-collection");
    (query as jest.Mock).mockReturnValue("mock-query");
    (where as jest.Mock).mockReturnValue("mock-where");
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback) => {
      callback(mockAuth.currentUser);
      return jest.fn();
    });
  });

  it("manages form state correctly", () => {
    const { result } = renderHook(() => useForm({ field: "" }));

    // Test input change
    act(() => {
      result.current.handleInputChange({
        target: { name: "field", value: "test" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.formData.field).toBe("test");

    // Test reset
    act(() => result.current.resetForm());
    expect(result.current.formData.field).toBe("");
  });

  it("fetches employees on mount", () => {
    renderHook(() => useForm({}));
    expect(onAuthStateChanged).toHaveBeenCalled();
    expect(onSnapshot).toHaveBeenCalled();

    const { result } = renderHook(() => useForm({}));
    expect(result.current.employees).toHaveLength(1);
    expect(result.current.employees[0].firstName).toBe("John");
  });

  it("handles select change", () => {
    const { result } = renderHook(() => useForm({ type: "" }));

    act(() => {
      result.current.handleSelectChange("type")("Laptop");
    });

    expect(result.current.formData.type).toBe("Laptop");
  });

  it("handles date change", () => {
    const { result } = renderHook(() => useForm({ date: "" }));
    const testDate = new Date("2023-01-01");

    act(() => {
      result.current.handleDateChange("date")(testDate);
    });

    expect(result.current.formData.date).toBe(testDate.toISOString());
  });

  it("handles employee change", () => {
    const { result } = renderHook(() =>
      useForm({ employeeId: "", assignedEmployee: "", email: "" })
    );

    // Mock employees data is set in the onSnapshot mock

    act(() => {
      result.current.handleEmployeeChange("emp1");
    });

    expect(result.current.formData.employeeId).toBe("emp1");
    expect(result.current.formData.assignedEmployee).toBe("John");
  });

  it("handles type change for assets", () => {
    const { result } = renderHook(() =>
      useForm({ type: "", customType: "Old Custom" })
    );

    act(() => {
      result.current.handleTypeChange("Laptop");
    });

    expect(result.current.formData.type).toBe("Laptop");
    expect(result.current.formData.customType).toBe("Old Custom");

    act(() => {
      result.current.handleTypeChange("Other");
    });

    expect(result.current.formData.type).toBe("Other");
    expect(result.current.formData.customType).toBe("");
  });
});

describe("submitAddEmployeeForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAuth as jest.Mock).mockReturnValue(mockAuth);
    (collection as jest.Mock).mockReturnValue("mock-collection");
    (query as jest.Mock).mockReturnValue("mock-query");
    (where as jest.Mock).mockReturnValue("mock-where");
  });

  it("validates required fields", async () => {
    await submitAddEmployeeForm({
      e: { preventDefault: jest.fn() } as any,
      formData: { firstName: "", lastName: "", email: "" },
      setIsSubmitting: jest.fn(),
      onEmployeeAdded: jest.fn(),
      onClose: jest.fn(),
      resetForm: jest.fn(),
    });

    expect(toast.error).toHaveBeenCalledWith(
      "first name, last name, and email are required!"
    );
  });

  it("prevents duplicate employee IDs", async () => {
    (getDocs as jest.Mock).mockResolvedValue({ empty: false });

    const setIsSubmitting = jest.fn();
    await submitAddEmployeeForm({
      e: { preventDefault: jest.fn() } as any,
      formData: {
        firstName: "John",
        lastName: "Doe",
        email: "john@doe.com",
        employeeId: "JD001",
      },
      setIsSubmitting,
      onEmployeeAdded: jest.fn(),
      onClose: jest.fn(),
      resetForm: jest.fn(),
    });

    expect(toast.error).toHaveBeenCalledWith(
      "employee with this ID already exists!"
    );
    expect(setIsSubmitting).toHaveBeenCalledWith(false);
  });

  it("submits valid form", async () => {
    (getDocs as jest.Mock).mockResolvedValue({ empty: true });
    (addDoc as jest.Mock).mockResolvedValue({});

    const setIsSubmitting = jest.fn();
    const onEmployeeAdded = jest.fn();
    const onClose = jest.fn();
    const resetForm = jest.fn();

    await submitAddEmployeeForm({
      e: { preventDefault: jest.fn() } as any,
      formData: { firstName: "John", lastName: "Doe", email: "john@doe.com" },
      setIsSubmitting,
      onEmployeeAdded,
      onClose,
      resetForm,
    });

    expect(setIsSubmitting).toHaveBeenCalledWith(false);
    expect(toast.success).toHaveBeenCalled();
    expect(onEmployeeAdded).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
    expect(resetForm).toHaveBeenCalled();
  });
});

describe("submitAddAssetForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAuth as jest.Mock).mockReturnValue(mockAuth);
    (collection as jest.Mock).mockReturnValue("mock-collection");
    (query as jest.Mock).mockReturnValue("mock-query");
    (where as jest.Mock).mockReturnValue("mock-where");
  });

  it("validates required fields", async () => {
    await submitAddAssetForm({
      e: { preventDefault: jest.fn() } as any,
      formData: { serialNo: "", type: "" },
      setIsSubmitting: jest.fn(),
      onAssetAdded: jest.fn(),
      onClose: jest.fn(),
      resetForm: jest.fn(),
    });

    expect(toast.error).toHaveBeenCalledWith(
      "serial number and asset type are required!"
    );
  });

  it("validates custom type when 'Other' is selected", async () => {
    await submitAddAssetForm({
      e: { preventDefault: jest.fn() } as any,
      formData: { serialNo: "SN123", type: "Other", customType: "" },
      setIsSubmitting: jest.fn(),
      onAssetAdded: jest.fn(),
      onClose: jest.fn(),
      resetForm: jest.fn(),
    });

    expect(toast.error).toHaveBeenCalledWith(
      "custom type is required when 'Other' is selected!"
    );
  });

  it("prevents duplicate serial numbers", async () => {
    (getDocs as jest.Mock).mockResolvedValue({ empty: false });

    await submitAddAssetForm({
      e: { preventDefault: jest.fn() } as any,
      formData: { serialNo: "SN123", type: "Laptop" },
      setIsSubmitting: jest.fn(),
      onAssetAdded: jest.fn(),
      onClose: jest.fn(),
      resetForm: jest.fn(),
    });

    expect(toast.error).toHaveBeenCalledWith(
      "asset with this serial number already exists!"
    );
  });

  it("prevents duplicate asset tags", async () => {
    (getDocs as jest.Mock)
      .mockResolvedValueOnce({ empty: true })
      .mockResolvedValueOnce({ empty: false });

    await submitAddAssetForm({
      e: { preventDefault: jest.fn() } as any,
      formData: { serialNo: "SN123", type: "Laptop", assetTag: "TAG001" },
      setIsSubmitting: jest.fn(),
      onAssetAdded: jest.fn(),
      onClose: jest.fn(),
      resetForm: jest.fn(),
    });

    expect(toast.error).toHaveBeenCalledWith(
      "asset with this asset tag already exists!"
    );
  });

  it("submits valid form with standard type", async () => {
    (getDocs as jest.Mock).mockResolvedValue({ empty: true });
    (addDoc as jest.Mock).mockResolvedValue({});

    const setIsSubmitting = jest.fn();
    const onAssetAdded = jest.fn();
    const onClose = jest.fn();
    const resetForm = jest.fn();

    await submitAddAssetForm({
      e: { preventDefault: jest.fn() } as any,
      formData: { serialNo: "SN123", type: "Laptop" },
      setIsSubmitting,
      onAssetAdded,
      onClose,
      resetForm,
    });

    expect(addDoc).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
    expect(onAssetAdded).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
    expect(resetForm).toHaveBeenCalled();
  });

  it("handles custom type", async () => {
    (getDocs as jest.Mock).mockResolvedValue({ empty: true });
    (addDoc as jest.Mock).mockResolvedValue({});

    await submitAddAssetForm({
      e: { preventDefault: jest.fn() } as any,
      formData: {
        serialNo: "SN123",
        type: "Other",
        customType: "Custom Device",
      },
      setIsSubmitting: jest.fn(),
      onAssetAdded: jest.fn(),
      onClose: jest.fn(),
      resetForm: jest.fn(),
    });

    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ type: "Custom Device" })
    );
  });
});
