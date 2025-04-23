import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Sidebar from "@/components/Sidebar";
import { BrowserRouter } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

// mock usetheme
jest.mock("@/hooks/ThemeProvider", () => ({
  useTheme: () => ({ theme: "light" }),
}));

// mock firebase auth
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

// mock firestore
jest.mock("firebase/firestore", () => ({
  ...jest.requireActual("firebase/firestore"),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock("@/firebase/firebase", () => ({
  db: {},
}));

jest.mock("lucide-react", () => ({
  Command: jest.fn(() => <div>Command Icon</div>),
  Laptop: jest.fn(() => <div>Laptop Icon</div>),
  Settings: jest.fn(() => <div>Settings Icon</div>),
  Users: jest.fn(() => <div>Users Icon</div>),
  ChevronDown: jest.fn(() => <div>ChevronDown Icon</div>),
  QrCode: jest.fn(() => <div>QrCode Icon</div>),
  ScanQrCode: jest.fn(() => <div>ScanQrCode Icon</div>),
  History: jest.fn(() => <div>History Icon</div>),
}));

// use capitalized status values to match component expectations
const mockAssetData = [
  { id: "1", status: "Active", userId: "testUser" },
  { id: "2", status: "Active", userId: "testUser" },
  { id: "3", status: "Maintenance", userId: "testUser" },
];

const mockEmployeeData = [
  { id: "e1", name: "Employee 1", userId: "testUser" },
  { id: "e2", name: "Employee 2", userId: "testUser" },
];

describe("Sidebar Component", () => {
  const mockUser = { uid: "testUser" };
  let unsubscribeMock: jest.Mock;

  beforeEach(() => {
    unsubscribeMock = jest.fn();
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback) => {
      callback(mockUser);
      return unsubscribeMock;
    });
    (getAuth as jest.Mock).mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders sidebar links", () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Assets")).toBeInTheDocument();
    expect(screen.getByText("Employee")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("QR Assets")).toBeInTheDocument();
  });

  test("expands QR submenu when clicked", async () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    const qrToggle = screen.getByText("QR Assets");
    fireEvent.click(qrToggle);

    await waitFor(() => {
      expect(screen.getByText("Generate QR")).toBeInTheDocument();
      expect(screen.getByText("Scan QR")).toBeInTheDocument();
      expect(screen.getByText("QR Logs")).toBeInTheDocument();
    });
  });

  test("displays login message when no user is authenticated", () => {
    // mock firebase's onauthstatechanged to return null (no user)
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback) => {
      callback(null); // simulate no user authenticated
      return unsubscribeMock;
    });

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    // assert the login message is displayed
    expect(
      screen.getByText("Please log in to view asset status.")
    ).toBeInTheDocument();
  });

  test("fetches and displays user data when authenticated", async () => {
    // mock firestore functions
    (collection as jest.Mock).mockImplementation((_, collectionName) => {
      if (collectionName === "it-assets") return "assets-collection";
      if (collectionName === "employees") return "employees-collection";
      return null;
    });
    (query as jest.Mock).mockImplementation(
      (collectionRef, ...queryConstraints) => ({
        collectionRef,
        queryConstraints,
      })
    );
    (where as jest.Mock).mockImplementation(() => ({}));

    // first call is for assets
    (getDocs as jest.Mock)
      .mockImplementationOnce((q) => {
        if (q.collectionRef === "assets-collection") {
          return Promise.resolve({
            empty: false,
            size: mockAssetData.length,
            forEach: (callback: any) =>
              mockAssetData.forEach((doc) =>
                callback({
                  id: doc.id,
                  data: () => doc,
                })
              ),
          });
        }
        return Promise.reject(new Error("Unexpected collection"));
      })

      // second call is for employees
      .mockImplementationOnce((q) => {
        if (q.collectionRef === "employees-collection") {
          return Promise.resolve({
            empty: false,
            size: mockEmployeeData.length,
            forEach: (callback: any) =>
              mockEmployeeData.forEach((doc) =>
                callback({
                  id: doc.id,
                  data: () => doc,
                })
              ),
          });
        }
        return Promise.reject(new Error("Unexpected collection"));
      });

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    // wait for data to load and verify asset counts
    await waitFor(() => {
      // verify total assets
      expect(
        screen.getByText("Total Assets").nextElementSibling
      ).toHaveTextContent(mockAssetData.length.toString());

      // verify total employees
      expect(
        screen.getByText("Total Employees").nextElementSibling
      ).toHaveTextContent(mockEmployeeData.length.toString());

      // verify asset statuses
      expect(screen.getByText("Active").nextElementSibling).toHaveTextContent(
        "2"
      );
      expect(
        screen.getByText("Maintenance").nextElementSibling
      ).toHaveTextContent("1");
    });
  });
});
