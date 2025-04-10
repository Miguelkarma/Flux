import { QRScannerService } from "@/api/qrApi";

// mock fetch globally
global.fetch = jest.fn();

// proper formdata mock
global.FormData = jest.fn().mockImplementation(() => ({
  append: jest.fn(),
}));

global.File = jest.fn() as any;

describe("QRScannerService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const imageBlob = new Blob(["fake image data"], { type: "image/png" });
      const result = await QRScannerService.scanQRCode(imageBlob);

      // fix: don't strictly check the formdata object
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.qrserver.com/v1/read-qr-code/",
        expect.objectContaining({
          method: "POST",
          body: expect.anything(),
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

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const imageBlob = new Blob(["fake image data"], { type: "image/png" });
      const result = await QRScannerService.scanQRCode(imageBlob);

      expect(result).toBeNull();
    });

    it("should throw an error when API call fails", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      const imageBlob = new Blob(["fake image data"], { type: "image/png" });

      await expect(QRScannerService.scanQRCode(imageBlob)).rejects.toThrow(
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
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        blob: jest.fn().mockResolvedValueOnce(mockBlob),
      });

      // create mock video element
      const mockVideoElement = {
        videoWidth: 640,
        videoHeight: 480,
      } as HTMLVideoElement;

      const result = await QRScannerService.captureFrameFromVideo(
        mockVideoElement
      );

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
      expect(global.fetch).toHaveBeenCalledWith(
        "data:image/png;base64,fakedata"
      );
      expect(result).toEqual(mockBlob);
    });
  });

  describe("dataUrlToBlob", () => {
    it("should convert data URL to blob", async () => {
      const mockBlob = new Blob(["fake blob data"], { type: "image/png" });
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        blob: jest.fn().mockResolvedValueOnce(mockBlob),
      });

      const result = await QRScannerService.dataUrlToBlob(
        "data:image/png;base64,fakedata"
      );

      expect(global.fetch).toHaveBeenCalledWith(
        "data:image/png;base64,fakedata"
      );
      expect(result).toEqual(mockBlob);
    });
  });
});
