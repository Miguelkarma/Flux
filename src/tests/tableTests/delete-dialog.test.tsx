import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import DeleteDialog, {
  ItemType,
} from "@/components/sharedComponent/DeleteDialog";
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

// mock dialog
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-dialog">{children}</div>
  ),
  DialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-dialog-trigger">{children}</div>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-dialog-title">{children}</div>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-dialog-description">{children}</div>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-dialog-footer">{children}</div>
  ),
  DialogClose: (props: any) => (
    <button data-testid="mock-dialog-close" {...props} />
  ),
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  deleteDoc: jest.fn(),
  getFirestore: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockSetIsOpen = jest.fn();
const mockOnAssetUpdated = jest.fn();
const mockOnEmployeeUpdated = jest.fn();

const mockUser = { uid: "test-user" };
(getAuth as jest.Mock).mockReturnValue({
  currentUser: mockUser,
});

describe("DeleteDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deletes an asset successfully", async () => {
    (deleteDoc as jest.Mock).mockResolvedValueOnce(undefined);
    (doc as jest.Mock).mockReturnValue("mock-asset-ref");

    const assetItem: ItemType = {
      type: "asset",
      data: {
        id: "asset123",
        assetTag: "ASSET-TAG",
        serialNo: "SN123456",
        type: "Laptop",
        location: "Office 1",
        assignedEmployee: "John Doe",
        status: "Active",
        dateAdded: "2024-01-01",
        model: "Dell Latitude",
      },
    };

    render(
      <DeleteDialog
        item={assetItem}
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onAssetUpdated={mockOnAssetUpdated}
      />
    );

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(deleteDoc).toHaveBeenCalledWith("mock-asset-ref");
      expect(toast.success).toHaveBeenCalledWith(
        "ASSET-TAG deleted successfully."
      );
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);
      expect(mockOnAssetUpdated).toHaveBeenCalled();
    });
  });

  it("deletes an employee successfully", async () => {
    (deleteDoc as jest.Mock).mockResolvedValueOnce(undefined);
    (doc as jest.Mock).mockReturnValue("mock-employee-ref");

    const employeeItem: ItemType = {
      type: "employee",
      data: {
        id: "emp123",
        employeeId: "E-001",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        department: "Engineering",
        position: "Software Engineer",
        status: "Active",
        dateAdded: "2024-01-01",
        location: "HQ",
      },
    };

    render(
      <DeleteDialog
        item={employeeItem}
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        onEmployeeUpdated={mockOnEmployeeUpdated}
      />
    );

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(deleteDoc).toHaveBeenCalledWith("mock-employee-ref");
      expect(toast.success).toHaveBeenCalledWith(
        "John Doe deleted successfully."
      );
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);
      expect(mockOnEmployeeUpdated).toHaveBeenCalled();
    });
  });

  it("shows error when no user is logged in", async () => {
    (getAuth as jest.Mock).mockReturnValueOnce({ currentUser: null });

    const assetItem: ItemType = {
      type: "asset",
      data: {
        id: "asset123",
        assetTag: "ASSET-TAG",
        serialNo: "SN123456",
        type: "Laptop",
        location: "Office 1",
        assignedEmployee: "John Doe",
        status: "Active",
        dateAdded: "2024-01-01",
        model: "Dell Latitude",
      },
    };

    render(
      <DeleteDialog item={assetItem} isOpen={true} setIsOpen={mockSetIsOpen} />
    );

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "You must be logged in to delete items."
      );
      expect(deleteDoc).not.toHaveBeenCalled();
    });
  });

  it("shows error when asset ID is missing", async () => {
    const assetItem: ItemType = {
      type: "asset",
      data: {
        id: "",
        assetTag: "ASSET-TAG",
        serialNo: "SN123456",
        type: "Laptop",
        location: "Office 1",
        assignedEmployee: "John Doe",
        status: "Active",
        dateAdded: "2024-01-01",
        model: "Dell Latitude",
      },
    };

    render(
      <DeleteDialog item={assetItem} isOpen={true} setIsOpen={mockSetIsOpen} />
    );

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error: Asset ID is missing");
      expect(deleteDoc).not.toHaveBeenCalled();
    });
  });
});
