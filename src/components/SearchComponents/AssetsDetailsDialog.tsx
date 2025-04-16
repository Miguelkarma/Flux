import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { FirestoreData } from "@/components/AssetsComponents/columns";
import { Separator } from "@/components/ui/separator";
import { Waypoints, FileText } from "lucide-react";

interface AssetDetailsDialogProps {
  asset: FirestoreData;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssetDetailsDialog({
  asset,
  isOpen,
  onOpenChange,
}: AssetDetailsDialogProps) {
  // Status badge
  const getStatusBadgeClass = (status: string) => {
    const statusColors: Record<string, string> = {
      Active: "shadow-green-500",
      Maintenance: "shadow-orange-400",
      Retired: "shadow-purple-500",
      Available: "shadow-cyan-400",
      Lost: "shadow-red-500",
    };

    return statusColors[status] || "shadow-gray-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full bg-card text-popover-foreground overflow-y-auto max-h-[calc(100vh-100px)]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            Asset Details
            <Badge
              variant="outline"
              className={`ml-2 ${getStatusBadgeClass(
                asset.status
              )} shadow-md text-popover-foreground`}
            >
              {asset.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <div className="w-full h-[20em] max-md:h-[10em] max-sm:h-[7em] border-2 rounded-lg flex justify-center items-center bg-white ">
          {asset.productDetails?.thumbnail ? (
            <img
              src={asset.productDetails.thumbnail}
              alt={asset.productDetails?.title || "Product Image"}
              className="w-full h-full object-contain"
            />
          ) : (
            <Waypoints className="w-16 h-16 text-teal-300 " />
          )}
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Serial Number
                </h3>
                <p className="text-base font-semibold">
                  {asset.serialNo || "N/A"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Asset Tag
                </h3>
                <p className="text-base font-semibold">
                  {asset.assetTag || "N/A"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Type
                </h3>
                <p className="text-base font-semibold">
                  {asset.type}
                  {asset.customType &&
                    asset.type === "Other" &&
                    ` (${asset.customType})`}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional details section */}
          {asset.productDetails && (
            <div className="space-y-3">
              {asset.productDetails.title && (
                <p className="text-base font-semibold">
                  {asset.productDetails.title}
                </p>
              )}
              {asset.productDetails.category && (
                <Badge
                  variant="outline"
                  className={`ml-2 ${getStatusBadgeClass(
                    asset.status
                  )} shadow-md text-popover-foreground`}
                >
                  {asset.type}
                </Badge>
              )}
            </div>
          )}
          {/* Description Section */}
          {(asset.description || asset.productDetails?.description) && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 opacity-70" />
                Description
              </h3>
              <p className="text-sm text-muted-foreground">
                {asset.description || asset.productDetails?.description}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
