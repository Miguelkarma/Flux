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

import { Card } from "../ui/card";
import {
  Laptop,
  Server,
  Monitor,
  Keyboard,
  Mouse,
  Printer,
  Computer,
} from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
    assetTag: "",
    assignedEmployee: "",
    email: "",
    status: "Available",
    type: "",
    customType: "",
    location: "",
    dateAdded: new Date().toISOString(),
  });

  const handleDateChange = (selectedDate: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      dateAdded: selectedDate
        ? selectedDate.toISOString()
        : new Date().toISOString(),
    }));
  };
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
      customType: value === "Other" ? "" : prev.customType,
    }));
  };

  const handleCustomTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      customType: e.target.value,
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

    if (!user) {
      toast.error("You must be logged in to add an asset!");
      setIsSubmitting(false);
      return;
    }

    if (!userEmail) {
      toast.error("You must be logged in to add an asset!");
      setIsSubmitting(false);
      return;
    }

    if (!formData.serialNo || !formData.type) {
      toast.error("Serial number and asset type are required!");
      setIsSubmitting(false);
      return;
    }

    if (formData.type === "Other" && !formData.customType) {
      toast.error("Custom type is required when 'Other' is selected!");
      setIsSubmitting(false);
      return;
    }

    try {
      const assetsRef = collection(db, "it-assets");
      const serialQuery = query(
        assetsRef,
        where("serialNo", "==", formData.serialNo),
        where("userId", "==", user.uid)
      );
      const serialSnapshot = await getDocs(serialQuery);

      // Check for duplicate asset tag (if asset tag is provided)
      let tagSnapshot = { empty: true };
      if (formData.assetTag) {
        const tagQuery = query(
          assetsRef,
          where("assetTag", "==", formData.assetTag),
          where("userId", "==", user.uid)
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
      await addDoc(collection(db, "it-assets"), {
        ...formData,
        type: formData.type === "Other" ? formData.customType : formData.type,
        userId: user.uid,
        dateAdded: new Date().toISOString(),
      });

      toast.success("Asset added successfully!");
      onAssetAdded();
      setOpen(false);
      setFormData({
        serialNo: "",
        assetTag: "",
        assignedEmployee: "",
        email: "",
        status: "Available",
        type: "",
        customType: "",
        location: "",
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
        position="top-right"
        duration={3000}
        richColors={true}
        theme="system"
        closeButton={true}
        expand={true}
        visibleToasts={3}
        style={{ zIndex: 9999 }}
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Card className="max-w-lg p-0 flex-grow-1  max-sm:w-12 bg-transparent border-0">
            <Button
              variant="outline"
              className="text-secondary-foreground max-sm:w-4 bg-primary-foreground border-0 shadow-popover-foreground rounded-lg"
            >
              <span className="max-sm:hidden"> Add</span>{" "}
              <Plus className=" h-4 w-4" />
            </Button>
          </Card>
        </SheetTrigger>

        <SheetContent
          side="bottom"
          className=" w-full bg-gradient-to-tr from-accent to-card text-popover-foreground"
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
            <SheetTitle className="text-popover-foreground">
              Add New Asset
            </SheetTitle>
            <SheetDescription className="text-primary">
              Fill in the details below to add a new asset. Only Serial Number
              is required.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="serialNo">Serial Number *</Label>
              <Input
                id="serialNo"
                name="serialNo"
                value={formData.serialNo}
                onChange={handleInputChange}
                placeholder="Enter serial number"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assetTag">Asset Tag</Label>
              <Input
                id="assetTag"
                name="assetTag"
                value={formData.assetTag}
                onChange={handleInputChange}
                placeholder="Enter asset Tag"
              />
            </div>
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
                    <Laptop className="inline-block w-4 h-4 mr-2" /> Laptop
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
                  <SelectItem value="Other">
                    <Laptop className="inline-block w-4 h-4 mr-2" /> Other
                  </SelectItem>
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

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter location (e.g., IT Department, Accounting)"
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
              />
            </div>
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
                  <SelectItem value="Lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" className="bg-teal-950 text-foreground">
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
