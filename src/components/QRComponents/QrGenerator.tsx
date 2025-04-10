import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeInfo, QrCode } from "lucide-react";

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

    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
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
    <>
      <div className="flex items-center h-full text-card-foreground ">
        <Card className="w-full max-w-6xl mx-auto mt-8 bg-card shadow shadow-popover-foreground ">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-3 ">
              <QrCode className="w-5 h-5" />
              Generate IT Asset QR Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-6">
                <Input
                  placeholder="Enter Asset Serial Number"
                  value={serialNum}
                  onChange={(e) => setSerialNum(e.target.value)}
                  icon={BadgeInfo}
                />
                {/* QR Placeholder Box */}
                <div className="w-[400px] h-[400px] shadow shadow-popover-foreground rounded flex items-center justify-center mx-auto bg-secondary">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      width="400"
                      height="400"
                    />
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      QR will appear here
                    </span>
                  )}
                </div>
                <div className="flex justify-center pt-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={generateQRCode}
                    className="shadow shadow-popover-foreground w-full bg-transparent text-card-foreground"
                  >
                    Generate QR Code
                  </Button>
                  <Button
                    variant="outline"
                    onClick={downloadQRCode}
                    className="shadow shadow-popover-foreground w-full bg-transparent text-card-foreground"
                  >
                    Download QR Code
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
