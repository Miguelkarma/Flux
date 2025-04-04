import type React from "react";
import { renderHook, act } from "@testing-library/react";
import { useFormState } from "@/hooks/tableHooks/edit-form-hook";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

// mock dependencies
jest.mock("firebase/auth");
jest.mock("firebase/firestore");
jest.mock("@/firebase/firebase", () => ({
  db: {},
}));

const mockAuth = {
  currentUser: { uid: "test-uid", email: "test@example.com" },
};

const mockEmployees = [
  {
    id: "emp1",
    firstName: "John",
    employeeId: "JD001",
    lastName: "Doe",
  },
  {
    id: "emp2",
    firstName: "Jane",
    employeeId: "JS001",
    lastName: "Smith",
  },
];

describe("useFormState", () => {
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
    (getDocs as jest.Mock).mockResolvedValue({
      docs: mockEmployees.map((emp) => ({
        id: emp.id,
        data: () => ({
          firstName: emp.firstName,
          employeeId: emp.employeeId,
          lastName: emp.lastName,
          userId: "test-uid",
        }),
      })),
    });
  });

  it("initializes with provided data", () => {
    const initialData = { name: "Test", value: 123 };
    const { result } = renderHook(() => useFormState(initialData));

    expect(result.current.formData).toEqual(initialData);
  });

  it("updates form data when initial data changes", async () => {
    const initialData = { name: "Initial" };
    const { result, rerender } = renderHook((props) => useFormState(props), {
      initialProps: initialData,
    });

    expect(result.current.formData).toEqual(initialData);

    const newData = { name: "Updated" };
    rerender(newData);

    // wait for effect to run
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(result.current.formData).toEqual(newData);
  });

  it("handles input change", () => {
    const { result } = renderHook(() => useFormState({ field: "" }));

    act(() => {
      result.current.handleInputChange({
        target: { name: "field", value: "test" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.field).toBe("test");
  });

  it("handles select change", () => {
    const { result } = renderHook(() => useFormState({ type: "" }));

    act(() => {
      result.current.handleSelectChange("type")("Laptop");
    });

    expect(result.current.formData.type).toBe("Laptop");
  });

  it("handles date change", () => {
    const { result } = renderHook(() => useFormState({ date: "" }));
    const testDate = new Date("2023-01-01");

    act(() => {
      result.current.handleDateChange("date")(testDate);
    });

    expect(result.current.formData.date).toBe(testDate.toISOString());
  });

  it("handles employee change with valid employee", () => {
    const { result } = renderHook(() =>
      useFormState({ employeeId: "", assignedEmployee: "", email: "" })
    );

    // set employees manually
    act(() => {
      result.current.setEmployees(mockEmployees);
    });

    act(() => {
      result.current.handleEmployeeChange("emp1");
    });

    expect(result.current.formData.employeeId).toBe("emp1");
    expect(result.current.formData.assignedEmployee).toBe("John");
  });

  it("handles employee change with 'none' value", () => {
    const { result } = renderHook(() =>
      useFormState({
        employeeId: "emp1",
        assignedEmployee: "John",
        email: "john@example.com",
      })
    );

    act(() => {
      result.current.handleEmployeeChange("none");
    });

    expect(result.current.formData.employeeId).toBe("");
    expect(result.current.formData.assignedEmployee).toBe("");
    expect(result.current.formData.email).toBe("");
  });

  it("handles employee change with invalid employee", () => {
    const { result } = renderHook(() =>
      useFormState({
        employeeId: "emp1",
        assignedEmployee: "John",
        email: "john@example.com",
      })
    );

    // set employees manually
    act(() => {
      result.current.setEmployees(mockEmployees);
    });

    act(() => {
      result.current.handleEmployeeChange("non-existent");
    });

    expect(result.current.formData.employeeId).toBe("");
    expect(result.current.formData.assignedEmployee).toBe("");
    expect(result.current.formData.email).toBe("");
  });
});
