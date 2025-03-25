// edit-form-hook.test.tsx
import { renderHook, act } from "@testing-library/react";
import { useFormState } from "@/hooks/tableHooks/edit-form-hook";

// mock the employee data
const mockEmployee = {
  id: "1",
  employeeId: "EMP001",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  department: "IT",
  position: "Developer",
  status: "Active",
  hireDate: "2023-01-01",
  location: "New York",
};

describe("useFormState", () => {
  it("initializes with provided employee data", () => {
    const { result } = renderHook(() => useFormState(mockEmployee));

    expect(result.current.formData).toEqual({
      ...mockEmployee,
      hireDate: mockEmployee.hireDate,
    });
  });

  it("handles input changes", () => {
    const { result } = renderHook(() => useFormState(mockEmployee));

    act(() => {
      result.current.handleInputChange({
        target: { name: "firstName", value: "Jane" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.firstName).toBe("Jane");
  });

  it("handles select changes", () => {
    const { result } = renderHook(() => useFormState(mockEmployee));

    act(() => {
      result.current.handleSelectChange("department")("Marketing");
    });

    expect(result.current.formData.department).toBe("Marketing");
  });

  it("handles date changes", () => {
    const { result } = renderHook(() => useFormState(mockEmployee));
    const newDate = new Date("2023-02-01");

    act(() => {
      result.current.handleDateChange("hireDate")(newDate);
    });

    expect(result.current.formData.hireDate).toBe(newDate.toISOString());
  });

  it("updates form data when setFormData is called", () => {
    const { result } = renderHook(() => useFormState(mockEmployee));
    const newData = { ...mockEmployee, firstName: "Alice" };

    act(() => {
      result.current.setFormData(newData);
    });

    expect(result.current.formData.firstName).toBe("Alice");
  });

  it("updates isSubmitting state", () => {
    const { result } = renderHook(() => useFormState(mockEmployee));

    act(() => {
      result.current.setIsSubmitting(true);
    });

    expect(result.current.isSubmitting).toBe(true);
  });
});
