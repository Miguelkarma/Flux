import { render, fireEvent, screen } from "@testing-library/react";
import { QRScanner } from "@/components/QRComponents/QrScanner";
import { useQRScanner } from "@/hooks/use-qr-scanner";
import { useAssetDetails } from "@/hooks/use-asset-details";
import { useScanHistory } from "@/hooks/use-qr-history";

// mock hooks and UI components
jest.mock("@/hooks/use-qr-scanner");
jest.mock("@/hooks/use-asset-details");
jest.mock("@/hooks/use-qr-history");

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: ({ onChange, ref }: any) => (
    <input type="file" onChange={onChange} ref={ref} role="input" />
  ),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@/components/SearchComponents/AssetsDetailsDialog", () => ({
  AssetDetailsDialog: () => <div>AssetDetailsDialog</div>,
}));

jest.mock("lucide-react", () => ({
  Upload: () => <div>UploadIcon</div>,
  Camera: () => <div>CameraIcon</div>,
  Loader2: () => <div>LoaderIcon</div>,
}));

describe("QRScanner - Essential Functionality", () => {
  const mockQRScanner = {
    uploadedImage: null,
    isCameraDialogOpen: false,
    setIsCameraDialogOpen: jest.fn(),
    isScanning: false,
    scanResult: null,
    isLoading: false,
    fileInputRef: { current: { click: jest.fn() } },
    videoRef: { current: null },
    handleFileUpload: jest.fn(),
    startCamera: jest.fn(),
    stopCamera: jest.fn(),
    resetScan: jest.fn(),
    manualScan: jest.fn(),
  };

  const mockAssetDetails = {
    selectedAsset: null,
    isDialogOpen: false,
    setIsDialogOpen: jest.fn(),
    fetchAssetBySerialNumber: jest.fn(),
  };

  const mockScanHistory = {
    saveScanHistory: jest.fn(),
  };

  beforeEach(() => {
    (useQRScanner as jest.Mock).mockReturnValue(mockQRScanner);
    (useAssetDetails as jest.Mock).mockReturnValue(mockAssetDetails);
    (useScanHistory as jest.Mock).mockReturnValue(mockScanHistory);
  });

  afterEach(() => jest.clearAllMocks());

  it("renders upload and scan buttons", () => {
    render(<QRScanner userId="1" user={undefined} />);
    expect(screen.getByText("Upload QR Code")).toBeInTheDocument();
    expect(screen.getByText("Scan QR Code")).toBeInTheDocument();
  });

  it("triggers file input on upload click", () => {
    render(<QRScanner userId="1" user={undefined} />);
    fireEvent.click(screen.getByText("Upload QR Code"));
    expect(mockQRScanner.fileInputRef.current.click).toHaveBeenCalled();
  });

  it("disables scan button when loading", () => {
    (useQRScanner as jest.Mock).mockReturnValue({
      ...mockQRScanner,
      isLoading: true,
    });
    render(<QRScanner userId="1" user={undefined} />);
    expect(screen.getByText("Scan QR Code")).toBeDisabled();
  });

  it("renders uploaded image if present", () => {
    (useQRScanner as jest.Mock).mockReturnValue({
      ...mockQRScanner,
      uploadedImage: "test-img-url",
    });
    render(<QRScanner userId="1" user={undefined} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "test-img-url");
  });

  it("shows scan result if available", () => {
    (useQRScanner as jest.Mock).mockReturnValue({
      ...mockQRScanner,
      scanResult: "SN12345",
    });
    render(<QRScanner userId="1" user={undefined} />);
    expect(screen.getByText("SN12345")).toBeInTheDocument();
  });
});
