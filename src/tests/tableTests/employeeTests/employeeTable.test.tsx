/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { EmployeeTable } from "@/components/EmployeeComponents/table";
import * as firebaseAuth from "firebase/auth";
import * as firebaseFirestore from "firebase/firestore";

// Type declarations to help with mocks
type MockFn = jest.Mock<any, any>;
type FirebaseUser = { uid: string; email: string | null };

// Define interfaces for employee data
interface EmployeeData {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  status: string;
  hireDate: string;
  location: string;
  userId: string;
}

// Mock external dependencies
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn<
    ReturnType<typeof firebaseFirestore.collection>,
    Parameters<typeof firebaseFirestore.collection>
  >(),
  onSnapshot: jest.fn<
    ReturnType<typeof firebaseFirestore.onSnapshot>,
    Parameters<typeof firebaseFirestore.onSnapshot>
  >(),
  query: jest.fn<
    ReturnType<typeof firebaseFirestore.query>,
    Parameters<typeof firebaseFirestore.query>
  >(),
  where: jest.fn<
    ReturnType<typeof firebaseFirestore.where>,
    Parameters<typeof firebaseFirestore.where>
  >(),
  orderBy: jest.fn<
    ReturnType<typeof firebaseFirestore.orderBy>,
    Parameters<typeof firebaseFirestore.orderBy>
  >(),
}));

jest.mock("@/firebase/firebase", () => ({ db: {} }));

// Mock lucide-react components
jest.mock("lucide-react", () => ({
  ChevronDown: () => <div data-testid="chevron-down">▼</div>,
}));

// Mock UI components
jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

jest.mock("@/components/ui/table", () => ({
  Table: ({ children }: { children: React.ReactNode }) => (
    <table>{children}</table>
  ),
  TableBody: ({ children }: { children: React.ReactNode }) => (
    <tbody>{children}</tbody>
  ),
  TableCell: ({
    children,
    colSpan,
  }: {
    children: React.ReactNode;
    colSpan?: number;
  }) => <td colSpan={colSpan}>{children}</td>,
  TableHead: ({ children }: { children: React.ReactNode }) => (
    <th>{children}</th>
  ),
  TableHeader: ({ children }: { children: React.ReactNode }) => (
    <thead>{children}</thead>
  ),
  TableRow: ({ children }: { children: React.ReactNode }) => (
    <tr>{children}</tr>
  ),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuCheckboxItem: ({
    children,
    checked,
    onCheckedChange,
  }: {
    children: React.ReactNode;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }) => (
    <div onClick={() => onCheckedChange && onCheckedChange(!checked)}>
      {children}
    </div>
  ),
}));

jest.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ScrollBar: () => <div />,
}));

// Mock custom components
jest.mock("@/components/EmployeeComponents/AddEmployeeDrawer", () => ({
  AddEmployeeDrawer: ({
    onEmployeeAdded,
    userEmail,
  }: {
    onEmployeeAdded?: () => void;
    userEmail?: string;
  }) => (
    <button onClick={onEmployeeAdded} data-testid="add-employee-drawer">
      Add Employee ({userEmail})
    </button>
  ),
}));

jest.mock("@/components/sharedComponent/BulkDeleteDialog", () => ({
  BulkDeleteTrigger: ({
    selectedCount,
    onClick,
  }: {
    selectedCount: number;
    onClick: () => void;
  }) => (
    <button onClick={onClick} data-testid="bulk-delete-trigger">
      Delete ({selectedCount})
    </button>
  ),
  BulkDeleteDialog: () => <div data-testid="bulk-delete-dialog" />,
}));

jest.mock("@/components/sharedComponent/UploadFile", () => ({
  UploadFile: () => <button data-testid="upload-file">Import</button>,
}));

jest.mock("@/Animation/TableLoader", () => ({
  __esModule: true,
  default: () => <div data-testid="table-loader">Loading...</div>,
}));

