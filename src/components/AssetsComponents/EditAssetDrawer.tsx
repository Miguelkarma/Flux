import * as React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { toast } from "sonner";

interface EditAssetDrawerProps {
  asset: {
    id: string;
    serialNo: string;
    assetName: string;
    assignedEmployee: string;
    email: string;
    status: string;
    dateAdded: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onAssetUpdated: () => void;
}

export function EditAssetDrawer({
  asset,
  isOpen,
  onClose,
  onAssetUpdated,
}: EditAssetDrawerProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    id: asset.id,
    serialNo: asset.serialNo ?? "",
    assetName: asset.assetName ?? "",
    assignedEmployee: asset.assignedEmployee ?? "",
    email: asset.email ?? "",
    status: asset.status ?? "Available",
    dateAdded: asset.dateAdded ?? new Date().toISOString(),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (
      !formData.serialNo ||
      !formData.assetName ||
      !formData.assignedEmployee ||
      !formData.email
    ) {
      toast.error("All fields are required!");
      setIsSubmitting(false);
      return;
    }

    try {
      const assetRef = doc(db, "it-assets", asset.id);

      await updateDoc(assetRef, {
        ...formData,
        dateUpdated: new Date().toISOString(),
      });

      toast.success("Asset updated successfully!");
      onAssetUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating asset:", error);
      toast.error("Failed to update asset");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="bottom"
          className="w-full bg-gradient-to-br from-black/100 to-teal-300/40 "
        >
          <SheetHeader>
            <SheetTitle>Edit Asset</SheetTitle>
            <SheetDescription>Update the asset details below.</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="serialNo">Serial Number</Label>
              <Input
                id="serialNo"
                name="serialNo"
                value={formData.serialNo}
                onChange={handleInputChange}
                placeholder="Enter serial number"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assetName">Asset Name</Label>
              <Input
                id="assetName"
                name="assetName"
                value={formData.assetName}
                onChange={handleInputChange}
                placeholder="Enter asset name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assignedEmployee">Assigned Employee</Label>
              <Input
                id="assignedEmployee"
                name="assignedEmployee"
                value={formData.assignedEmployee}
                onChange={handleInputChange}
                placeholder="Enter employee name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Employee Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter employee email"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="In Use">In Use</SelectItem>
                  <SelectItem value="Under Repair">Under Repair</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline" className="bg-teal-950">
                  Cancel
                </Button>
              </SheetClose>
              <Button
                className="bg-gradient-to-br from-gray-700 to-teal-400/50"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Asset"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
