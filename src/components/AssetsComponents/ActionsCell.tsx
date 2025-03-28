"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash, Copy, Info } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import DeleteAssetDialog from "@/components/AssetsComponents/DeleteAssetDialog";
import { toast } from "sonner";
import { FirestoreData } from "./columns";
import { db } from "@/firebase/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { EditAssetDrawer } from "@/components/AssetsComponents/EditAssetDrawer";
import { AssetDetailsDialog } from "@/components/MarketComponents/AssetsDetailsDialog";

interface ActionsCellProps {
  asset: FirestoreData;
  onAssetUpdated: () => void;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ asset, onAssetUpdated }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const handleDelete = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("You must be logged in to delete assets.");
      return;
    }

    if (!asset.id) {
      toast.error("Error: Asset ID is missing");
      return;
    }

    try {
      setIsDeleting(true);
      const assetRef = doc(db, "it-assets", asset.id);
      await deleteDoc(assetRef);
      toast.success(`${asset.assetTag || "Asset"} deleted successfully.`);
      setIsDeleteDialogOpen(false);
      onAssetUpdated(); // Refresh data after deleting
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        "Failed to delete asset. Check Firestore rules and authentication."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopySerialNo = async () => {
    try {
      await navigator.clipboard.writeText(asset.serialNo || "N/A");
      toast.success("Asset No. copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy Asset No.");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            aria-label="Open actions menu"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* View Details */}
          <DropdownMenuItem
            onClick={() => setIsDetailsDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Info className="h-4 w-4" />
            <span> Details</span>
          </DropdownMenuItem>

          {/* Open Edit Drawer */}
          <DropdownMenuItem
            onClick={() => setIsEditDrawerOpen(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>

          {/* Delete Asset */}
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center gap-2 text-red-600"
          >
            <Trash className="h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Copy Asset */}
          <DropdownMenuItem
            onClick={handleCopySerialNo}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            <span>Copy Serial No.</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Asset Details Dialog */}
      <AssetDetailsDialog
        asset={asset}
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />

      {/* Render EditAssetDrawer */}
      <EditAssetDrawer
        asset={asset}
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        onAssetUpdated={onAssetUpdated}
      />

      {/* Render Delete Confirmation Dialog */}
      <DeleteAssetDialog
        asset={asset}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default ActionsCell;