// Sample data for tests
const mockSampleData: EmployeeData[] = [
  {
    id: "1",
    employeeId: "EMP001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    department: "IT",
    position: "Developer",
    status: "Active",
    hireDate: "2023-01-15",
    location: "Remote",
    userId: "user123",
  },
  {
    id: "2",
    employeeId: "EMP002",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    department: "HR",
    position: "Manager",
    status: "Active",
    hireDate: "2023-02-20",
    location: "Office",
    userId: "user123",
  },
];

// Mock columns with proper types
type ColumnDef = {
  id?: string;
  accessorKey?: string;
  header: string | (() => React.ReactNode);
  cell?: any;
};

jest.mock("@/components/EmployeeComponents/columns", () => {
  const columns: ColumnDef[] = [
    {
      id: "select",
      header: () => <input type="checkbox" data-testid="select-all" />,
      cell: ({ row }: { row: { id: string } }) => (
        <input type="checkbox" data-testid={`select-row-${row.id}`} />
      ),
    },
    { accessorKey: "employeeId", header: "Employee ID" },
    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "department", header: "Department" },
    { accessorKey: "status", header: "Status" },
  ];

  return { columns };
});

jest.mock("@tanstack/react-table", () => {
  type HeaderGroup = {
    id: string;
    headers: {
      id: string;
      isPlaceholder: boolean;
      column: { columnDef: { header: string | (() => React.ReactNode) } };
      getContext: () => any;
    }[];
  };

  type Row = {
    id: string;
    getVisibleCells: () => {
      id: string;
      column: { columnDef: { cell: any } };
      getContext: () => any;
    }[];
  };

  type Column = {
    id: string;
    getCanHide: () => boolean;
    getIsVisible: () => boolean;
    toggleVisibility: (state?: boolean) => void;
    getFilterValue: () => string;
    setFilterValue: (value: string) => void;
  };

  type Table = {
    getHeaderGroups: () => HeaderGroup[];
    getRowModel: () => { rows: Row[] };
    getAllColumns: () => Column[];
    getColumn: (id: string) => Column;
    getPageCount: () => number;
    getCanPreviousPage: () => boolean;
    getCanNextPage: () => boolean;
    getFilteredSelectedRowModel: () => { rows: Row[] };
  };

  const mockTable: Table = {
    getHeaderGroups: () => [
      {
        id: "headerGroup1",
        headers: [
          {
            id: "select",
            isPlaceholder: false,
            column: { columnDef: { header: () => <div>Select</div> } },
            getContext: () => ({}),
          },
          {
            id: "employeeId",
            isPlaceholder: false,
            column: { columnDef: { header: "Employee ID" } },
            getContext: () => ({}),
          },
          {
            id: "firstName",
            isPlaceholder: false,
            column: { columnDef: { header: "First Name" } },
            getContext: () => ({}),
          },
        ],
      },
    ],
    getRowModel: () => ({
      rows: mockSampleData.map((item, index) => ({
        id: index.toString(),
        getVisibleCells: () => [
          {
            id: `${index}-select`,
            column: { columnDef: { cell: () => <div>☐</div> } },
            getContext: () => ({ row: { id: index.toString() } }),
          },
          {
            id: `${index}-employeeId`,
            column: { columnDef: { cell: item.employeeId } },
            getContext: () => ({}),
          },
          {
            id: `${index}-firstName`,
            column: { columnDef: { cell: item.firstName } },
            getContext: () => ({}),
          },
        ],
      })),
    }),
    getAllColumns: () => [
      {
        id: "employeeId",
        getCanHide: () => true,
        getIsVisible: () => true,
        toggleVisibility: jest.fn(),
        getFilterValue: () => "",
        setFilterValue: jest.fn(),
      },
      {
        id: "email",
        getCanHide: () => true,
        getIsVisible: () => true,
        toggleVisibility: jest.fn(),
        getFilterValue: () => "",
        setFilterValue: jest.fn(),
      },
    ],
    getColumn: (id) => ({
      id,
      getCanHide: () => true,
      getIsVisible: () => true,
      toggleVisibility: jest.fn(),
      getFilterValue: () => "",
      setFilterValue: jest.fn(),
    }),
    getPageCount: () => 2,
    getCanPreviousPage: () => true,
    getCanNextPage: () => true,
    getFilteredSelectedRowModel: () => ({ rows: [] }),
  };

  return {
    useReactTable: () => mockTable,
    getCoreRowModel: () => ({}),
    getPaginationRowModel: () => ({}),
    getSortedRowModel: () => ({}),
    getFilteredRowModel: () => ({}),
  };
});

