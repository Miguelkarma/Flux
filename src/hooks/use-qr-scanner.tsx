"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";

interface UseQRScannerOptions {
  onScanSuccess: (result: string) => void;
}

export function useQRScanner({ onScanSuccess }: UseQRScannerOptions) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

    // send to qr decoding api
    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        "https://api.qrserver.com/v1/read-qr-code/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      const decodedText = data[0]?.symbol[0]?.data;

      if (decodedText) {
        setScanResult(decodedText);
        onScanSuccess(decodedText);
      } else {
        setScanResult("no qr code found in the image");
        setError("no qr code found in the image");
      }
    } catch (error) {
      console.error("error scanning qr code:", error);
      setScanResult("error scanning qr code");
      setError("error scanning qr code");
    } finally {
      setIsLoading(false);
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
      }
    } catch (error) {
      console.error("error accessing camera:", error);
      setError("unable to access camera");
    }
  };

  // stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsScanning(false);
    }
  };

  // capture frame and scan for qr
  const captureFrame = async () => {
    if (!videoRef.current || !isScanning) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/png");

    // convert to blob and send to api
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();
    const file = new File([blob], "qrcode.png", { type: "image/png" });

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        "https://api.qrserver.com/v1/read-qr-code/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      const decodedText = data[0]?.symbol[0]?.data;

      if (decodedText) {
        setScanResult(decodedText);
        stopCamera();
        onScanSuccess(decodedText);
      } else {
        setError("no qr code found");
      }
    } catch (error) {
      console.error("error scanning qr code:", error);
      setError("error scanning qr code");
    } finally {
      setIsLoading(false);
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

  // cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
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
  };
}
