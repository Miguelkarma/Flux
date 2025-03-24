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

const mockAuth = {
  currentUser: { uid: "test-uid", email: "test@example.com" },
};
const mockEmployees = [
  { id: "emp1", firstName: "John", employeeId: "JD001", lastName: "Doe" },
];

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

  (onSnapshot as jest.Mock).mockImplementation((_query, onNext) => {
    onNext({
      docs: mockEmployees.map((e) => ({
        id: e.id,
        data: () => ({
          firstName: e.firstName,
          employeeId: e.employeeId,
          lastName: e.lastName,
        }),
      })),
    });
    return jest.fn();
  });
});

describe("useForm", () => {
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
});

describe("submitAddEmployeeForm", () => {
  it("validates required fields", async () => {
    (getDocs as jest.Mock).mockResolvedValue({ empty: true });

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
    await submitAddEmployeeForm({
      e: { preventDefault: jest.fn() } as any,
      formData: { firstName: "John", lastName: "Doe", email: "john@doe.com" },
      setIsSubmitting,
      onEmployeeAdded: jest.fn(),
      onClose: jest.fn(),
      resetForm: jest.fn(),
    });

    expect(setIsSubmitting).toHaveBeenCalledWith(false);
    expect(toast.success).toHaveBeenCalled();
  });
});

describe("submitAddAssetForm", () => {
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

  it("handles custom type", async () => {
    (getDocs as jest.Mock).mockResolvedValue({ empty: true });

    await submitAddAssetForm({
      e: { preventDefault: jest.fn() } as any,
      formData: { serialNo: "123", type: "Other", customType: "Custom" },
      setIsSubmitting: jest.fn(),
      onAssetAdded: jest.fn(),
      onClose: jest.fn(),
      resetForm: jest.fn(),
    });

    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ type: "Custom" })
    );
  });
});
