import { QRService } from "@/api/qrApi";
import axios from "axios";
import { toast } from "sonner";

// mock axios globally
jest.mock("axios");
jest.mock("sonner");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("QRService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = jest.fn().mockReturnValue("blob:mock-url");
    global.URL.revokeObjectURL = jest.fn();
  });

  describe("scanQRCode", () => {
    it("should successfully scan a QR code", async () => {
      // mock successful response
      const mockResponse = [
        {
          symbol: [
            {
              data: "https://example.com",
            },
          ],
        },
      ];

      mockedAxios.post.mockResolvedValueOnce({
        data: mockResponse,
      });

      const imageBlob = new Blob(["fake image data"], { type: "image/png" });
      const result = await QRService.scanQRCode(imageBlob);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://api.qrserver.com/v1/read-qr-code/",
        expect.any(FormData),
        expect.objectContaining({
          headers: { "Content-Type": "multipart/form-data" },
        })
      );
      expect(result).toBe("https://example.com");
    });

    it("should return null when QR code data is not found", async () => {
      // mock response with no data
      const mockResponse = [
        {
          symbol: [
            {
              data: "",
            },
          ],
        },
      ];

      mockedAxios.post.mockResolvedValueOnce({
        data: mockResponse,
      });

      const imageBlob = new Blob(["fake image data"], { type: "image/png" });
      const result = await QRService.scanQRCode(imageBlob);

      expect(result).toBeNull();
    });

    it("should throw an error when API call fails", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("Network error"));

      const imageBlob = new Blob(["fake image data"], { type: "image/png" });

      await expect(QRService.scanQRCode(imageBlob)).rejects.toThrow(
        "Failed to scan QR code"
      );
    });
  });

  describe("captureFrameFromVideo", () => {
    it("should capture a frame from video element", async () => {
      // mock canvas and context
      const mockContext = {
        drawImage: jest.fn(),
      };

      const mockCanvas = {
        getContext: jest.fn().mockReturnValue(mockContext),
        width: 0,
        height: 0,
        toDataURL: jest.fn().mockReturnValue("data:image/png;base64,fakedata"),
      };

      document.createElement = jest.fn().mockReturnValue(mockCanvas);

      const mockBlob = new Blob(["fake blob data"], { type: "image/png" });
      mockedAxios.get.mockResolvedValueOnce({
        data: mockBlob,
      });

      // create mock video element
      const mockVideoElement = {
        videoWidth: 640,
        videoHeight: 480,
      } as HTMLVideoElement;

      const result = await QRService.captureFrameFromVideo(mockVideoElement);

      expect(mockCanvas.width).toBe(640);
      expect(mockCanvas.height).toBe(480);
      expect(mockContext.drawImage).toHaveBeenCalledWith(
        mockVideoElement,
        0,
        0,
        640,
        480
      );
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith("image/png");
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "data:image/png;base64,fakedata",
        { responseType: "blob" }
      );
      expect(result).toEqual(mockBlob);
    });
  });

  describe("dataUrlToBlob", () => {
    it("should convert data URL to blob", async () => {
      const mockBlob = new Blob(["fake blob data"], { type: "image/png" });
      mockedAxios.get.mockResolvedValueOnce({
        data: mockBlob,
      });

      const result = await QRService.dataUrlToBlob(
        "data:image/png;base64,fakedata"
      );

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "data:image/png;base64,fakedata",
        { responseType: "blob" }
      );
      expect(result).toEqual(mockBlob);
    });
  });

  describe("generateQRCodeUrl", () => {
    it("should generate correct QR code URL with default size", () => {
      const data = "https://example.com";
      const url = QRService.generateQRCodeUrl(data);

      expect(url).toBe(
        "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https%3A%2F%2Fexample.com"
      );
    });
  });

  describe("downloadQRCode", () => {
    it("should download QR code successfully", async () => {
      const mockBlob = new Blob(["fake blob data"], { type: "image/png" });
      mockedAxios.get.mockResolvedValueOnce({
        data: mockBlob,
      });

      // Mock DOM methods
      const mockLink = {
        href: "",
        download: "",
        click: jest.fn(),
      };

      document.createElement = jest.fn().mockReturnValue(mockLink);
      document.body.appendChild = jest.fn();
      document.body.removeChild = jest.fn();

      await QRService.downloadQRCode(
        "https://example.com/qr.png",
        "qrcode.png"
      );

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://example.com/qr.png",
        {
          responseType: "blob",
        }
      );
      expect(URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(mockLink.href).toBe("blob:mock-url");
      expect(mockLink.download).toBe("qrcode.png");
      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(mockLink.click).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
      expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");

      // Ensure toast.error was not called
      expect(toast.error).not.toHaveBeenCalled();
    });

    it("should do nothing if URL is empty", async () => {
      await QRService.downloadQRCode("", "qrcode.png");
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it("should throw an error when download fails", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

      await expect(
        QRService.downloadQRCode("https://example.com/qr.png", "qrcode.png")
      ).rejects.toThrow("Failed to download QR code");
    });
  });
});
