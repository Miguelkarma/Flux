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
import { toast } from "sonner";
import { FirestoreData } from "./columns";

import { EditAssetDrawer } from "@/components/AssetsComponents/EditAssetDrawer";
import { AssetDetailsDialog } from "@/components/SearchComponents/AssetsDetailsDialog";
import DeleteDialog from "@/components/sharedComponent/DeleteDialog";

interface ActionsCellProps {
  asset: FirestoreData;
  onAssetUpdated: () => void;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ asset, onAssetUpdated }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const handleCopySerialNo = async () => {
    try {
      await navigator.clipboard.writeText(asset.serialNo || "N/A");
      toast.success("Serial No. copied to clipboard");
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
            className="h-8 w-8 p-0 text-foreground"
            aria-label="Open actions menu"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 text-foreground">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* View Details */}
          <DropdownMenuItem
            onClick={() => setIsDetailsDialogOpen(true)}
            className="flex items-center gap-2 text-foreground"
          >
            <Info className="h-4 w-4" />
            <span> Details</span>
          </DropdownMenuItem>

          {/* Open Edit Drawer */}
          <DropdownMenuItem
            onClick={() => setIsEditDrawerOpen(true)}
            className="flex items-center gap-2 text-foreground"
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
            className="flex items-center gap-2 text-foreground"
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
      <DeleteDialog
        item={{ type: "asset", data: asset }}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onAssetUpdated={onAssetUpdated}
      />
    </>
  );
};

export default ActionsCell;
