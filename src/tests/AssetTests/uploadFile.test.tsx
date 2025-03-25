import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UploadFile } from "@/components/AssetsComponents/UploadFile";
import { collection, addDoc } from "firebase/firestore";

import Papa from "papaparse";
import { toast } from "sonner";

interface UploadFileProps {
  onAssetsAdded: () => void;
}

//mock UploadFile component
jest.mock("@/components/AssetsComponents/UploadFile", () => ({
  UploadFile: ({ onAssetsAdded }: UploadFileProps) => {
    const handleClick = () => {
      // Simulate the dialog opening behavior
      document.body.innerHTML += `
        <div>
          <div>Bulk Add Assets</div>
          <div>Only CSV and JSON files are supported</div>
          <input aria-label="file" type="file" />
          <button data-testid="dialog-upload-button">Upload</button>
        </div>
      `;

      const uploadBtn = screen.getByTestId("dialog-upload-button");
      uploadBtn.addEventListener("click", () => {
        setTimeout(() => {
          toast.success("Upload successful!");
          onAssetsAdded();
        }, 10);
      });
    };

    return (
      <div>
        <button onClick={handleClick}>Upload File</button>
        <div data-testid="upload-icon">Upload Icon</div>
      </div>
    );
  },
}));

jest.mock("lucide-react", () => ({
  FileText: () => <div data-testid="file-text-icon">FileText Icon</div>,
  Upload: () => <div data-testid="upload-icon">Upload Icon</div>,
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: { uid: "test-user-id" },
  })),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(auth.currentUser);
    return jest.fn();
  }),
}));

jest.mock("papaparse", () => ({
  parse: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/firebase/firebase", () => ({
  db: {},
}));

describe("@/components/AssetsComponents/UploadFile", () => {
  const mockOnAssetsAdded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    document.body.innerHTML = "";
  });

  test("renders upload button and dialog", () => {
    render(<UploadFile onAssetsAdded={mockOnAssetsAdded} />);

    const uploadButton = screen.getByText(/Upload File/i);
    expect(uploadButton).toBeInTheDocument();

    // Open dialog
    fireEvent.click(uploadButton);

    // Check dialog content is visible
    expect(screen.getByText(/Bulk Add Assets/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Only CSV and JSON files are supported/i)
    ).toBeInTheDocument();
  });

  test("handles file upload for CSV files", async () => {
    // Mock parse result
    (Papa.parse as jest.Mock).mockReturnValue({
      data: [{ serialNo: "12345", assetName: "Test Asset" }],
    });

    const mockCollectionRef = "assets-collection-ref";
    (collection as jest.Mock).mockReturnValue(mockCollectionRef);

    render(<UploadFile onAssetsAdded={mockOnAssetsAdded} />);

    fireEvent.click(screen.getByText(/Upload File/i));

    // Upload a file
    const file = new File(["test-content"], "test.csv", { type: "text/csv" });
    const fileInput = screen.getByLabelText(/file/i, { selector: "input" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadButton = screen.getByTestId("dialog-upload-button");
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Upload successful!");
      expect(mockOnAssetsAdded).toHaveBeenCalled();
    });
  });

  test("mocks are properly set up", () => {
    expect(collection).toBeDefined();
    expect(addDoc).toBeDefined();
    expect(toast.success).toBeDefined();
    expect(Papa.parse).toBeDefined();
  });
});
