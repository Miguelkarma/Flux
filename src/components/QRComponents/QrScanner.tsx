"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Camera, Loader2 } from "lucide-react";
import { AssetDetailsDialog } from "@/components/SearchComponents/AssetsDetailsDialog";
import { useAssetDetails } from "@/hooks/use-asset-details";
import { useQRScanner } from "@/hooks/use-qr-scanner";
import { useScanHistory } from "@/hooks/use-qr-history";

interface QRScannerProps {
  user: any;
  userId: string | undefined;
  onScanComplete?: (serialNumber: string) => void;
}

export function QRScanner({ userId, onScanComplete }: QRScannerProps) {
  const {
    selectedAsset,
    isDialogOpen,
    setIsDialogOpen,
    fetchAssetBySerialNumber,
  } = useAssetDetails(userId);

  const { saveScanHistory } = useScanHistory(userId);

  const handleScanSuccess = async (serialNumber: string) => {
    try {
      const asset = await fetchAssetBySerialNumber(serialNumber);
      if (asset) {
        setIsDialogOpen(true);
      }

      try {
        await saveScanHistory(serialNumber, asset !== null);
      } catch (historyError) {
        console.error("Failed to save history (non-critical):", historyError);
        // Continue even if history fails
      }

      if (onScanComplete) onScanComplete(serialNumber);
    } catch (error) {
      console.error("Error handling scan success:", error);
    }
  };

  const {
    uploadedImage,
    isScanning,
    scanResult,
    isLoading,
    error,
    fileInputRef,
    videoRef,
    handleFileUpload,
    startCamera,
    stopCamera,
    captureFrame,
    resetScan,
  } = useQRScanner({ onScanSuccess: handleScanSuccess });

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Scan IT Asset QR Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-1/2 flex gap-2"
                disabled={isLoading}
              >
                <Upload className="w-4 h-4" />
                Upload QR Code
              </Button>
              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />

              <Button
                onClick={isScanning ? stopCamera : startCamera}
                className={`w-1/2 flex gap-2 ${
                  isScanning ? "bg-red-500 hover:bg-red-600" : ""
                }`}
                disabled={isLoading}
              >
                <Camera className="w-4 h-4" />
                {isScanning ? "Stop Camera" : "Use Camera"}
              </Button>
            </div>

            {isScanning && (
              <div className="space-y-2">
                <div className="border rounded-md overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover"
                  />
                </div>
                <Button
                  onClick={captureFrame}
                  className="w-full"
                  disabled={isLoading}
                >
                  Capture and Scan
                </Button>
              </div>
            )}

            {uploadedImage && (
              <div className="flex flex-col items-center space-y-2">
                <div className="border p-2 inline-block bg-white">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded QR Code"
                    width="200"
                    height="200"
                  />
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-center p-4">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            )}

            {error && (
              <div className="p-3 border border-red-200 bg-red-50 rounded-md text-red-700">
                {error}
              </div>
            )}

            {scanResult && (
              <div className="space-y-2">
                <div className="p-4 border rounded-md bg-muted">
                  <p className="font-medium">Scan Result:</p>
                  <p>{scanResult}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={resetScan}
                  className="w-full"
                >
                  Reset Scan
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedAsset && (
        <AssetDetailsDialog
          asset={selectedAsset}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </>
  );
}
