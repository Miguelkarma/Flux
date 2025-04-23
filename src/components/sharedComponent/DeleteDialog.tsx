"use client";

import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { FirestoreData } from "@/components/AssetsComponents/columns";
import type { EmployeeData } from "@/components/EmployeeComponents/columns";
import type { ScanRecord } from "@/components/QRComponents/ScanHistory";
import { doc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase/firebase";
import { toast } from "sonner";
import { useState } from "react";

export type ItemType =
  | {
      type: "asset";
      data: FirestoreData;
    }
  | {
      type: "employee";
      data: EmployeeData;
    }
  | {
      type: "scan-history";
      data: ScanRecord;
    };

interface DeleteDialogProps {
  item: ItemType;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onAssetUpdated?: () => void;
  onEmployeeUpdated?: () => void;
  onHistoryUpdated?: () => void;
  isDeleting?: boolean;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  item,
  isOpen,
  setIsOpen,
  onAssetUpdated,
  onEmployeeUpdated,
  onHistoryUpdated,
  isDeleting: externalIsDeleting,
}) => {
  // internal state to manage delete status
  const [internalIsDeleting, setInternalIsDeleting] = useState(false);

  // determine delete status based on external or internal state
  const isDeleting =
    externalIsDeleting !== undefined ? externalIsDeleting : internalIsDeleting;

  // generate title based on item type
  const title =
    item.type === "asset"
      ? `Delete ${item.data.assetTag}?`
      : item.type === "employee"
      ? `Delete ${item.data.firstName} ${item.data.lastName}?`
      : `Delete scan record for ${item.data.serialNum}?`;

  const handleDelete = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("You must be logged in to delete items.");
      return;
    }

    if (item.type === "asset") {
      if (!item.data.id) {
        toast.error("Error: Asset ID is missing");
        return;
      }

      try {
        setInternalIsDeleting(true);
        const assetRef = doc(db, "it-assets", item.data.id);
        await deleteDoc(assetRef);
        toast.success(`${item.data.assetTag || "Asset"} deleted successfully.`);
        setIsOpen(false);
        if (onAssetUpdated) onAssetUpdated(); // refresh after delete
      } catch (error) {
        console.error("Delete error:", error);
        toast.error(
          "Failed to delete asset. Check Firestore rules and authentication."
        );
      } finally {
        setInternalIsDeleting(false);
      }
    } else if (item.type === "employee") {
      if (!item.data.id) {
        toast.error("Error: Employee ID is missing");
        return;
      }

      try {
        setInternalIsDeleting(true);
        const employeeRef = doc(db, "employees", item.data.id);
        await deleteDoc(employeeRef);
        toast.success(
          `${item.data.firstName} ${
            item.data.lastName || "Employee"
          } deleted successfully.`
        );
        setIsOpen(false);
        if (onEmployeeUpdated) onEmployeeUpdated(); // refresh after delete
      } catch (error) {
        console.error("Delete error:", error);
        toast.error(
          "Failed to delete employee. Check Firestore rules and authentication."
        );
      } finally {
        setInternalIsDeleting(false);
      }
    } else if (item.type === "scan-history") {
      if (!item.data.id) {
        toast.error("Error: Scan history ID is missing");
        return;
      }

      try {
        setInternalIsDeleting(true);
        const historyRef = doc(db, "scan-history", item.data.id);
        await deleteDoc(historyRef);
        toast.success(
          `Scan record for ${item.data.serialNum} deleted successfully.`
        );
        setIsOpen(false);
        if (onHistoryUpdated) onHistoryUpdated(); // refresh after delete
      } catch (error) {
        console.error("Delete error:", error);
        toast.error(
          "Failed to delete scan history. Check Firestore rules and authentication."
        );
      } finally {
        setInternalIsDeleting(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this {item.type}? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => setIsOpen(false)}
            variant="outline"
            className="bg-teal-950"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="text-white bg-gradient-to-b from-gray-900 via-red-700 to-red-600 border-0"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
