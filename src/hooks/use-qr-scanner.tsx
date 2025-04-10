import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { QRScannerService } from "@/api/qrApi";

interface UseQRScannerOptions {
  onScanSuccess: (result: string) => void;
}

export function useQRScanner({ onScanSuccess }: UseQRScannerOptions) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraDialogOpen, setIsCameraDialogOpen] = useState<boolean>(false);
  const [autoScanEnabled, setAutoScanEnabled] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);
  const lastScannedRef = useRef<string | null>(null);
  const scanCooldownRef = useRef<boolean>(false);

  // handle file upload for qr scanning
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // display uploaded image
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // setup auto scan interval
  const setupAutoScan = () => {
    if (!autoScanEnabled || !isScanning) return;

    // clear any existing interval
    if (scanIntervalRef.current) {
      window.clearInterval(scanIntervalRef.current);
    }

    // set up new scan interval (every 100ms)
    scanIntervalRef.current = window.setInterval(() => {
      if (!scanCooldownRef.current && isScanning && videoRef.current) {
        processVideoFrame();
      }
    }, 100);
  };

  // process video frame for qr code detection
  const processVideoFrame = async () => {
    if (!videoRef.current || !isScanning) return;

    // set cooldown to avoid multiple scans
    scanCooldownRef.current = true;

    try {
      // capture frame from video
      const imageBlob = await QRScannerService.captureFrameFromVideo(
        videoRef.current
      );

      // scan the captured frame
      const decodedText = await QRScannerService.scanQRCode(imageBlob);

      if (decodedText && decodedText !== lastScannedRef.current) {
        lastScannedRef.current = decodedText;
        setScanResult(decodedText);
        stopCamera();
        setIsCameraDialogOpen(false);
        onScanSuccess(decodedText);
      }
    } catch (error) {
      console.error("error in auto scan:", error);
    } finally {
      // release cooldown after 1 second
      setTimeout(() => {
        scanCooldownRef.current = false;
      }, 500);
    }
  };

  // start camera for scanning
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);

        // reset last scanned result when starting camera
        lastScannedRef.current = null;
      }
    } catch (error) {
      console.error("error accessing camera:", error);
      toast.error("unable to access camera");
      setIsCameraDialogOpen(false);
    }
  };

  // stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsScanning(false);

      // clear auto scan interval
      if (scanIntervalRef.current) {
        window.clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
    }
  };

  // manual capture frame and scan
  const manualCaptureAndScan = async () => {
    if (!videoRef.current || !isScanning) return;

    try {
      setIsLoading(true);
      setError(null);

      // capture frame from video
      const imageBlob = await QRScannerService.captureFrameFromVideo(
        videoRef.current
      );

      // scan the captured frame
      const decodedText = await QRScannerService.scanQRCode(imageBlob);

      if (decodedText) {
        setScanResult(decodedText);
        stopCamera();
        setIsCameraDialogOpen(false);
        onScanSuccess(decodedText);
      } else {
        setError("no qr code found");
        toast.error("no qr code found in the image");
      }
    } catch (error) {
      console.error("error scanning qr code:", error);
      setError("error scanning qr code");
      toast.error("error scanning qr code");
    } finally {
      setIsLoading(false);
    }
  };

  // scan uploaded image
  const scanUploadedImage = async () => {
    if (!uploadedImage) return;

    try {
      setIsLoading(true);
      setError(null);

      // convert data url to blob
      const imageBlob = await QRScannerService.dataUrlToBlob(uploadedImage);

      // scan the image
      const decodedText = await QRScannerService.scanQRCode(imageBlob);

      if (decodedText) {
        setScanResult(decodedText);
        onScanSuccess(decodedText);
      } else {
        setError("no qr code found in the image");
        toast.error("no qr code found in the image");
      }
    } catch (error) {
      console.error("error scanning uploaded image:", error);
      setError("error scanning qr code");
      toast.error("error scanning qr code");
    } finally {
      setIsLoading(false);
    }
  };

  // trigger appropriate scan method based on current state
  const manualScan = async () => {
    if (uploadedImage) {
      await scanUploadedImage();
    } else if (isScanning) {
      await manualCaptureAndScan();
    }
  };

  // reset scan state
  const resetScan = () => {
    setScanResult(null);
    setUploadedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // setup auto scanning when camera is started
  useEffect(() => {
    if (isScanning && autoScanEnabled) {
      setupAutoScan();
    }

    return () => {
      if (scanIntervalRef.current) {
        window.clearInterval(scanIntervalRef.current);
      }
    };
  }, [isScanning, autoScanEnabled]);

  // cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (scanIntervalRef.current) {
        window.clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  // handle closing dialog
  useEffect(() => {
    if (!isCameraDialogOpen) {
      stopCamera();
    }
  }, [isCameraDialogOpen]);

  return {
    uploadedImage,
    isScanning,
    scanResult,
    isLoading,
    error,
    isCameraDialogOpen,
    setIsCameraDialogOpen,
    autoScanEnabled,
    setAutoScanEnabled,
    fileInputRef,
    videoRef,
    handleFileUpload,
    startCamera,
    stopCamera,
    manualCaptureAndScan,
    resetScan,
    manualScan,
  };
}
