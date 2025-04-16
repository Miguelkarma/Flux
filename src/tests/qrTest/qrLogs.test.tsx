import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ScanHistory } from "@/components/QRComponents/ScanHistory";
import { collection, getDocs, query, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";
import "@testing-library/jest-dom";

// mock firebase and components
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock("@/firebase/firebase", () => ({ db: {} }));
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

// mock components with minimal implementations
jest.mock("@/components/SearchComponents/AssetsDetailsDialog", () => ({
  AssetDetailsDialog: () => <div data-testid="asset-details-dialog" />,
}));

jest.mock("@/components/sharedComponent/DeleteDialog", () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="delete-dialog" /> : null,
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
}));

jest.mock("lucide-react", () => ({
  History: () => <span>History</span>,
  Search: () => <span>Search</span>,
  Trash2: () => <span>Delete</span>,
  RefreshCw: () => <span>Refresh</span>,
  Loader2: () => <span>Loading</span>,
  ListRestart: () => <span>Clear</span>,
}));

// test data
const mockData = [
  {
    id: "1",
    serialNum: "SN123",
    userId: "test",
    timestamp: { toDate: () => new Date() },
    found: true,
  },
  {
    id: "2",
    serialNum: "SN456",
    userId: "test",
    timestamp: { toDate: () => new Date() },
    found: false,
  },
];

describe("ScanHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (collection as jest.Mock).mockReturnValue("col-ref");
    (query as jest.Mock).mockReturnValue("query-ref");
    (getDocs as jest.Mock).mockResolvedValue({
      docs: mockData.map((item) => ({ id: item.id, data: () => item })),
      empty: false,
      forEach: (cb: (doc: any) => void) =>
        mockData.forEach((item) => cb({ id: item.id, data: () => item })),
    });
  });

  it("shows loading state initially", () => {
    render(<ScanHistory userId="test" />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("renders history items", async () => {
    render(<ScanHistory userId="test" />);
    await waitFor(() => {
      expect(screen.getByText("SN123")).toBeInTheDocument();
      expect(screen.getByText("SN456")).toBeInTheDocument();
    });
  });

  it("shows empty state", async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({ empty: true, docs: [] });
    render(<ScanHistory userId="test" />);
    await waitFor(() =>
      expect(screen.getByText("No scan history found")).toBeInTheDocument()
    );
  });

  it("refreshes data", async () => {
    render(<ScanHistory userId="test" />);
    await waitFor(() => fireEvent.click(screen.getByText("Refresh")));
    expect(getDocs).toHaveBeenCalledTimes(2);
    expect(toast.success).toHaveBeenCalled();
  });

  it("clears history", async () => {
    render(<ScanHistory userId="test" />);
    await waitFor(() => fireEvent.click(screen.getByText("Clear")));
    expect(deleteDoc).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
  });

  it("opens asset dialog", async () => {
    render(<ScanHistory userId="test" />);
    await waitFor(() => fireEvent.click(screen.getAllByText("Search")[0]));
    expect(screen.getByTestId("asset-details-dialog")).toBeInTheDocument();
  });

  it("opens delete dialog", async () => {
    render(<ScanHistory userId="test" />);
    await waitFor(() => fireEvent.click(screen.getAllByText("Delete")[0]));
    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();
  });
});
