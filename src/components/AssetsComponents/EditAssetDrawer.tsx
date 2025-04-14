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
import { CalendarIcon, Tag, Hash, MapPin, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { Textarea } from "../ui/textarea";

import {
  useFormState,
  submitAssetForm,
} from "@/hooks/tableHooks/edit-form-hook";
import ElectronicsSearch from "@/components/SearchComponents/ProductsSearch";
import { generateUniqueSerialNumber } from "@/api/electronicProductsAPI";

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
    description?: string;
    productDetails?: any;
    model?: string; // Added optional model field
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
  // initialize the form state
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
    description: asset.description ?? "",
    model: asset.model ?? "", // Added model initialization
  });

  // state for product search dialog
  const [isProductSearchOpen, setIsProductSearchOpen] = React.useState(false);

  const handleProductSelect = (product: {
    id: any;
    title: string;
    category: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      serialNo: generateUniqueSerialNumber(`SN-${product.id}`),
      type: getProductType(product.category),
      customType: product.category,
      model: product.title,
      productDetails: product,
    }));
    setIsProductSearchOpen(false);
  };

  // Helper function to map product categories to asset types
  const getProductType = (category: string) => {
    const categoryMap = {
      computers: "Computer",
      monitor: "Monitor",
      laptops: "Laptop",
      keyboards: "Keyboard",
      mouse: "Mouse",
      server: "Server",
      printer: "Printer",
      peripherals: "Peripheral",
    };

    // Find the best match or default to 'Other'
    return Object.keys(categoryMap).find((key) =>
      category.toLowerCase().includes(key)
    )
      ? categoryMap[category.toLowerCase() as keyof typeof categoryMap]
      : "Other";
  };

  // update state when asset changes
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
      description: asset.description ?? "",
      model: asset.model ?? "",
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
        className="w-full bg-gradient-to-tr from-accent to-card text-foreground max-h-[calc(100vh-100px)] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-foreground">Edit Asset</SheetTitle>
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
              icon={Hash}
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
              icon={Tag}
            />
          </div>
          {/* Asset Type and Model section */}
          <div className="flex gap-4">
            {/* Asset Type */}
            <div className="flex flex-col w-full">
              <Label htmlFor="type" className="mb-1">
                Asset Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={handleSelectChange("type")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer">Computer</SelectItem>
                  <SelectItem value="Laptop">Laptop</SelectItem>
                  <SelectItem value="Monitor">Monitor</SelectItem>
                  <SelectItem value="Server">Server</SelectItem>
                  <SelectItem value="Mouse">Mouse</SelectItem>
                  <SelectItem value="Keyboard">Keyboard</SelectItem>
                  <SelectItem value="Printer">Printer</SelectItem>
                  <SelectItem value="Peripheral">Peripheral</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Model */}
            <div className="flex flex-col w-full">
              <Label htmlFor="model" className="mb-1">
                Model
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="Enter model name"
                  icon={Hash}
                  className="w-full"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setIsProductSearchOpen(true)}
                  title="Search Products"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Product Search Dialog */}
          <ElectronicsSearch
            isOpen={isProductSearchOpen}
            onClose={() => setIsProductSearchOpen(false)}
            onProductSelect={handleProductSelect}
          />

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
              icon={MapPin}
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

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter asset description"
            />
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
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button
                type="button"
                className="bg-teal-950 hover:bg-slate-900 text-teal-100"
              >
                Cancel
              </Button>
            </SheetClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-br from-gray-700 to-teal-400/50 text-teal-100"
            >
              {isSubmitting ? "Updating..." : "Update Asset"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
