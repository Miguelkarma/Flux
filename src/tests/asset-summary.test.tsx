import { render, screen, waitFor } from "@testing-library/react";
import AssetSummary from "@/components/DashboardComponents/AssetSummary";
import { useAuth } from "@/hooks/use-auth";
import { collection, onSnapshot } from "firebase/firestore";

// mock useauth hook
jest.mock("@/hooks/use-auth", () => ({
  useAuth: jest.fn(),
}));

// mock firestore
jest.mock("@/firebase/firebase", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  onSnapshot: jest.fn(),
}));

// mock icons
jest.mock("lucide-react", () => ({
  Computer: () => <div>ComputerIcon</div>,
  HardDrive: () => <div>HardDriveIcon</div>,
  Laptop: () => <div>LaptopIcon</div>,
  BarChart3: () => <div>BarChart3Icon</div>,
  LineChart: () => <div>LineChartIcon</div>,
  Users: () => <div>UsersIcon</div>,
  UserCheck: () => <div>UserCheckIcon</div>,
}));

describe("@/components/DashboardComponents/AssetSummary.tsx", () => {
  const mockUser = {
    uid: "test-uid",
  };

  const mockAssetsData = [
    { status: "Active", dateAdded: { toDate: () => new Date() } },
    { status: "Active", dateAdded: { toDate: () => new Date() } },
    {
      status: "Maintenance",
      dateAdded: {
        toDate: () => new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
      },
    },
  ];

  const mockEmployeesData = [
    { status: "Active" },
    { status: "Active" },
    { status: "On Leave" },
  ];

  beforeEach(() => {
    // setup mock auth user
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      handleLogout: jest.fn(),
    });

    // mock firestore snapshot for assets
    (onSnapshot as jest.Mock).mockImplementation((_query, callback) => {
      callback({
        forEach: (fn: (doc: any) => void) => {
          mockAssetsData.forEach((data) => {
            fn({ data: () => data });
          });
        },
      });
      return jest.fn(); // unsubscribe
    });

    // mock collection paths
    (collection as jest.Mock).mockImplementation((_db, collectionName) => {
      if (collectionName === "it-assets") return "assets-collection";
      if (collectionName === "employees") return "employees-collection";
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<AssetSummary />);
    expect(screen.getByText("Total Assets")).toBeInTheDocument();
  });

  it("displays loading state initially", () => {
    render(<AssetSummary />);
  });

  it("fetches and displays asset data", async () => {
    render(<AssetSummary />);
    await waitFor(() => {
      const twos = screen.getAllByText("2");
      expect(twos.length).toBe(2);
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  it("calculates percentages correctly", async () => {
    render(<AssetSummary />);
    await waitFor(() => {
      expect(screen.getByText(/66\.7% of total assets/)).toBeInTheDocument();
      expect(screen.getByText(/33\.3% of total assets/)).toBeInTheDocument();
    });
  });

  it("displays employee data", async () => {
    (onSnapshot as jest.Mock).mockImplementationOnce((_query, callback) => {
      callback({
        forEach: (fn: (doc: any) => void) => {
          mockEmployeesData.forEach((data) => {
            fn({ data: () => data });
          });
        },
      });
      return jest.fn();
    });

    render(<AssetSummary />);
    await waitFor(() => {
      const twos = screen.getAllByText("2");
      expect(twos.length).toBe(2);
    });
  });

  it("handles empty data", async () => {
    (onSnapshot as jest.Mock).mockImplementation((_query, callback) => {
      callback({
        forEach: (_fn: (doc: any) => void) => {},
      });
      return jest.fn();
    });

    render(<AssetSummary />);
    await waitFor(() => {
      const zeros = screen.getAllByText("0");
      expect(zeros.length).toBe(5);
    });
  });

  it("unsubscribes on unmount", () => {
    const unsubscribeAssets = jest.fn();
    const unsubscribeEmployees = jest.fn();
    (onSnapshot as jest.Mock)
      .mockReturnValueOnce(unsubscribeAssets)
      .mockReturnValueOnce(unsubscribeEmployees);

    const { unmount } = render(<AssetSummary />);
    unmount();
    expect(unsubscribeAssets).toHaveBeenCalled();
    expect(unsubscribeEmployees).toHaveBeenCalled();
  });

  it("skips fetch if no user", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      handleLogout: jest.fn(),
    });
    render(<AssetSummary />);
    expect(onSnapshot).not.toHaveBeenCalled();
  });
});
