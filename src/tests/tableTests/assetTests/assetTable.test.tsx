/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DataTable } from "@/components/AssetsComponents/table/table";
import * as firebaseAuth from "firebase/auth";
import * as firebaseFirestore from "firebase/firestore";

// Type declarations to help with mocks
type MockFn = jest.Mock<any, any>;
type FirebaseUser = { uid: string; email: string | null };

// Define interfaces for your data
interface AssetItem {
  id: string;
  serialNo: string;
  assetName: string;
  email: string;
  assignedEmployee: string;
  status: string;
  userId: string;
  dateAdded: string;
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

// Mock UI components - with proper types
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

// Mock custom components
jest.mock("@/components/AssetsComponents/AddAssetDrawer", () => ({
  AddAssetDrawer: ({
    onAssetAdded,
    userEmail,
  }: {
    onAssetAdded?: () => void;
    userEmail?: string;
  }) => (
    <button onClick={onAssetAdded} data-testid="add-asset-drawer">
      Add Asset ({userEmail})
    </button>
  ),
}));

jest.mock("@/components/AssetsComponents/BulkDeleteDialog", () => ({
  BulkDeleteComponent: ({
    clearSelection,
    selectedRowIds,
  }: {
    clearSelection?: () => void;
    selectedRowIds: string[];
  }) => (
    <button onClick={clearSelection} data-testid="bulk-delete-component">
      Delete ({selectedRowIds.length})
    </button>
  ),
}));

jest.mock("@/Animation/TableLoader", () => ({
  __esModule: true,
  default: () => <div data-testid="table-loader">Loading...</div>,
}));

// Sample data for tests
const mockSampleData: AssetItem[] = [
  {
    id: "1",
    serialNo: "SN001",
    assetName: "Laptop",
    email: "user1@example.com",
    assignedEmployee: "John Doe",
    status: "Active",
    userId: "user123",
    dateAdded: "2023-01-01",
  },
  {
    id: "2",
    serialNo: "SN002",
    assetName: "Monitor",
    email: "user2@example.com",
    assignedEmployee: "Jane Smith",
    status: "Inactive",
    userId: "user123",
    dateAdded: "2023-01-02",
  },
];

// Mock columns with proper types
type ColumnDef = {
  id?: string;
  accessorKey?: string;
  header: string | (() => React.ReactNode);
  cell?: any;
};

jest.mock("@/components/AssetsComponents/columns", () => {
  const columns: ColumnDef[] = [
    {
      id: "select",
      header: () => <input type="checkbox" data-testid="select-all" />,
      cell: ({ row }: { row: { id: string } }) => (
        <input type="checkbox" data-testid={`select-row-${row.id}`} />
      ),
    },
    { accessorKey: "serialNo", header: "Serial No" },
    { accessorKey: "assetName", header: "Asset Name" },
    { accessorKey: "email", header: "Email" },
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
            id: "serialNo",
            isPlaceholder: false,
            column: { columnDef: { header: "Serial No" } },
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
            id: `${index}-serialNo`,
            column: { columnDef: { cell: item.serialNo } },
            getContext: () => ({}),
          },
        ],
      })),
    }),
    getAllColumns: () => [
      {
        id: "serialNo",
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

describe("DataTable Component", () => {
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

    render(<DataTable />);

    expect(screen.getByTestId("table-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("table-loader")).not.toBeInTheDocument();
    });
  });

  test("handles unauthenticated state", async () => {
    const authStateChanged = firebaseAuth.onAuthStateChanged as MockFn;
    authStateChanged.mockImplementationOnce((_, callback) => {
      callback(null);
      return jest.fn();
    });

    render(<DataTable />);

    await waitFor(() =>
      expect(screen.queryByTestId("table-loader")).not.toBeInTheDocument()
    );

    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  test("renders add asset button with correct user email", async () => {
    render(<DataTable />);

    await waitFor(() => {
      expect(screen.queryByTestId("table-loader")).not.toBeInTheDocument();
    });

    const addAssetButton = screen.getByTestId("add-asset-drawer");
    expect(addAssetButton).toBeInTheDocument();
    expect(addAssetButton.textContent).toContain("test@example.com");
  });
});
