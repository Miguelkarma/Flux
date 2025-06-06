import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  Briefcase,
  Users,
  UserCircle,
  Cloud,
  DollarSign,
  Headphones,
  Megaphone,
  Monitor,
  Cpu,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EmployeeActionsCell from "@/components/EmployeeComponents/EmployeeActionsCell";

export type EmployeeData = {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  status: string;
  dateAdded: string;
  location: string;
};

export const columns: ColumnDef<EmployeeData>[] = [
  {
    id: "select",
    accessorFn: (row) => row.id,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
            ? "indeterminate"
            : false
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
      <Badge variant="secondary" className="w-auto text-center text-foreground">
        {row.getValue<string>("employeeId") || "N/A"}
      </Badge>
    ),
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <Button
        className="font-extrabold"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    cell: ({ row }) => {
      const fullName = `${row.original.firstName} ${row.original.lastName}`;
      return (
        <div className="flex items-center gap-2">
          <UserCircle className="h-5 w-5 text-foreground" />
          <span className="font-medium text-foreground">{fullName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-5 w-5 text-foreground" />
        <span className="font-medium text-foreground">
          {row.getValue<string>("email") || "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      const department = row.getValue<string>("department") || "N/A";
      const departmentStyles: Record<string, string> = {
        Accounting: "shadow-teal-500",
        Marketing: "shadow-blue-500",
        Finance: "shadow-green-500",
        "Human Resources": "shadow-purple-500",
        "Customer Support": "shadow-orange-500",
        IT: "shadow-yellow-500",
        SysAd: "shadow-pink-500",
        "Software as a service (SaaS)": "shadow-sky-600",
        "Quality Assurance": "shadow-indigo-500",
      };
      const icon =
        department === "Accounting" ? (
          <Briefcase size={18} />
        ) : department === "Marketing" ? (
          <Megaphone size={18} />
        ) : department === "Human Resources" ? (
          <Users size={18} />
        ) : department === "Finance" ? (
          <DollarSign size={18} />
        ) : department === "SysAd" ? (
          <Cpu size={18} />
        ) : department === "IT" ? (
          <Monitor size={18} />
        ) : department === "Customer Support" ? (
          <Headphones size={18} />
        ) : department === "Software as a service (SaaS)" ? (
          <Cloud size={18} />
        ) : department === "Quality Assurance" ? (
          <ShieldCheck size={18} />
        ) : null;

      return (
        <div className="flex items-center space-x-2">
          <div
            className={`p-2 bg-primary-foreground rounded-lg shadow-md ${
              departmentStyles[department] || "shadow-neutral-500"
            }`}
          >
            {icon}
          </div>
          <span
            className={`font-medium text-foreground ${
              departmentStyles[department] || "shadow-neutral-500"
            }`}
          >
            {department}
          </span>
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
        <div className="flex items-center space-x-2 text-center">
          <span className="font-medium text-foreground">{position}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="capitalize text-center text-foreground">
        {row.getValue<string>("location") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "dateAdded",
    header: ({ column }) => (
      <Button
        className="font-extrabold"
        variant="ghost"
        onClick={() => column.toggleSorting()}
      >
        Hire Date <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const dateValue = row.getValue<string>("dateAdded");
      const formattedDate = dateValue
        ? new Date(dateValue).toLocaleDateString()
        : "N/A";
      return <div className="text-center text-foreground">{formattedDate}</div>;
    },
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date(rowA.getValue(columnId)).getTime();
      const dateB = new Date(rowB.getValue(columnId)).getTime();
      return dateA - dateB;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<string>("status") || "Unknown";

      const statusColors: Record<string, string> = {
        Active:
          "text-foreground bg-primary-foreground border-0 shadow-green-500 rounded-lg",
        "On Leave":
          "text-foreground bg-primary-foreground border-0 shadow-orange-400 rounded-lg",
        Terminated:
          "text-foreground bg-primary-foreground border-0 shadow-red-500 rounded-lg",
        Probation:
          "text-foreground bg-primary-foreground border-0 shadow-yellow-400 rounded-lg",
        Remote:
          "text-foreground bg-primary-foreground border-0 shadow-cyan-400 rounded-lg",
      };

      const badgeClass = statusColors[status] || "bg-gray-500 text-foreground";

      return (
        <Badge className={`capitalize text-center ${badgeClass}`}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <EmployeeActionsCell
        employee={row.original}
        onEmployeeUpdated={() => console.log("Employee updated!")}
      />
    ),
    enableHiding: false,
  },
];
