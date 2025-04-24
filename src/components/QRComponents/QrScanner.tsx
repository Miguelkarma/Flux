"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Camera, Loader2 } from "lucide-react";
import { AssetDetailsDialog } from "@/components/SearchComponents/AssetsDetailsDialog";
import { useAssetDetails } from "@/hooks/use-asset-details";
import { useQRScanner } from "@/hooks/use-qr-scanner";
import { useScanHistory } from "@/hooks/use-qr-history";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface QRScannerProps {
  user: any;
  userId: string | undefined;
  onScanComplete?: (serialNo: string) => void;
}

export function QRScanner({ userId, onScanComplete }: QRScannerProps) {
  const {
    selectedAsset,
    isDialogOpen,
    setIsDialogOpen,
    fetchAssetBySerialNumber,
  } = useAssetDetails(userId);

  const { saveScanHistory } = useScanHistory(userId);

  const handleScanSuccess = async (rawScanResult: string) => {
    try {
      const serialNumber = rawScanResult.split("|")[0];
      const asset = await fetchAssetBySerialNumber(serialNumber);

      if (asset) {
        setIsDialogOpen(true);
      }

      try {
        await saveScanHistory(serialNumber, asset !== null);
      } catch (historyError) {
        console.error("Failed to save history (non-critical):", historyError);
      }

      onScanComplete?.(serialNumber);
    } catch (error) {
      console.error("Error handling scan success:", error);
    }
  };

  const {
    uploadedImage,
    isCameraDialogOpen,
    setIsCameraDialogOpen,
    isScanning,
    scanResult,
    isLoading,
    fileInputRef,
    videoRef,
    handleFileUpload,
    startCamera,
    stopCamera,
    resetScan,
    manualScan,
  } = useQRScanner({ onScanSuccess: handleScanSuccess });

  const handleOpenCameraDialog = () => {
    setIsCameraDialogOpen(true);
    startCamera();
  };

  const handleCloseCameraDialog = () => {
    stopCamera();
    setIsCameraDialogOpen(false);
  };

  return (
    <>
      <div className="flex items-center mt-4 lg:mt-8 my-auto text-card-foreground w-full px-2 sm:px-4">
        <Card className="w-full max-w-6xl h-full mx-auto shadow shadow-popover-foreground bg-[hsl(var(--secondary))]">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              Scan IT Asset QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-1/2 flex gap-2 shadow shadow-popover-foreground bg-transparent text-card-foreground text-sm"
                  disabled={isLoading}
                  variant="outline"
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
                  variant="outline"
                  onClick={handleOpenCameraDialog}
                  className="w-full sm:w-1/2 flex gap-2 shadow shadow-popover-foreground bg-transparent text-card-foreground text-sm mt-2 sm:mt-0"
                  disabled={isLoading}
                >
                  <Camera className="w-4 h-4" />
                  Use Camera
                </Button>
              </div>

              {uploadedImage ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-full max-w-[300px] aspect-square shadow shadow-popover-foreground rounded flex items-center justify-center mx-auto bg-secondary">
                    <img
                      src={uploadedImage}
                      alt="QR code"
                      className="rounded-md max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-full max-w-[300px] aspect-square shadow shadow-popover-foreground rounded flex items-center justify-center mx-auto bg-secondary">
                    {/* placeholder content */}
                    <span className="text-gray-400">Qr Code</span>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="flex justify-center p-2 sm:p-4">
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                </div>
              )}

              <div className="space-y-3 sm:space-y-4">
                {scanResult && (
                  <div className="p-2 rounded-md bg-secondary text-center text-sm sm:text-base">
                    <p className="break-words">{scanResult}</p>
                  </div>
                )}
                <Button
                  variant="outline"
                  onClick={resetScan}
                  className="w-full shadow shadow-popover-foreground bg-transparent text-card-foreground text-sm"
                >
                  Reset Scan
                </Button>
                <Button
                  variant="outline"
                  className="w-full shadow shadow-popover-foreground bg-transparent text-card-foreground text-sm"
                  onClick={manualScan}
                  disabled={isLoading || (!uploadedImage && !isScanning)}
                >
                  Scan QR Code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* camera feed Dialog */}
        <Dialog
          open={isCameraDialogOpen}
          onOpenChange={handleCloseCameraDialog}
        >
          <DialogContent className="w-full max-w-full sm:max-w-4xl bg-secondary m-0 p-4 sm:p-6 h-full sm:h-auto rounded-none sm:rounded-lg">
            <DialogHeader>
              <DialogTitle>Scan QR Code</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 h-full">
              <div className="rounded-md overflow-hidden h-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button
                variant="outline"
                onClick={handleCloseCameraDialog}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {selectedAsset && (
          <AssetDetailsDialog
            asset={selectedAsset}
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          />
        )}
      </div>
    </>
  );
}
