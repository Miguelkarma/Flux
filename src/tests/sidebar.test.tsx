import { render, screen, waitFor } from "@testing-library/react";
import Sidebar from "@/components/Sidebar";
import { BrowserRouter } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ThemeProvider } from "@/hooks/ThemeProvider";

// mock Firebase
jest.mock("firebase/auth");
jest.mock("firebase/firestore");

// mock Lucide
jest.mock("lucide-react", () => ({
  Command: () => <div data-testid="command-icon" />,
  Laptop: () => <div data-testid="laptop-icon" />,
  Users: () => <div data-testid="users-icon" />,
  Banknote: () => <div data-testid="banknote-icon" />,
  ExternalLink: () => <div data-testid="external-link-icon" />,
}));

describe("Sidebar Component", () => {
  const mockUser = { uid: "test-uid", email: "test@example.com" };

  beforeEach(() => {
    jest.clearAllMocks();

    (getAuth as jest.Mock).mockReturnValue({});
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });
  });

  const renderSidebar = () => {
    return render(
      <BrowserRouter>
        <ThemeProvider>
          <Sidebar />
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  test("renders navigation links", () => {
    renderSidebar();

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Assets")).toBeInTheDocument();
    expect(screen.getByText("Employee")).toBeInTheDocument();
    expect(screen.getByText("Exchange")).toBeInTheDocument();
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
  });

  test("displays asset and employee status when authenticated", async () => {
    // mock Firestore responses
    const mockEmployees = [
      { id: "emp1", data: () => ({ userId: "test-uid" }) },
      { id: "emp2", data: () => ({ userId: "test-uid" }) },
    ];

    const mockAssets = [
      { id: "asset1", data: () => ({ status: "Active", userId: "test-uid" }) },
      {
        id: "asset2",
        data: () => ({ status: "Maintenance", userId: "test-uid" }),
      },
      { id: "asset3", data: () => ({ status: "Retired", userId: "test-uid" }) },
      {
        id: "asset4",
        data: () => ({ status: "Available", userId: "test-uid" }),
      },
      { id: "asset5", data: () => ({ status: "Lost", userId: "test-uid" }) },
    ];

    // mock query and getDocs
    (collection as jest.Mock).mockImplementation((_db, collectionName) => {
      return collectionName;
    });

    (where as jest.Mock).mockReturnValue({});

    (query as jest.Mock).mockReturnValue({});

    (getDocs as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          forEach: (callback: any) => mockEmployees.forEach(callback),
          size: mockEmployees.length,
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          forEach: (callback: any) => mockAssets.forEach(callback),
          size: mockAssets.length,
        })
      );

    renderSidebar();

    // test for overview section
    await waitFor(() => {
      expect(screen.getByText("OVERVIEW")).toBeInTheDocument();
      expect(screen.getByText("Total Employees")).toBeInTheDocument();
      expect(screen.getByText("Total Assets")).toBeInTheDocument();
    });

    // Test for asset status section
    await waitFor(() => {
      expect(screen.getByText("ASSET STATUS")).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();
      expect(screen.getByText("Maintenance")).toBeInTheDocument();
      expect(screen.getByText("Retired")).toBeInTheDocument();
      expect(screen.getByText("Available")).toBeInTheDocument();
      expect(screen.getByText("Lost")).toBeInTheDocument();
    });
  });

  test("displays login prompt when not authenticated", async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback) => {
      callback(null);
      return jest.fn();
    });

    renderSidebar();

    await waitFor(() => {
      expect(
        screen.getByText("Please log in to view asset status.")
      ).toBeInTheDocument();
    });
  });
});