jest.mock("@/hooks/tableHooks/use-bulk-delete-hook", () => ({
  useBulkDelete: () => ({
    isOpen: false,
    isDeleting: false,
    itemTypeLabel: "employees",
    openDeleteDialog: jest.fn(),
    closeDeleteDialog: jest.fn(),
    handleBulkDelete: jest.fn(),
  }),
}));

describe("EmployeeTable Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock authenticated user
    const authStateChanged = firebaseAuth.onAuthStateChanged as MockFn;
    authStateChanged.mockImplementation((_, callback) => {
      callback({ uid: "user123", email: "test@example.com" } as FirebaseUser);
      return jest.fn();
    });

    // Mock Firestore query and response
    const firestoreQuery = firebaseFirestore.query as MockFn;
    const firestoreWhere = firebaseFirestore.where as MockFn;
    const firestoreOrderBy = firebaseFirestore.orderBy as MockFn;
    const firestoreSnapshot = firebaseFirestore.onSnapshot as MockFn;

    firestoreQuery.mockReturnValue("mocked-query");
    firestoreWhere.mockReturnValue("mocked-where");
    firestoreOrderBy.mockReturnValue("mocked-orderBy");
    firestoreSnapshot.mockImplementation((_, callback) => {
      callback({
        docs: mockSampleData.map((item) => ({
          id: item.id,
          data: () => ({ ...item }),
        })),
      });
      return jest.fn();
    });
  });

  test("renders loading state initially and then displays data", async () => {
    // Override onSnapshot to delay callback
    const firestoreSnapshot = firebaseFirestore.onSnapshot as MockFn;
    firestoreSnapshot.mockImplementationOnce((_, callback) => {
      setTimeout(() => {
        callback({
          docs: mockSampleData.map((item) => ({
            id: item.id,
            data: () => ({ ...item }),
          })),
        });
      }, 100);
      return jest.fn();
    });

    render(<EmployeeTable />);

    expect(screen.getByTestId("table-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("table-loader")).not.toBeInTheDocument();
      expect(screen.getByText("EMP001")).toBeInTheDocument();
      expect(screen.getByText("John")).toBeInTheDocument();
    });
  });

  test("handles unauthenticated state", async () => {
    const authStateChanged = firebaseAuth.onAuthStateChanged as MockFn;
    authStateChanged.mockImplementationOnce((_, callback) => {
      callback(null);
      return jest.fn();
    });

    render(<EmployeeTable />);

    await waitFor(() =>
      expect(screen.queryByTestId("table-loader")).not.toBeInTheDocument()
    );

    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  test("renders add employee button with correct user email", async () => {
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.queryByTestId("table-loader")).not.toBeInTheDocument();
    });

    const addEmployeeButton = screen.getByTestId("add-employee-drawer");
    expect(addEmployeeButton).toBeInTheDocument();
    expect(addEmployeeButton.textContent).toContain("test@example.com");
  });

  test("renders filter input and columns dropdown", async () => {
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.queryByTestId("table-loader")).not.toBeInTheDocument();
    });

    expect(
      screen.getByPlaceholderText("Filter Employee ID")
    ).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
  });

  test("renders import button", async () => {
    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.queryByTestId("table-loader")).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("upload-file")).toBeInTheDocument();
  });
});