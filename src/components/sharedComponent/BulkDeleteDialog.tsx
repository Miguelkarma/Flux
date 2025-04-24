"use client";

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

interface BulkDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
  selectedCount: number;
  itemType: string;
}

export function BulkDeleteDialog({
  isOpen,
  onOpenChange,
  onDelete,
  isDeleting,
  selectedCount,
  itemType,
}: BulkDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-secondary">
        <DialogHeader>
          <DialogTitle>
            Delete {selectedCount} {itemType}(s)?
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete these {itemType}s? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="bg-teal-950"
          >
            Cancel
          </Button>
          <Button
            onClick={onDelete}
            className="text-white bg-gradient-to-b from-gray-900 via-red-700 to-red-600 border-0"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function BulkDeleteTrigger({
  selectedCount,
  onClick,
  className,
}: {
  selectedCount: number;
  onClick: () => void;
  className?: string;
}) {
  if (selectedCount === 0) return null;

  return (
    <DeleteButton
      onClick={onClick}
      className={className || "flex items-center gap-2"}
    />
  );
}
