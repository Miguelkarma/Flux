import * as React from "react";
import { getAuth } from "firebase/auth";
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
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { toast, Toaster } from "sonner";
import {
  Laptop2,
  Monitor,
  Mouse,
  Keyboard,
  Printer,
  Server,
  CalendarIcon,
  Computer,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";

interface EditAssetDrawerProps {
  asset: {
    id: string;
    serialNo: string;
    assetTag: string;
    assignedEmployee: string;
    email: string;
    status: string;
    dateAdded: string;
    type: string;
    customType?: string;
    location: string;
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
    assetTag: asset.assetTag ?? "",
    assignedEmployee: asset.assignedEmployee ?? "",
    email: asset.email ?? "",
    status: asset.status ?? "Available",
    type: asset.type ?? "",
    customType: asset.customType ?? "",
    location: asset.location ?? "",
    dateAdded: asset.dateAdded ?? new Date().toISOString(),
  });

  // Update state when asset changes
  React.useEffect(() => {
    setFormData({
      id: asset.id,
      serialNo: asset.serialNo ?? "",
      assetTag: asset.assetTag ?? "",
      assignedEmployee: asset.assignedEmployee ?? "",
      email: asset.email ?? "",
      status: asset.status ?? "Available",
      type: asset.type ?? "",
      customType: asset.customType ?? "",
      location: asset.location ?? "",
      dateAdded: asset.dateAdded ?? new Date().toISOString(),
    });
  }, [asset]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleCustomTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      customType: e.target.value,
    }));
  };

  // Add the missing handleDateChange function
  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      dateAdded: date ? date.toISOString() : new Date().toISOString(),
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

    const auth = getAuth();
    const user = auth.currentUser;
    const userEmail = user?.email; // Get logged-in user's email

    if (!userEmail) {
      toast.error("You must be logged in to update an asset!");
      setIsSubmitting(false);
      return;
    }

    if (!formData.serialNo || !formData.type) {
      toast.error("Serial number and asset type are required!");
      setIsSubmitting(false);
      return;
    }

    try {
      const assetsRef = collection(db, "it-assets");
      const serialQuery = query(
        assetsRef,
        where("serialNo", "==", formData.serialNo),
        where("userId", "==", user.uid),
        where("__name__", "!=", asset.id)
      );
      const serialSnapshot = await getDocs(serialQuery);

      // Check for duplicate asset tag (if asset tag is provided)
      let tagSnapshot = { empty: true };
      if (formData.assetTag) {
        const tagQuery = query(
          assetsRef,
          where("assetTag", "==", formData.assetTag),
          where("userId", "==", user.uid),
          where("__name__", "!=", asset.id)
        );
        tagSnapshot = await getDocs(tagQuery);
      }

      if (!serialSnapshot.empty) {
        toast.error("Asset with this Serial Number already exists!");
        setIsSubmitting(false);
        return;
      }

      if (!tagSnapshot.empty) {
        toast.error("Asset with this Asset Tag already exists!");
        setIsSubmitting(false);
        return;
      }

      if (formData.type === "Other" && !formData.customType) {
        toast.error("Custom type is required when 'Other' is selected!");
        setIsSubmitting(false);
        return;
      }
      const assetRef = doc(db, "it-assets", asset.id);
      await updateDoc(assetRef, {
        ...formData,
        dateUpdated: new Date().toISOString(),
        updatedBy: userEmail, // Track who updated the asset
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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="w-full bg-gradient-to-tr from-accent to-card text-popover-foreground"
      >
        <Toaster
          position="top-right"
          duration={3000}
          richColors={true}
          theme="system"
          closeButton={true}
          expand={true}
          visibleToasts={3}
          style={{ zIndex: 9999 }}
        />
        <SheetHeader>
          <SheetTitle>Edit Asset</SheetTitle>
          <SheetDescription>Update the asset details below.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          {/* Serial Number */}
          <div className="grid gap-2">
            <Label htmlFor="serialNo">Serial Number</Label>
            <Input
              id="serialNo"
              name="serialNo"
              value={formData.serialNo}
              onChange={handleInputChange}
              placeholder="Enter serial number"
            />
          </div>
          {/* Asset Name */}
          <div className="grid gap-2">
            <Label htmlFor="assetTag">Asset Tag</Label>
            <Input
              id="assetTag"
              name="assetTag"
              value={formData.assetTag}
              onChange={handleInputChange}
              placeholder="Enter asset Tag"
              required
            />
          </div>
          {/* Type */}
          <div className="grid gap-2">
            <Label htmlFor="type">Asset Type</Label>
            <Select
              value={formData.type}
              onValueChange={handleTypeChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Laptop">
                  <Laptop2 className="inline-block w-4 h-4 mr-2" /> Laptop
                </SelectItem>
                <SelectItem value="Computer">
                  <Computer className="inline-block w-4 h-4 mr-2" /> Computer
                </SelectItem>
                <SelectItem value="Server">
                  <Server className="inline-block w-4 h-4 mr-2" /> Server
                </SelectItem>
                <SelectItem value="Monitor">
                  <Monitor className="inline-block w-4 h-4 mr-2" /> Monitor
                </SelectItem>
                <SelectItem value="Keyboard">
                  <Keyboard className="inline-block w-4 h-4 mr-2" /> Keyboard
                </SelectItem>
                <SelectItem value="Mouse">
                  <Mouse className="inline-block w-4 h-4 mr-2" /> Mouse
                </SelectItem>
                <SelectItem value="Printer">
                  <Printer className="inline-block w-4 h-4 mr-2" /> Printer
                </SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.type === "Other" && (
            <div className="grid gap-2">
              <Label htmlFor="customType">Other Asset *</Label>
              <Input
                id="customType"
                name="customType"
                value={formData.customType}
                onChange={handleCustomTypeChange}
                placeholder="Enter custom asset type"
                required
              />
            </div>
          )}
          {/* Location */}
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter asset location"
            />
          </div>
          {/* Assigned Employee */}
          <div className="grid gap-2">
            <Label htmlFor="assignedEmployee">Assigned Employee</Label>
            <Input
              id="assignedEmployee"
              name="assignedEmployee"
              value={formData.assignedEmployee}
              onChange={handleInputChange}
              placeholder="Enter employee name"
            />
          </div>
          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Employee Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter employee email"
            />
          </div>
          {/* Date Added */}
          <div className="grid gap-2">
            <Label htmlFor="dateAdded">Date Added</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-left"
                >
                  {formData.dateAdded
                    ? format(new Date(formData.dateAdded), "PPP")
                    : "Select a date"}
                  <CalendarIcon className="w-4 h-4 opacity-70" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-full p-2">
                <Calendar
                  mode="single"
                  selected={new Date(formData.dateAdded)}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Retired">Retired</SelectItem>
                <SelectItem value="Lost/Stolen">Lost/Stolen</SelectItem>
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
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-br from-gray-700 to-teal-400/50 text-foreground"
            >
              {isSubmitting ? "Updating..." : "Update Asset"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
