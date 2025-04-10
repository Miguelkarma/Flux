export const QRService = {
  // Existing QR scanner functionality
  async scanQRCode(imageBlob: Blob): Promise<string | null> {
    try {
      const formData = new FormData();
      const file = new File([imageBlob], "qrcode.png", { type: "image/png" });
      formData.append("file", file);

      const response = await fetch(
        "https://api.qrserver.com/v1/read-qr-code/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      const decodedText = data[0]?.symbol[0]?.data;

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
    const response = await fetch(imageDataUrl);
    return await response.blob();
  },

  async dataUrlToBlob(dataUrl: string): Promise<Blob> {
    const response = await fetch(dataUrl);
    return await response.blob();
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
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();

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
      console.error("Failed to download QR code:", error);
      throw new Error("Failed to download QR code");
    }
  },
};
