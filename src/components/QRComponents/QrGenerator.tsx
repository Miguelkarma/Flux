import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode } from "lucide-react";

interface QRGeneratorProps {
  userId?: string | null;
}

export function QRGenerator({ userId }: QRGeneratorProps) {
  const [serialNum, setSerialNum] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  // generate qr code using goqr.me api
  const generateQRCode = () => {
    if (!serialNum.trim()) return;

    // include user id if available
    const qrData = userId ? `${serialNum}|user:${userId}` : serialNum;

    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      qrData
    )}`;
    setQrCodeUrl(apiUrl);
  };

  // download qr code
  const downloadQRCode = async () => {
    if (!qrCodeUrl) return;

    try {
      const response = await fetch(qrCodeUrl, { mode: "cors" });
      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `QR_${serialNum}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke blob URL to free up memory
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to download QR code:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          Generate IT Asset QR Code
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter Asset Serial Number"
              value={serialNum}
              onChange={(e) => setSerialNum(e.target.value)}
            />
            <Button onClick={generateQRCode} className="w-full">
              Generate QR Code
            </Button>
          </div>

          {qrCodeUrl && (
            <div className="flex flex-col items-center space-y-4">
              <div className="border p-2 inline-block bg-white">
                <img src={qrCodeUrl} alt="QR Code" width="200" height="200" />
              </div>
              <Button variant="outline" onClick={downloadQRCode}>
                Download QR Code
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
