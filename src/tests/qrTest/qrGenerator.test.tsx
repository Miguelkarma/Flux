import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QRGenerator } from "@/components/QRComponents/QrGenerator";
import { QRService } from "@/api/qrApi";

// mock the QRService
jest.mock("@/api/qrApi", () => ({
  QRService: {
    generateQRCodeUrl: jest.fn(),
    downloadQRCode: jest.fn(),
  },
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input {...props} data-testid="input" />,
}));

jest.mock("@/components/ui/button", () => ({
  Button: (props: any) => <button {...props}>{props.children}</button>,
}));

jest.mock("@/components/ui/card", () => ({
  Card: (props: any) => <div>{props.children}</div>,
  CardContent: (props: any) => <div>{props.children}</div>,
  CardHeader: (props: any) => <div>{props.children}</div>,
  CardTitle: (props: any) => <div>{props.children}</div>,
}));
jest.mock("lucide-react", () => ({
  QrCode: () => <svg data-testid="icon" />,
  BadgeInfo: () => <svg data-testid="icon" />,
}));

describe("QRGenerator Component", () => {
  const mockGenerateUrl = QRService.generateQRCodeUrl as jest.Mock;
  const mockDownload = QRService.downloadQRCode as jest.Mock;

  beforeEach(() => {
    mockGenerateUrl.mockClear();
    mockDownload.mockClear();
  });

  test("renders input and buttons", () => {
    render(<QRGenerator userId="user123" />);
    expect(
      screen.getByPlaceholderText("Enter Asset Serial Number")
    ).toBeInTheDocument();
    expect(screen.getByText("Generate QR Code")).toBeInTheDocument();
    expect(screen.getByText("Download QR Code")).toBeInTheDocument();
  });

  test("generates QR code when serial number is entered", async () => {
    const serial = "SN12345";
    const mockUrl = "https://example.com/qr.png";

    mockGenerateUrl.mockReturnValue(mockUrl);

    render(<QRGenerator userId="user123" />);
    const input = screen.getByPlaceholderText("Enter Asset Serial Number");
    fireEvent.change(input, { target: { value: serial } });

    const generateButton = screen.getByText("Generate QR Code");
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(mockGenerateUrl).toHaveBeenCalledWith(`${serial}|user:user123`);
      expect(screen.getByAltText("QR Code")).toHaveAttribute("src", mockUrl);
    });
  });

  test("calls downloadQRCode when download button is clicked", async () => {
    const serial = "SN12345";
    const mockUrl = "https://example.com/qr.png";

    mockGenerateUrl.mockReturnValue(mockUrl);
    mockDownload.mockResolvedValueOnce(undefined);

    render(<QRGenerator userId="user123" />);
    const input = screen.getByPlaceholderText("Enter Asset Serial Number");
    fireEvent.change(input, { target: { value: serial } });

    fireEvent.click(screen.getByText("Generate QR Code"));

    await waitFor(() => {
      expect(screen.getByAltText("QR Code")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Download QR Code"));

    await waitFor(() => {
      expect(mockDownload).toHaveBeenCalledWith(mockUrl, `QR_${serial}.png`);
    });
  });

  test("does not generate or download QR if input is empty", () => {
    render(<QRGenerator />);
    fireEvent.click(screen.getByText("Generate QR Code"));
    fireEvent.click(screen.getByText("Download QR Code"));

    expect(mockGenerateUrl).not.toHaveBeenCalled();
    expect(mockDownload).not.toHaveBeenCalled();
  });
});
