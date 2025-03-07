"use client";

import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import DeleteButton from "@/components/ui/deleteButton";

interface BulkDeleteComponentProps {
  selectedRowIds: string[];
  clearSelection: () => void;
}

export function BulkDeleteComponent({
  selectedRowIds,
  clearSelection,
}: BulkDeleteComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await Promise.all(
        selectedRowIds.map((id) => deleteDoc(doc(db, "it-assets", id)))
      );
      clearSelection();
    } catch (error) {
      console.error("Error deleting assets:", error);
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      {selectedRowIds.length > 0 && (
        <div>
          <DeleteButton
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2"
          />
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedRowIds.length} asset(s)?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete these assets? This action cannot
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
              onClick={handleBulkDelete}
              className="text-white bg-gradient-to-b from-gray-900 via-red-700 to-red-600 border-0"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
