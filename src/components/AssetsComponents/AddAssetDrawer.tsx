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

// icons
import {
  Plus,
  Calendar as CalendarIcon,
  Search,
  Tag,
  Hash,
  MapPin,
} from "lucide-react";

// form handling
import { useForm, submitAddAssetForm } from "@/hooks/tableHooks/add-form-hook";
import { ElectronicsSearch } from "@/components/SearchComponents/ProductsSearch";
import { generateUniqueSerialNumber } from "@/api/electronicProductsAPI";
import { Textarea } from "../ui/textarea";
// types
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
  productDetails?: any;
  description?: string;
  model: string;
}

interface AddAssetDrawerProps {
  onAssetAdded: () => void;
  userEmail?: string | null;
}

export function AddAssetDrawer({
  onAssetAdded,
  userEmail,
}: AddAssetDrawerProps) {
  //initial form values
  const initialValues: Asset = {
    serialNo: "",
    assetTag: "",
    assignedEmployee: "",
    employeeId: "",
    email: userEmail || "",
    status: "Available",
    type: "",
    customType: "",
    location: "",
    dateAdded: new Date().toISOString(),
    description: "",
    model: "",
  };

  // state for product search dialog
  const [isProductSearchOpen, setIsProductSearchOpen] = React.useState(false);

  // form state and handlers from custom hook
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
    setFormData,
  } = useForm<Asset>(initialValues);

  const handleProductSelect = (product: {
    id: any;
    title: string;
    category: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      serialNo: generateUniqueSerialNumber(`SN-${product.id}`),
      model: product.title,
      type: getProductType(product.category),
      customType: product.category,
      productDetails: product,
    }));
    setIsProductSearchOpen(false);
  };
  // helper function to map product categories to asset types
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

    // find the best match or default to 'Other'
    return Object.keys(categoryMap).find((key) =>
      category.toLowerCase().includes(key)
    )
      ? categoryMap[category.toLowerCase() as keyof typeof categoryMap]
      : "Other";
  };

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
      <Sheet open={open} onOpenChange={setOpen}>
        {/* Trigger button */}
        <SheetTrigger asChild>
          <Card className="max-w-lg p-0 flex-grow-1 max-sm:w-8 bg-transparent border-0">
            <Button
              variant="outline"
              className="text-foreground max-sm:w-4 bg-secondary border-0 shadow-popover-foreground rounded-lg "
            >
              <span className="max-sm:hidden">Add</span>
              <Plus className="h-4 w-4" />
            </Button>
          </Card>
        </SheetTrigger>

        {/* Drawer content */}
        <SheetContent
          side="bottom"
          className="w-full bg-gradient-to-tr from-accent to-card text-foreground max-h-[calc(100vh-100px)] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle className="text-foreground">Add New Asset</SheetTitle>
            <SheetDescription className="text-primary">
              Fill in the details below to add a new asset. Only Serial Number
              is required.
            </SheetDescription>
          </SheetHeader>

          <form
            onSubmit={handleSubmit}
            className="grid gap-6 max-sm:gap-4 py-4 max-sm:py-2"
          >
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

            {/* Asset Type section */}
            <div className="flex gap-4">
              {/* Asset Type */}
              <div className="flex flex-col w-full">
                <Label htmlFor="type" className="mb-1">
                  Asset Type
                </Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
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
                icon={MapPin}
              />
            </div>

            {/* Assigned Employee */}
            <div className="grid gap-2">
              <Label htmlFor="employeeId">Assigned Employee</Label>
              <Select
                value={formData.employeeId}
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
                    onSelect={handleDateChange("dateAdded")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter asset description"
                className="max-sm:-h-32"
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

            {/* Action buttons */}
            <SheetFooter>
              <SheetClose asChild>
                <Button
                  type="button"
                  className="bg-teal-950 text-teal-100 hover:bg-slate-900"
                >
                  Cancel
                </Button>
              </SheetClose>
              <Button
                className="bg-gradient-to-br from-gray-700 to-teal-400/50 text-teal-100"
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
