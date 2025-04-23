"use client";

import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import type { FirestoreData } from "@/components/AssetsComponents/columns";

export function useAssetDetails(userId: string | undefined) {
  const [selectedAsset, setSelectedAsset] = useState<FirestoreData | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssetBySerialNumber = async (serialNum: string) => {
    if (!userId) {
      setError("You must be authenticated to access asset data");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const assetsRef = collection(db, "it-assets");
      const q = query(
        assetsRef,
        where("serialNo", "==", serialNum),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError(
          `No asset found with serial number: ${serialNum} for your account`
        );
        setSelectedAsset(null);
        return null;
      }

      const doc = querySnapshot.docs[0];
      const assetData = { id: doc.id, ...doc.data() } as FirestoreData;

      setSelectedAsset(assetData);
      return assetData;
    } catch (err) {
      console.error("error fetching asset:", err);
      setError("failed to fetch asset data: insufficient permissions");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const viewAssetDetails = async (serialNum: string) => {
    const asset = await fetchAssetBySerialNumber(serialNum);
    if (asset) {
      setIsDialogOpen(true);
    }
    return asset;
  };

  return {
    selectedAsset,
    setSelectedAsset,
    isDialogOpen,
    setIsDialogOpen,
    isLoading,
    error,
    fetchAssetBySerialNumber,
    viewAssetDetails,
  };
}
