import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ActionsCell from "./ActionsCell";

export type FirestoreData = {
  id: string;
  serialNo: string;
  assetName: string;
  email: string;
  assignedEmployee: string;
  status: string;
  dateAdded: string;
};

export const columns: ColumnDef<FirestoreData>[] = [
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
    accessorKey: "serialNo",
    header: "Serial No.",
    cell: ({ row }) => (
      <Badge variant="secondary" className="w-auto text-center">
        {row.getValue<string>("serialNo") || "N/A"}
      </Badge>
    ),
  },
  {
    accessorKey: "assetName",
    header: "Asset Name",
    cell: ({ row }) => (
      <div className="capitalize text-center text-secondary-foreground">
        {row.getValue<string>("assetName") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        className="font-extrabold"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase text-secondary-foreground">
        {row.getValue<string>("email") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "assignedEmployee",
    header: "Assigned Employee",
    cell: ({ row }) => (
      <div className="capitalize text-center text-secondary-foreground">
        {row.getValue<string>("assignedEmployee") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "dateAdded",
    header: ({ column }) => (
      <Button
        className="font-extrabold "
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
      return (
        <div className="text-center text-secondary-foreground">
          {formattedDate}
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
        Active:
          "text-white bg-gradient-to-b from-black via-red-700 to-red-900 border-0 text-sm font-medium",
        Maintenance:
          "text-white bg-gradient-to-b from-black/80 via-teal-700 to-teal-900 border-0 text-sm font-medium",
        Retired:
          "text-white bg-gradient-to-b from-black/80 via-yellow-700 to-yellow-900 border-0 text-sm font-medium",
        Available:
          "text-white bg-gradient-to-b from-black/80 via-teal-700 to-teal-900 border-0 text-sm font-medium",
        "Lost/Stolen":
        "text-white bg-gradient-to-b from-black/80 via-teal-700 to-teal-900 border-0 text-sm font-medium",
      };

      const badgeClass =
        statusColors[status] || "bg-gray-500 text-secondary-foreground";

      return (
        <Badge
          variant="outline"
          className={`capitalize text-center ${badgeClass}`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <ActionsCell
        asset={row.original}
        onAssetUpdated={() => console.log("Asset updated!")}
      />
    ),
  },
];
