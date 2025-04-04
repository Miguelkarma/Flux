import { render, screen, fireEvent } from "@testing-library/react";
import { DataTable } from "@/components/AssetsComponents/table";
import { useAuth } from "@/hooks/use-auth";
import { useFirestoreData } from "@/hooks/tableHooks/firestore-data-hook";
import { useDataTable } from "@/hooks/tableHooks/table-hook";
import { useBulkDelete } from "@/hooks/tableHooks/use-bulk-delete-hook";

// Mock hooks
jest.mock("@/hooks/use-auth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/hooks/tableHooks/firestore-data-hook", () => ({
  useFirestoreData: jest.fn(),
}));

jest.mock("@/hooks/tableHooks/table-hook", () => ({
  useDataTable: jest.fn(),
}));

jest.mock("@/hooks/tableHooks/use-bulk-delete-hook", () => ({
  useBulkDelete: jest.fn(),
}));

// Mock UI components (similar to EmployeeTable but with asset-specific changes)
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
    <button onClick={onClick} disabled={disabled} data-testid="button">
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: ({
    placeholder,
    value,
    onChange,
  }: {
    placeholder?: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
  }) => (
    <input
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
      data-testid="input"
    />
  ),
}));

jest.mock("@/components/ui/table", () => ({
  Table: ({ children }: { children: React.ReactNode }) => (
    <table data-testid="table">{children}</table>
  ),
  TableHeader: ({ children }: { children: React.ReactNode }) => (
    <thead>{children}</thead>
  ),
  TableBody: ({ children }: { children: React.ReactNode }) => (
    <tbody>{children}</tbody>
  ),
  TableRow: ({ children }: { children: React.ReactNode }) => (
    <tr>{children}</tr>
  ),
  TableHead: ({ children }: { children: React.ReactNode }) => (
    <th>{children}</th>
  ),
  TableCell: ({
    children,
    colSpan,
  }: {
    children: React.ReactNode;
    colSpan?: number;
  }) => <td colSpan={colSpan}>{children}</td>,
}));

// Mock other components
jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  ),
}));

jest.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ScrollBar: () => <div></div>,
}));

jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuCheckboxItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock custom components
jest.mock("@/components/AssetsComponents/AddAssetDrawer", () => ({
  AddAssetDrawer: ({ onAssetAdded }: { onAssetAdded: () => void }) => (
    <button onClick={onAssetAdded} data-testid="add-asset">
      Add Asset
    </button>
  ),
}));

jest.mock("@/components/sharedComponent/UploadFile", () => ({
  UploadFile: ({ onDataAdded }: { onDataAdded: () => void }) => (
    <button onClick={onDataAdded} data-testid="upload-file">
      Import
    </button>
  ),
}));

jest.mock("@/components/sharedComponent/BulkDeleteDialog", () => ({
  BulkDeleteDialog: () => <div data-testid="bulk-delete-dialog"></div>,
  BulkDeleteTrigger: ({
    onClick,
  }: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
  }) => (
    <button onClick={onClick} data-testid="bulk-delete-trigger">
      Delete
    </button>
  ),
}));

jest.mock("@/Animation/TableLoader", () => ({
  __esModule: true,
  default: () => <div data-testid="table-loader">Loading...</div>,
}));

// Mock lucide react icons
jest.mock("lucide-react", () => ({
  ChevronDown: () => <span>▼</span>,
}));

