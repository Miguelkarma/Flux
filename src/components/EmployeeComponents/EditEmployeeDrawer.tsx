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
  BadgeCheck,
  Briefcase,
  CalendarIcon,
  Mail,
  User,
  MapPin,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import type { EmployeeData } from "./columns";
import {
  useFormState,
  submitEmployeeForm,
} from "@/hooks/assetHook/edit-form-hook";

interface EditEmployeeDrawerProps {
  employee: EmployeeData;
  isOpen: boolean;
  onClose: () => void;
  onEmployeeUpdated: () => void;
}

export function EditEmployeeDrawer({
  employee,
  isOpen,
  onClose,
  onEmployeeUpdated,
}: EditEmployeeDrawerProps) {
  // Create a memoized initial form data object based on employee
  const initialFormData = React.useMemo(
    () => ({
      id: employee.id,
      employeeId: employee.employeeId ?? "",
      firstName: employee.firstName ?? "",
      lastName: employee.lastName ?? "",
      email: employee.email ?? "",
      department: employee.department ?? "",
      position: employee.position ?? "",
      status: employee.status ?? "Active",
      hireDate: employee.hireDate ?? new Date().toISOString(),
      location: employee.location ?? "",
    }),
    [employee]
  );

  // Initialize the form state using the useFormState hook with default values
  const {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
  } = useFormState(initialFormData);

  // Reset form when drawer opens or employee changes
  React.useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
    }
  }, [isOpen, initialFormData, setFormData]);

  // Custom handler for date changes that uses the hook's handleDateChange
  const handleHireDateChange = (date: Date | undefined) => {
    handleDateChange("hireDate")(date);
  };

  // Submit handler that uses the imported submitEmployeeForm function
  const handleSubmit = (e: React.FormEvent) => {
    submitEmployeeForm({
      e,
      formData,
      employee,
      setIsSubmitting,
      onEmployeeUpdated,
      onClose,
    });
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="bottom"
          className="w-full bg-gradient-to-tr from-accent to-card text-popover-foreground"
        >
          <SheetHeader>
            <SheetTitle className="text-popover-foreground">
              Edit Employee
            </SheetTitle>
            <SheetDescription className="text-primary">
              Update the employee details below. First name, last name, and
              email are required.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="grid gap-6 py-4 max-sm:py-1 max-sm:gap-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  placeholder="Enter employee ID"
                  icon={BadgeCheck}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="hireDate">Hire Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left"
                    >
                      {formData.hireDate
                        ? format(new Date(formData.hireDate), "PPP")
                        : "Select a date"}
                      <CalendarIcon className="w-4 h-4 opacity-70" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-full p-2">
                    <Calendar
                      mode="single"
                      selected={new Date(formData.hireDate)}
                      onSelect={handleHireDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="Enter position/title"
                icon={Briefcase}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  icon={User}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  icon={User}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                icon={Mail}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={handleSelectChange("department")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Accounting">Accounting</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="SysAd">SysAd</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Human Resources">
                      Human Resources
                    </SelectItem>
                    <SelectItem value="Quality Assurance">
                      Quality Assurance
                    </SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Customer Support">
                      Customer Support
                    </SelectItem>
                    <SelectItem value="Software as a service (SaaS)">
                      Software as a service (SaaS)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                  icon={MapPin}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
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
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Terminated">Terminated</SelectItem>
                  <SelectItem value="Probation">Probation</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
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
                {isSubmitting ? "Updating..." : "Update Employee"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
