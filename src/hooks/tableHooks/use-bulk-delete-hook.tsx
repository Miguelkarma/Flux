"use client";

import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { toast } from "sonner";

// define types for different collections
type CollectionType = "it-assets" | "employees";

interface UseBulkDeleteProps {
  collectionType: CollectionType;
  onDeleteSuccess?: () => void;
}

export function useBulkDelete({
  collectionType,
  onDeleteSuccess,
}: UseBulkDeleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // get collection name based on type
  const getCollectionName = (type: CollectionType): string => {
    switch (type) {
      case "it-assets":
        return "it-assets";
      case "employees":
        return "employees";
      default:
        return type;
    }
  };

  // get message based on the collection
  const getSuccessMessage = (count: number): string => {
    switch (collectionType) {
      case "it-assets":
        return `${count} asset(s) deleted successfully.`;
      case "employees":
        return `${count} employee(s) deleted successfully.`;
      default:
        return `${count} item(s) deleted successfully.`;
    }
  };

  const getErrorMessage = (): string => {
    switch (collectionType) {
      case "it-assets":
        return "Failed to delete assets. Please try again.";
      case "employees":
        return "Failed to delete employees. Please try again.";
      default:
        return "Failed to delete items. Please try again.";
    }
  };

  const openDeleteDialog = (ids: string[]) => {
    setSelectedIds(ids);
    setIsOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsOpen(false);
    // Add this line to reset selectedIds, which was missing in the original implementation
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    setIsDeleting(true);
    try {
      const collectionName = getCollectionName(collectionType);

      // Use map to ensure separate calls to doc and deleteDoc for each ID
      const deletePromises = selectedIds.map((id) => {
        const docRef = doc(db, collectionName, id);
        return deleteDoc(docRef);
      });

      await Promise.all(deletePromises);

      toast.success(getSuccessMessage(selectedIds.length));

      // Call onDeleteSuccess callback if provided
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error(`Error deleting ${collectionType}:`, error);
      toast.error(getErrorMessage());
    } finally {
      // Reset dialog state
      setIsDeleting(false);
      closeDeleteDialog(); // This will reset selectedIds
    }
  };

  // Get item type label for UI
  const getItemTypeLabel = (): string => {
    switch (collectionType) {
      case "it-assets":
        return "asset";
      case "employees":
        return "employee";
      default:
        return "item";
    }
  };

  return {
    isOpen,
    isDeleting,
    selectedIds,
    itemTypeLabel: getItemTypeLabel(),
    openDeleteDialog,
    closeDeleteDialog,
    handleBulkDelete,
  };
}
