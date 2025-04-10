import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { QRService } from "@/api/qrApi";

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
    const reader = new FileReader();
    reader.onload = (event) => setUploadedImage(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  // process qr code scan from image blob
  const processScan = async (imageBlob: Blob) => {
    try {
      const decodedText = await QRService.scanQRCode(imageBlob);
      if (decodedText) {
        setScanResult(decodedText);
        onScanSuccess(decodedText);
        toast.success("Scan successful");
        setIsCameraDialogOpen(false);
      } else {
        throw new Error("no qr code found");
      }
    } catch (err) {
      setError("Error scanning QR code");
    }
  };

  // setup auto scan interval
  const setupAutoScan = () => {
    if (!autoScanEnabled || !isScanning) return;
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

    scanIntervalRef.current = window.setInterval(() => {
      if (!scanCooldownRef.current && isScanning && videoRef.current) {
        processVideoFrame();
      }
    }, 500);
  };

  // process video frame for qr code detection
  const processVideoFrame = async () => {
    if (!videoRef.current || !isScanning) return;
    scanCooldownRef.current = true;
    try {
      const imageBlob = await QRService.captureFrameFromVideo(videoRef.current);
      await processScan(imageBlob);
    } finally {
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
        lastScannedRef.current = null;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Unable to access camera");
      setIsCameraDialogOpen(false);
    }
  };

  // stop camera
  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsScanning(false);
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
  };

  // manual capture and scan
  const manualCaptureAndScan = async () => {
    if (!videoRef.current || !isScanning) return;
    setIsLoading(true);
    setError(null);
    try {
      const imageBlob = await QRService.captureFrameFromVideo(videoRef.current);
      await processScan(imageBlob);
      stopCamera();
      setIsCameraDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  // scan uploaded image
  const scanUploadedImage = async () => {
    if (!uploadedImage) return;
    setIsLoading(true);
    setError(null);
    try {
      const imageBlob = await QRService.dataUrlToBlob(uploadedImage);
      await processScan(imageBlob);
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
    toast.success("Scan Reset");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // setup auto scanning when camera is started
  useEffect(() => {
    if (isScanning && autoScanEnabled) setupAutoScan();
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, [isScanning, autoScanEnabled]);

  // cleanup camera on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, []);

  // handle closing dialog
  useEffect(() => {
    if (!isCameraDialogOpen) stopCamera();
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
