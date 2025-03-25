import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import DeleteEmployeeDialog from "@/components/EmployeeComponents/DeleteEmployeeDialog";
import { toast } from "sonner";
import { EmployeeData } from "./columns";
import { db } from "@/firebase/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { EditEmployeeDrawer } from "@/components/EmployeeComponents/EditEmployeeDrawer";

interface EmployeeActionsCellProps {
  employee: EmployeeData;
  onEmployeeUpdated: () => void;
}

const EmployeeActionsCell: React.FC<EmployeeActionsCellProps> = ({
  employee,
  onEmployeeUpdated,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  const handleDelete = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("You must be logged in to delete employees.");
      return;
    }

    if (!employee.id) {
      toast.error("Error: Employee ID is missing");
      return;
    }

    try {
      setIsDeleting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const employeeRef = doc(db, "employees", employee.id);
      await deleteDoc(employeeRef);
      toast.success(
        `${employee.firstName} ${employee.lastName} deleted successfully.`
      );
      setIsDeleteDialogOpen(false);
      onEmployeeUpdated(); // refresh data after deleting
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete employee. ");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(employee.employeeId || "");
      toast.success("Employee ID copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy Employee ID");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            aria-label="Open actions menu"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-50">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator className="h-[1px] bg-teal-300/60" />

          {/* Open Edit Drawer */}
          <DropdownMenuItem
            onClick={() => setIsEditDrawerOpen(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>

          {/* Delete Employee */}
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center gap-2 text-red-600"
          >
            <Trash className="h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Copy Email */}
          <DropdownMenuItem
            onClick={handleCopyId}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            <span>Copy Employee ID</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Render EditEmployeeDrawer */}
      <EditEmployeeDrawer
        employee={employee}
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        onEmployeeUpdated={onEmployeeUpdated}
      />

      {/* Render Delete Confirmation Dialog */}
      <DeleteEmployeeDialog
        employee={employee}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default EmployeeActionsCell;
