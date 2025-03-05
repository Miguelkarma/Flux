import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription, // Import DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FirestoreData } from "@/components/AssetsComponents/columns";

interface DeleteAssetDialogProps {
  asset: FirestoreData;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

const DeleteAssetDialog: React.FC<DeleteAssetDialogProps> = ({
  asset,
  isOpen,
  setIsOpen,
  onDelete,
  isDeleting,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {asset.assetName}?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this asset? This action cannot be
            undone.
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
};

export default DeleteAssetDialog;
