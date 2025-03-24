"use client";

import * as React from "react";
import { format } from "date-fns";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Toaster } from "sonner";

// Icons
import {
  Plus,
  Calendar as CalendarIcon,
  Laptop,
  Server,
  Monitor,
  Keyboard,
  Mouse,
  Printer,
  Computer,
} from "lucide-react";

// Form handling
import { useForm, submitAddAssetForm } from "@/hooks/tableHooks/add-form-hook";

// Types
interface Asset {
  serialNo: string;
  assetTag: string;
  assignedEmployee: string;
  employeeId: string;
  email: string;
  status: string;
  type: string;
  customType: string;
  location: string;
  dateAdded: string;
}

interface AddAssetDrawerProps {
  onAssetAdded: () => void;
  userEmail: string | null;
}

export function AddAssetDrawer({ onAssetAdded }: AddAssetDrawerProps) {
  // Initial form values
  const initialValues: Asset = {
    serialNo: "",
    assetTag: "",
    assignedEmployee: "",
    employeeId: "",
    email: "",
    status: "Available",
    type: "",
    customType: "",
    location: "",
    dateAdded: new Date().toISOString(),
  };

  // Form state and handlers from custom hook
  const {
    formData,
    isSubmitting,
    setIsSubmitting,
    open,
    setOpen,
    employees,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
    handleTypeChange,
    handleEmployeeChange,
    resetForm,
  } = useForm<Asset>(initialValues);

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    submitAddAssetForm({
      e,
      formData,
      setIsSubmitting,
      onAssetAdded,
      onClose: () => setOpen(false),
      resetForm,
    });
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
        {/* Trigger button */}
        <SheetTrigger asChild>
          <Card className="max-w-lg p-0 flex-grow-1 max-sm:w-12 bg-transparent border-0">
            <Button
              variant="outline"
              className="text-secondary-foreground max-sm:w-4 bg-primary-foreground border-0 shadow-popover-foreground rounded-lg mr-1"
            >
              <span className="max-sm:hidden">Add</span>
              <Plus className="h-4 w-4" />
            </Button>
          </Card>
        </SheetTrigger>

        {/* Drawer content */}
        <SheetContent
          side="bottom"
          className="w-full bg-gradient-to-tr from-accent to-card text-popover-foreground"
        >
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
            {/* Serial Number */}
            <div className="grid gap-2">
              <Label htmlFor="serialNo">Serial Number *</Label>
              <Input
                id="serialNo"
                name="serialNo"
                value={formData.serialNo}
                onChange={handleInputChange}
                placeholder="Enter serial number"
                required
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
              />
            </div>

            {/* Asset Type */}
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

            {/* Custom Type (conditionally rendered) */}
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
                placeholder="Enter location (e.g., IT Department, Accounting)"
              />
            </div>

            {/* Assigned Employee */}
            <div className="grid gap-2">
              <Label htmlFor="employeeId">Assigned Employee</Label>
              <Select onValueChange={handleEmployeeChange}>
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
                    onSelect={handleDateChange("dateAdded")}
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

            {/* Action buttons */}
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
