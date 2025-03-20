import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpDown,
  MoreHorizontal,
  Briefcase,
  Users,
  Calendar,
  BadgeCheck,
  Phone,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type FirebaseEmployeeData = {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  hireDate: string;
  status: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
};

// eslint-disable-next-line react-refresh/only-export-components
function EmployeeActions({ rowData }: { rowData: FirebaseEmployeeData }) {
  const handleAction = (action: string) => {
    console.log(`${action} action triggered for employee: ${rowData.employeeId}`);
    // Here you would implement Firebase operations
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem onClick={() => handleAction("View")}>
          View details
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem onClick={() => handleAction("Edit")}>
          Edit employee
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          onClick={() => handleAction("Delete")}
          className="text-destructive"
        >
          Delete employee
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<FirebaseEmployeeData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "employeeId",
    header: "Employee ID",
    cell: ({ row }) => (
      <Badge variant="secondary" className="w-auto text-center">
        {row.getValue<string>("employeeId") || "N/A"}
      </Badge>
    ),
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <Button
        className="font-extrabold"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        First Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize text-secondary-foreground">
        {row.getValue<string>("firstName") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <Button
        className="font-extrabold"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Last Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize text-secondary-foreground">
        {row.getValue<string>("lastName") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-secondary-foreground">
        {row.getValue<string>("email") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      const department = row.getValue<string>("department") || "N/A";
      
      return (
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary-foreground rounded-lg shadow-md shadow-blue-500">
            <Users size={18} />
          </div>
          <span className="font-medium">{department}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => {
      const position = row.getValue<string>("position") || "N/A";
      
      return (
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary-foreground rounded-lg shadow-md shadow-purple-500">
            <Briefcase size={18} />
          </div>
          <span className="font-medium">{position}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "hireDate",
    header: ({ column }) => (
      <Button
        className="font-extrabold"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Hire Date <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const dateValue = row.getValue<string>("hireDate");
      const formattedDate = dateValue
        ? new Date(dateValue).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A";
      
      return (
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary-foreground rounded-lg shadow-md shadow-green-500">
            <Calendar size={18} />
          </div>
          <span>{formattedDate}</span>
        </div>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date(rowA.getValue(columnId)).getTime();
      const dateB = new Date(rowB.getValue(columnId)).getTime();
      return dateB - dateA;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<string>("status") || "Unknown";

      const statusColors: Record<string, string> = {
        Active: "text-secondary-foreground bg-primary-foreground border-0 shadow-green-500 rounded-lg",
        "On Leave": "text-secondary-foreground bg-primary-foreground border-0 shadow-orange-400 rounded-lg",
        Terminated: "text-secondary-foreground bg-primary-foreground border-0 shadow-red-500 rounded-lg",
        Probation: "text-secondary-foreground bg-primary-foreground border-0 shadow-yellow-400 rounded-lg",
      };

      const badgeClass = statusColors[status] || "bg-gray-500 text-secondary-foreground";

      return (
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary-foreground rounded-lg shadow-md shadow-cyan-500">
            <BadgeCheck size={18} />
          </div>
          <Badge className={`capitalize text-center ${badgeClass}`}>
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => {
      const phoneNumber = row.getValue<string>("phoneNumber") || "N/A";
      
      return (
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary-foreground rounded-lg shadow-md shadow-indigo-500">
            <Phone size={18} />
          </div>
          <span>{phoneNumber}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <EmployeeActions rowData={row.original} />,
    enableHiding: false,
  },
];