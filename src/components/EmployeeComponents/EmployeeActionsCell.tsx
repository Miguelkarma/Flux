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
import { toast } from "sonner";
import { EmployeeData } from "./columns";
import { EditEmployeeDrawer } from "@/components/EmployeeComponents/EditEmployeeDrawer";
import DeleteDialog from "../sharedComponent/DeleteDialog";

interface EmployeeActionsCellProps {
  employee: EmployeeData;
  onEmployeeUpdated: () => void;
}

const EmployeeActionsCell: React.FC<EmployeeActionsCellProps> = ({
  employee,
  onEmployeeUpdated,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

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
        <DropdownMenuContent align="end" className="w-50 text-foreground">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator className="h-[1px]" />

          {/* Open Edit Drawer */}
          <DropdownMenuItem
            onClick={() => setIsEditDrawerOpen(true)}
            className="flex items-center gap-2 text-foreground"
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
            className="flex items-center gap-2 text-foreground"
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
      <DeleteDialog
        item={{ type: "employee", data: employee }}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onAssetUpdated={onEmployeeUpdated}
      />
    </>
  );
};

export default EmployeeActionsCell;
