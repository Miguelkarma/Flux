import * as React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
import { Plus } from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { Toaster, toast } from "sonner";

import { getAuth } from "firebase/auth";
import { Card } from "../ui/card";

interface AddAssetDrawerProps {
  onAssetAdded: () => void;
  userEmail: string | null;
}

export function AddAssetDrawer({
  onAssetAdded,
  userEmail,
}: AddAssetDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    serialNo: "",
    assetName: "",
    assignedEmployee: "",
    email: "",
    status: "Available",
    dateAdded: new Date().toISOString(),
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  [];

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

    if (!userEmail) {
      toast.error("You must be logged in to add an asset!");
      setIsSubmitting(false);
      return;
    }

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
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        toast.error("User not authenticated!");
        setIsSubmitting(false);
        return;
      }

      await addDoc(collection(db, "it-assets"), {
        ...formData,
        userId: user.uid,
        dateAdded: new Date().toISOString(),
      });

      toast.success("Asset added successfully!");
      onAssetAdded();
      setOpen(false);
      setFormData({
        serialNo: "",
        assetName: "",
        assignedEmployee: "",
        email: "",
        status: "Available",
        dateAdded: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error adding asset:", error);
      toast.error("Failed to add asset");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster
        position="bottom-right"
        duration={3000}
        richColors={true}
        theme="system"
        closeButton={true}
        expand={true}
        visibleToasts={3}
      />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Card className="max-w-lg p-0 flex-grow-1  max-sm:w-12 bg-transparent border-0">
            <Button
              variant="outline"
              className="text-secondary-foreground max-sm:w-4 bg-primary-foreground border-0 shadow-popover-foreground t rounded-lg"
            >
              <span className="max-sm:hidden"> Add</span>{" "}
              <Plus className=" h-4 w-4" />
            </Button>
          </Card>
        </SheetTrigger>

        <SheetContent
          side="bottom"
          className=" w-full  bg-gradient-to-tr from-black/100 to-cyan-800/40 text-foreground"
        >
          <SheetHeader>
            <SheetTitle>Add New Asset</SheetTitle>
            <SheetDescription>
              Fill in the details below to add a new asset.
            </SheetDescription>
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
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
                className="bg-gradient-to-br from-gray-700 to-teal-400/50 text-foreground"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Asset"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
