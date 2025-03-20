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
import {
  Plus,
  Calendar as CalendarIcon,
  Briefcase,
  Users,
  BadgeCheck,
  Phone,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { getAuth } from "firebase/auth";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { NewEmployeeData, addEmployee, checkEmployeeExists } from "@/hooks/employeeHooks";

interface AddEmployeeDrawerProps {
  onEmployeeAdded: () => void;
  userEmail: string | null;
}

export function AddEmployeeDrawer({
  onEmployeeAdded,
  userEmail,
}: AddEmployeeDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState<NewEmployeeData>({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    position: "",
    hireDate: new Date().toISOString(),
    status: "Active",
    phoneNumber: "",
  });

  const handleDateChange = (selectedDate?: Date) => {
    setFormData((prev) => ({
      ...prev,
      hireDate: selectedDate?.toISOString() ?? prev.hireDate,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      department: value,
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
      toast.error("You must be logged in to add an employee!");
      setIsSubmitting(false);
      return;
    }

    if (!userEmail) {
      toast.error("You must be logged in to add an employee!");
      setIsSubmitting(false);
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("First name, last name, and email are required!");
      setIsSubmitting(false);
      return;
    }

    try {
      // Check if employee already exists
      const employeeExists = await checkEmployeeExists(formData.email, user.uid);
      
      if (employeeExists) {
        toast.error("An employee with this email already exists!");
        setIsSubmitting(false);
        return;
      }

      // Generate unique employee ID if not set
      const employeeId = formData.employeeId || `EMP${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`;
      
      const newEmployee: NewEmployeeData = {
        ...formData,
        employeeId,
      };

      // Add employee to Firestore
      await addEmployee(newEmployee, user.uid);

      toast.success("Employee added successfully!");
      onEmployeeAdded();
      setOpen(false);
      setFormData({
        employeeId: "",
        firstName: "",
        lastName: "",
        email: "",
        department: "",
        position: "",
        hireDate: new Date().toISOString(),
        status: "Active",
        phoneNumber: "",
      });
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Failed to add employee");
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
          <Card className="max-w-lg p-0 flex-grow-1 max-sm:w-12 bg-transparent border-0">
            <Button
              variant="outline"
              className="text-secondary-foreground max-sm:w-4 bg-primary-foreground border-0 shadow-popover-foreground rounded-lg mr-1"
            >
              <span className="max-sm:hidden">Add</span>{" "}
              <Plus className="h-4 w-4" />
            </Button>
          </Card>
        </SheetTrigger>

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
            <SheetTitle className="text-popover-foreground">
              Add New Employee
            </SheetTitle>
            <SheetDescription className="text-primary">
              Fill in the details below to add a new employee. First name, last
              name, and email are required.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
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
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={handleDepartmentChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">
                      <Users className="inline-block w-4 h-4 mr-2" />{" "}
                      Engineering
                    </SelectItem>
                    <SelectItem value="Marketing">
                      <Users className="inline-block w-4 h-4 mr-2" /> Marketing
                    </SelectItem>
                    <SelectItem value="Sales">
                      <Users className="inline-block w-4 h-4 mr-2" /> Sales
                    </SelectItem>
                    <SelectItem value="Human Resources">
                      <Users className="inline-block w-4 h-4 mr-2" /> Human
                      Resources
                    </SelectItem>
                    <SelectItem value="Finance">
                      <Users className="inline-block w-4 h-4 mr-2" /> Finance
                    </SelectItem>
                    <SelectItem value="Operations">
                      <Users className="inline-block w-4 h-4 mr-2" /> Operations
                    </SelectItem>
                    <SelectItem value="Customer Support">
                      <Users className="inline-block w-4 h-4 mr-2" /> Customer
                      Support
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Enter position"
                  className="flex items-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem value="Active">
                      <BadgeCheck className="inline-block w-4 h-4 mr-2" />{" "}
                      Active
                    </SelectItem>
                    <SelectItem value="On Leave">
                      <BadgeCheck className="inline-block w-4 h-4 mr-2" /> On
                      Leave
                    </SelectItem>
                    <SelectItem value="Terminated">
                      <BadgeCheck className="inline-block w-4 h-4 mr-2" />{" "}
                      Terminated
                    </SelectItem>
                    <SelectItem value="Probation">
                      <BadgeCheck className="inline-block w-4 h-4 mr-2" />{" "}
                      Probation
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="flex items-center"
              />
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
                {isSubmitting ? "Adding..." : "Add Employee"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}