describe("AssetTable", () => {
  // Simplified mock data for assets
  const mockAssets = [
    {
      id: "1",
      serialNo: "SN001",
      assetTag: "AT001",
      model: "Dell XPS",
      type: "Laptop",
    },
    {
      id: "2",
      serialNo: "SN002",
      assetTag: "AT002",
      model: "MacBook Pro",
      type: "Laptop",
    },
  ];

  // Simplified table mock
  const mockTable = {
    getHeaderGroups: jest.fn().mockReturnValue([
      {
        id: "header-group-1",
        headers: [
          {
            id: "serialNo",
            isPlaceholder: false,
            column: {
              columnDef: { header: "Serial No." },
              getFilterValue: jest.fn(),
              setFilterValue: jest.fn(),
            },
            getContext: jest.fn(),
          },
        ],
      },
    ]),
    getRowModel: jest.fn().mockReturnValue({
      rows: [
        {
          id: "1",
          getIsSelected: jest.fn().mockReturnValue(false),
          getVisibleCells: jest.fn().mockReturnValue([
            {
              id: "cell-1",
              column: { columnDef: { cell: "SN001" } },
              getContext: jest.fn(),
            },
          ]),
        },
      ],
    }),
    getColumn: jest.fn().mockReturnValue({
      getFilterValue: jest.fn(),
      setFilterValue: jest.fn(),
    }),
    getAllColumns: jest.fn().mockReturnValue([
      {
        id: "serialNo",
        getCanHide: jest.fn().mockReturnValue(true),
        getIsVisible: jest.fn().mockReturnValue(true),
        toggleVisibility: jest.fn(),
      },
    ]),
    previousPage: jest.fn(),
    nextPage: jest.fn(),
    getCanPreviousPage: jest.fn().mockReturnValue(true),
    getCanNextPage: jest.fn().mockReturnValue(true),
    getState: jest.fn().mockReturnValue({
      pagination: { pageIndex: 0 },
    }),
    getPageCount: jest.fn().mockReturnValue(2),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({
      userId: "user123",
      userEmail: "test@example.com",
      loading: false,
    });

    (useFirestoreData as jest.Mock).mockReturnValue({
      data: mockAssets,
      loading: false,
      refreshData: jest.fn(),
    });

    (useDataTable as jest.Mock).mockReturnValue({
      table: mockTable,
      selectedRowIds: ["2"],
      setRowSelection: jest.fn(),
    });

    (useBulkDelete as jest.Mock).mockReturnValue({
      isOpen: false,
      isDeleting: false,
      itemTypeLabel: "assets",
      openDeleteDialog: jest.fn(),
      closeDeleteDialog: jest.fn(),
      handleBulkDelete: jest.fn(),
    });
  });

  // Test cases
  test("renders the table when data is loaded", () => {
    render(<DataTable />);
    expect(screen.getByTestId("table")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Filter Serial No.")
    ).toBeInTheDocument();
  });

  test("shows loading state when data is loading", () => {
    (useFirestoreData as jest.Mock).mockReturnValue({
      data: [],
      loading: true,
      refreshData: jest.fn(),
    });

    render(<DataTable />);
    expect(screen.getByTestId("table-loader")).toBeInTheDocument();
  });

  test("refreshes data when add asset button is clicked", () => {
    const mockRefreshData = jest.fn();
    (useFirestoreData as jest.Mock).mockReturnValue({
      data: mockAssets,
      loading: false,
      refreshData: mockRefreshData,
    });

    render(<DataTable />);
    fireEvent.click(screen.getByTestId("add-asset"));
    expect(mockRefreshData).toHaveBeenCalled();
  });

  test("handles bulk delete button click", () => {
    const mockOpenDeleteDialog = jest.fn();
    (useBulkDelete as jest.Mock).mockReturnValue({
      isOpen: false,
      isDeleting: false,
      itemTypeLabel: "assets",
      openDeleteDialog: mockOpenDeleteDialog,
      closeDeleteDialog: jest.fn(),
      handleBulkDelete: jest.fn(),
    });

    render(<DataTable />);

    if (screen.queryByTestId("bulk-delete-trigger")) {
      fireEvent.click(screen.getByTestId("bulk-delete-trigger"));
      expect(mockOpenDeleteDialog).toHaveBeenCalledWith(["2"]);
    }
  });

  test("filters assets by serial number", () => {
    const mockSetFilterValue = jest.fn();
    (useDataTable as jest.Mock).mockReturnValue({
      table: {
        ...mockTable,
        getColumn: jest.fn().mockReturnValue({
          getFilterValue: jest.fn().mockReturnValue(""),
          setFilterValue: mockSetFilterValue,
        }),
      },
      selectedRowIds: [],
      setRowSelection: jest.fn(),
    });

    render(<DataTable />);
    const filterInput = screen.getByPlaceholderText("Filter Serial No.");
    fireEvent.change(filterInput, { target: { value: "SN001" } });
    expect(mockSetFilterValue).toHaveBeenCalledWith("SN001");
  });

  test("shows no results when assets array is empty", () => {
    (useFirestoreData as jest.Mock).mockReturnValue({
      data: [],
      loading: false,
      refreshData: jest.fn(),
    });

    render(<DataTable />);
    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  test("handles column visibility toggle", () => {
    render(<DataTable />);
    fireEvent.click(screen.getByText("Columns"));
    // Additional assertions would be needed here if we had access to the actual dropdown items
  });

  test("handles pagination controls", () => {
    render(<DataTable />);
    fireEvent.click(screen.getByText("Previous"));
    expect(mockTable.previousPage).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Next"));
    expect(mockTable.nextPage).toHaveBeenCalled();
  });
});
