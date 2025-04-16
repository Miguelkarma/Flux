import axios from "axios";
import { toast } from "sonner";

export const QRService = {
  // Existing QR scanner functionality
  async scanQRCode(imageBlob: Blob): Promise<string | null> {
    try {
      const formData = new FormData();
      const file = new File([imageBlob], "qrcode.png", { type: "image/png" });
      formData.append("file", file);

      const response = await axios.post(
        "https://api.qrserver.com/v1/read-qr-code/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const decodedText = response.data[0]?.symbol[0]?.data;

      return decodedText || null;
    } catch (error) {
      console.error("QR scanning service error:", error);
      throw new Error("Failed to scan QR code");
    }
  },

  async captureFrameFromVideo(videoElement: HTMLVideoElement): Promise<Blob> {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    context?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/png");
    const response = await axios.get(imageDataUrl, { responseType: "blob" });
    return response.data;
  },

  async dataUrlToBlob(dataUrl: string): Promise<Blob> {
    const response = await axios.get(dataUrl, { responseType: "blob" });
    return response.data;
  },

  // qr generator function
  generateQRCodeUrl(data: string, size: number = 400): string {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
      data
    )}`;
  },

  async downloadQRCode(url: string, filename: string): Promise<void> {
    if (!url) return;

    try {
      const response = await axios.get(url, { responseType: "blob" });
      const blob = response.data;

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // revoke blob URL to free up memory
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error("Failed to download QR code:");
      throw new Error("Failed to download QR code");
    }
  },
};
