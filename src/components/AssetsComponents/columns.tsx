import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import {
  ArrowUpDown,
  Laptop,
  Server,
  Monitor,
  Keyboard,
  Mouse,
  Printer,
  Computer,
  Usb,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ActionsCell from "./ActionsCell";
import { ProductDetails } from "@/components/AssetsComponents/types";

export type FirestoreData = {
  id: string;
  serialNo: string;
  assetTag: string;
  type: string;
  customType?: string;
  location: string;
  assignedEmployee: string;
  status: string;
  dateAdded: string;
  description?: string;
  productDetails?: ProductDetails;
  model: string;
};

export const columns: ColumnDef<FirestoreData, any>[] = [
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
    accessorKey: "serialNo",
    header: "Serial No.",
    cell: ({ row }) => (
      <Badge variant="secondary" className="w-auto text-center text-foreground">
        {row.getValue<string>("serialNo") || "N/A"}
      </Badge>
    ),
  },
  {
    accessorKey: "assetTag",
    header: "Asset Tag",
    cell: ({ row }) => (
      <div className="capitalize text-center text-foreground">
        {row.getValue<string>("assetTag") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "model",
    header: "Model",
    cell: ({ row }) => (
      <div className="text-center text-foreground">
        {row.getValue<string>("model") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue<string>("type") || "N/A";

      const typeStyles: Record<string, string> = {
        Laptop: "shadow-teal-500",
        Computer: "shadow-blue-500",
        Server: "shadow-green-500",
        Monitor: "shadow-purple-500",
        Keyboard: "shadow-orange-500",
        Mouse: "shadow-yellow-500",
        Printer: "shadow-pink-500",
        Peripheral: "shadow-indigo-500",
        Other: "shadow-gray-500",
      };

      const icon =
        type === "Laptop" ? (
          <Laptop size={18} />
        ) : type === "Computer" ? (
          <Computer size={18} />
        ) : type === "Server" ? (
          <Server size={18} />
        ) : type === "Monitor" ? (
          <Monitor size={18} />
        ) : type === "Keyboard" ? (
          <Keyboard size={18} />
        ) : type === "Mouse" ? (
          <Mouse size={18} />
        ) : type === "Printer" ? (
          <Printer size={18} />
        ) : type === "Peripheral" ? (
          <Usb size={18} />
        ) : null;

      return (
        <div className="flex items-center space-x-2">
          <div
            className={`p-2 bg-secondary rounded-lg shadow-md ${typeStyles[type]}`}
          >
            {icon}
          </div>
          <span className={`font-medium ${typeStyles[type]}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
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
    accessorKey: "assignedEmployee",
    header: "Assigned Employee",
    cell: ({ row }) => (
      <div className="capitalize text-center text-foreground">
        {row.getValue<string>("assignedEmployee") || "N/A"}
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
        Date Added <ArrowUpDown />
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
      return dateB - dateA;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<string>("status") || "Unknown";

      const statusColors: Record<string, string> = {
        Active:
          "text-foreground bg-secondary border-0 shadow-green-500 rounded-lg",
        Maintenance:
          "text-foreground bg-secondary border-0 shadow-orange-400 rounded-lg",
        Retired:
          "text-foreground bg-secondary border-0 shadow-purple-500 rounded-lg",
        Available:
          "text-foreground bg-secondary border-0 shadow-cyan-400 rounded-lg",
        Lost: "text-foreground bg-secondary border-0 shadow-red-500 rounded-lg",
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

    accessorFn: (row) => row.id,
    header: "Actions",
    cell: ({ row }) => (
      <ActionsCell
        asset={row.original}
        onAssetUpdated={() => console.log("Asset updated!")}
      />
    ),
    enableHiding: false,
  },
];
