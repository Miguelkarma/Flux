import { columns } from "@/components/EmployeeComponents/columns";
import { EmployeeData } from "@/components/EmployeeComponents/columns";
import { ColumnDef } from "@tanstack/react-table";
jest.mock("@/firebase/firebase", () => ({
  getFirebaseConfig: jest.fn().mockReturnValue({
    apiKey: "test-api-key",
    authDomain: "test-auth-domain",
    projectId: "test-project-id",
    storageBucket: "test-storage-bucket",
    messagingSenderId: "test-messaging-id",
    appId: "test-app-id",
    measurementId: "test-measurement-id",
  }),
  app: {},
  auth: {},
  db: {},
}));
describe("employee table columns", () => {
  const mockEmployee: EmployeeData = {
    id: "1",
    employeeId: "EMP001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    department: "IT",
    position: "Developer",
    status: "Active",
    dateAdded: "2022-01-15",
    location: "New York",
  };

  test("renders correct number of columns", () => {
    expect(columns.length).toBeGreaterThan(0);
  });

  test("select column has correct properties", () => {
    const selectColumn = columns.find(
      (col) => col.id === "select"
    ) as ColumnDef<EmployeeData>;
    expect(selectColumn).toBeDefined();
    expect(selectColumn.enableSorting).toBe(false);
    expect(selectColumn.enableHiding).toBe(false);
  });

  test("fullName column correctly combines first and last name", () => {
    const fullNameColumn = columns.find(
      (col) => "accessorKey" in col && col.accessorKey === "fullName"
    ) as ColumnDef<EmployeeData> & {
      accessorFn: (row: EmployeeData) => string;
    };

    expect(fullNameColumn).toBeDefined();
    expect(fullNameColumn.accessorFn).toBeDefined();

    const fullName = fullNameColumn.accessorFn(mockEmployee);
    expect(fullName).toBe("John Doe");
  });

  test("department column renders correctly", () => {
    const departmentColumn = columns.find(
      (col) => "accessorKey" in col && col.accessorKey === "department"
    );
    expect(departmentColumn).toBeDefined();

    if (departmentColumn?.cell) {
      if (typeof departmentColumn.cell === "function") {
        const cell = departmentColumn.cell({
          row: {
            original: mockEmployee,
            getValue: () => mockEmployee.department,
          },
        } as any);
        expect(cell).toBeDefined();
      }
    }
  });

  test("status column renders correctly", () => {
    const statusColumn = columns.find(
      (col) => "accessorKey" in col && col.accessorKey === "status"
    );
    expect(statusColumn).toBeDefined();

    if (statusColumn?.cell) {
      if (typeof statusColumn.cell === "function") {
        const cell = statusColumn.cell({
          row: { original: mockEmployee, getValue: () => mockEmployee.status },
        } as any);
        expect(cell).toBeDefined();
      }
    }
  });

  test("dateAdded column renders correctly", () => {
    const dateAddedColumn = columns.find(
      (col) => "accessorKey" in col && col.accessorKey === "dateAdded"
    );
    expect(dateAddedColumn).toBeDefined();

    if (dateAddedColumn?.cell) {
      if (typeof dateAddedColumn.cell === "function") {
        const cell = dateAddedColumn.cell({
          row: {
            original: mockEmployee,
            getValue: () => mockEmployee.dateAdded,
          },
        } as any);
        expect(cell).toBeDefined();
      }
    }
  });

  test("dateAdded column has sorting function", () => {
    const dateAddedColumn = columns.find(
      (col) => "accessorKey" in col && col.accessorKey === "dateAdded"
    );
    expect(dateAddedColumn).toBeDefined();
    expect(dateAddedColumn?.sortingFn).toBeDefined();
  });

  test("actions column exists", () => {
    const actionsColumn = columns.find((col) => col.id === "actions");
    expect(actionsColumn).toBeDefined();
    expect(actionsColumn?.enableHiding).toBe(false);
  });
});
