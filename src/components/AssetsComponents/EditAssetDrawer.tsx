"use client";

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
import { Toaster } from "sonner";
import {
  useFormState,
  submitAssetForm,
} from "@/hooks/tableHooks/edit-form-hook";

interface EditAssetDrawerProps {
  asset: {
    id: string;
    serialNo: string;
    assetTag: string;
    assignedEmployee: string;
    employeeId?: string;
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
  // Initialize the form state using the useFormState hook
  const {
    formData,
    employees,
    handleEmployeeChange,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
  } = useFormState({
    id: asset.id,
    serialNo: asset.serialNo ?? "",
    assetTag: asset.assetTag ?? "",
    assignedEmployee: asset.assignedEmployee ?? "",
    employeeId: asset.employeeId ?? "",
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
      employeeId: asset.employeeId ?? "",
      status: asset.status ?? "Available",
      type: asset.type ?? "",
      customType: asset.customType ?? "",
      location: asset.location ?? "",
      dateAdded: asset.dateAdded ?? new Date().toISOString(),
    });
  }, [asset, setFormData]);

  const handleAssetDateChange = (date: Date | undefined) => {
    handleDateChange("dateAdded")(date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    submitAssetForm({
      e,
      formData,
      asset,
      setIsSubmitting,
      onAssetUpdated,
      onClose,
    });
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
          {/* Asset Tag */}
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
              onValueChange={handleSelectChange("type")}
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
                onChange={handleInputChange}
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
            <Label htmlFor="employeeId">Assigned Employee</Label>
            <Select
              value={formData.employeeId || "none"}
              onValueChange={handleEmployeeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.employeeId} - {employee.firstName}{" "}
                    {employee.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  onSelect={handleAssetDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={handleSelectChange("status")}
            >
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
