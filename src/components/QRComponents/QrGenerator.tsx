import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeInfo, QrCode } from "lucide-react";
import { QRService } from "@/api/qrApi";
import { toast } from "sonner";

interface QRGeneratorProps {
  userId?: string | null;
}

export function QRGenerator({ userId }: QRGeneratorProps) {
  const [serialNum, setSerialNum] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  // generate qr code using service
  const generateQRCode = () => {
    if (!serialNum.trim()) return;

    const qrData = userId ? `${serialNum}|user:${userId}` : serialNum;

    const apiUrl = QRService.generateQRCodeUrl(qrData);
    setQrCodeUrl(apiUrl);
    toast.success("QR code generated successfully!");
  };

  // download qr code using service
  const downloadQRCode = async () => {
    if (!qrCodeUrl) return;

    try {
      await QRService.downloadQRCode(qrCodeUrl, `QR_${serialNum}.png`);
      toast.success("QR code downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download QR code:");
    }
  };

  return (
    <>
      <div className="flex items-center h-full text-card-foreground w-full px-2 sm:px-4">
        <Card className="w-full max-w-6xl mx-auto mt-4 sm:mt-8 bg-[hsl(var(--secondary))] shadow shadow-popover-foreground">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2 sm:gap-3">
              <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
              Generate IT Asset QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-4 sm:space-y-6">
                <Input
                  placeholder="Enter Asset Serial Number"
                  value={serialNum}
                  onChange={(e) => setSerialNum(e.target.value)}
                  icon={BadgeInfo}
                  className="text-sm sm:text-base"
                />
                {/* QR placeholder box */}
                <div className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] aspect-square shadow shadow-popover-foreground rounded flex items-center justify-center mx-auto bg-secondary">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="max-w-full max-h-full"
                    />
                  ) : (
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      QR will appear here
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row justify-center pt-2 gap-2 sm:gap-4">
                  <Button
                    variant="outline"
                    onClick={generateQRCode}
                    className="shadow shadow-popover-foreground w-full bg-transparent text-card-foreground text-sm"
                  >
                    Generate QR Code
                  </Button>
                  <Button
                    variant="outline"
                    onClick={downloadQRCode}
                    className="shadow shadow-popover-foreground w-full bg-transparent text-card-foreground text-sm mt-2 sm:mt-0"
                    disabled={!qrCodeUrl}
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
