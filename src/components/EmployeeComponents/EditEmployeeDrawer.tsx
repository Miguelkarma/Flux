"use client";

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
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    id: employee.id,
    employeeId: employee.employeeId ?? "",
    firstName: employee.firstName ?? "",
    lastName: employee.lastName ?? "",
    email: employee.email ?? "",
    department: employee.department ?? "",
    position: employee.position ?? "",
    status: employee.status ?? "Active",
    phoneNumber: employee.phoneNumber ?? "",
    hireDate: employee.hireDate ?? new Date().toISOString(),
    manager: employee.manager ?? "",
    location: employee.location ?? "",
  });

  // Update state when employee changes
  React.useEffect(() => {
    setFormData({
      id: employee.id,
      employeeId: employee.employeeId ?? "",
      firstName: employee.firstName ?? "",
      lastName: employee.lastName ?? "",
      email: employee.email ?? "",
      department: employee.department ?? "",
      position: employee.position ?? "",
      status: employee.status ?? "Active",
      phoneNumber: employee.phoneNumber ?? "",
      hireDate: employee.hireDate ?? new Date().toISOString(),
      manager: employee.manager ?? "",
      location: employee.location ?? "",
    });
  }, [employee]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      hireDate: date ? date.toISOString() : new Date().toISOString(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const auth = getAuth();
    const user = auth.currentUser;
    const userEmail = user?.email;

    if (!userEmail) {
      toast.error("You must be logged in to update an employee!");
      setIsSubmitting(false);
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("First name, last name, and email are required!");
      setIsSubmitting(false);
      return;
    }

    try {
      const employeesRef = collection(db, "employees");

      // Check for duplicate employee ID (if changed)
      if (formData.employeeId && formData.employeeId !== employee.employeeId) {
        const idQuery = query(
          employeesRef,
          where("employeeId", "==", formData.employeeId),
          where("userId", "==", user.uid)
        );
        const idSnapshot = await getDocs(idQuery);

        if (!idSnapshot.empty) {
          toast.error("Employee with this ID already exists!");
          setIsSubmitting(false);
          return;
        }
      }

      // Check for duplicate email (if changed)
      if (formData.email !== employee.email) {
        const emailQuery = query(
          employeesRef,
          where("email", "==", formData.email),
          where("userId", "==", user.uid)
        );
        const emailSnapshot = await getDocs(emailQuery);

        if (!emailSnapshot.empty) {
          toast.error("Employee with this email already exists!");
          setIsSubmitting(false);
          return;
        }
      }

      const employeeRef = doc(db, "employees", employee.id);
      await updateDoc(employeeRef, {
        ...formData,
        updatedAt: new Date().toISOString(),
        updatedBy: userEmail,
      });

      toast.success("Employee updated successfully!");
      onEmployeeUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee");
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
        theme="dark"
        closeButton={true}
        expand={true}
        visibleToasts={3}
        style={{ zIndex: 9999 }}
      />
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
          <form onSubmit={handleSubmit} className="grid gap-6 py-4">
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
                      onSelect={handleDateChange}
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
                    <SelectItem value="HR">Human Resources</SelectItem>
                    <SelectItem value="Quality Assurance">
                      Quality Assurance
                    </SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Customer Support">
                      Customer Support
                    </SelectItem>
                    <SelectItem value="SaaS">
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
