export const QRScannerService = {
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
};
