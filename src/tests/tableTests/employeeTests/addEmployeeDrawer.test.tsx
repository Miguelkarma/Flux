import { renderHook, act } from "@testing-library/react";
import { useForm } from "@/hooks/tableHooks/add-form-hook";

jest.mock("firebase/auth");
jest.mock("firebase/firestore");

describe("useForm hook", () => {
  const initialEmployee = {
    employeeId: "",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    department: "",
    position: "",
    status: "Active",
    phoneNumber: "",
    hireDate: new Date().toISOString(),
    manager: "",
    location: "",
  };

  it("initializes form data correctly", () => {
    const { result } = renderHook(() => useForm(initialEmployee));

    expect(result.current.formData).toEqual(initialEmployee);
    expect(result.current.open).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
  });

  it("handles input changes correctly", () => {
    const { result } = renderHook(() => useForm(initialEmployee));

    act(() => {
      result.current.handleInputChange({
        target: {
          name: "department",
          value: "IT",
        },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.department).toBe("IT");
  });

  it("handles select changes correctly", () => {
    const { result } = renderHook(() => useForm(initialEmployee));

    act(() => {
      result.current.handleSelectChange("status")("Remote");
    });

    expect(result.current.formData.status).toBe("Remote");
  });

  it("handles date changes correctly", () => {
    const { result } = renderHook(() => useForm(initialEmployee));
    const testDate = new Date("2023-01-01");

    act(() => {
      result.current.handleDateChange("hireDate")(testDate);
    });

    expect(new Date(result.current.formData.hireDate)).toEqual(testDate);
  });

  it("opens and closes the form", () => {
    const { result } = renderHook(() => useForm(initialEmployee));

    act(() => {
      result.current.setOpen(true);
    });

    expect(result.current.open).toBe(true);

    act(() => {
      result.current.setOpen(false);
    });

    expect(result.current.open).toBe(false);
  });

  it("resets form to initial values", () => {
    const { result } = renderHook(() => useForm(initialEmployee));

    act(() => {
      result.current.handleInputChange({
        target: {
          name: "department",
          value: "IT",
        },
      } as React.ChangeEvent<HTMLInputElement>);

      result.current.resetForm();
    });

    expect(result.current.formData).toEqual(initialEmployee);
  });
});
