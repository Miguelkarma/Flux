import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
  RowSelectionState,
  VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { AddAssetDrawer } from "./AddAssetDrawer";
import { columns } from "./columns";
import TableLoader from "@/Animation/TableLoader";
import {
  BulkDeleteDialog,
  BulkDeleteTrigger,
} from "../sharedComponent/BulkDeleteDialog";
import { UploadFile } from "../sharedComponent/UploadFile";
import { useBulkDelete } from "@/hooks/tableHooks/use-bulk-delete-hook";

import { db } from "@/firebase/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Type definitions
export type FirestoreData = {
  id: string;
  serialNo: string;
  assetTag: string;
  type: string;
  customType?: string;
  location: string;
  email: string;
  assignedEmployee: string;
  status: string;
  dateAdded: string;
};

export function DataTable() {
  // State management
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "dateAdded", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [firebaseData, setFirebaseData] = React.useState<FirestoreData[]>([]);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [pagination, setPagination] = React.useState({
    pageSize: 8,
    pageIndex: 0,
  });
  const [loading, setLoading] = React.useState(true);

  // fetch assets from Firebase
  const fetchAssets = React.useCallback((userId: string) => {
    setLoading(true);
    const q = query(
      collection(db, "it-assets"),
      where("userId", "==", userId),
      orderBy("dateAdded", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirestoreData[];
      setFirebaseData(data);
      setLoading(false);
    });
  }, []);

  // authentication effect
  React.useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        const unsubscribeFirestore = fetchAssets(user.uid);
        return () => unsubscribeFirestore && unsubscribeFirestore();
      } else {
        setUserEmail(null);
        setFirebaseData([]);
      }
    });

    return () => unsubscribeAuth();
  }, [fetchAssets]);

  // initialize table
  const table = useReactTable({
    data: firebaseData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  // Get selected row IDs from the table
  const selectedRowIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original.id);

  // Use the bulk delete hook directly
  const {
    isOpen,
    isDeleting,
    itemTypeLabel,
    openDeleteDialog,
    closeDeleteDialog,
    handleBulkDelete,
  } = useBulkDelete({
    collectionType: "it-assets",
    onDeleteSuccess: () => setRowSelection({}),
  });

  // component to trigger refresh of assets
  const refreshAssets = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      fetchAssets(user.uid);
    }
  };

  // Configuration for the UploadFile component
  const uploadConfig = {
    title: "Upload IT Assets",
    collectionName: "it-assets",
    formatExamples: {
      csv: "serialNo,assetTag,type,location,status\n12345,LAP-001,Laptop,Office,Active\n67890,MON-002,Monitor,Remote,Active",
    },
    requiredFields: ["serialNo", "assetTag", "type", "location", "status"],
    uniqueField: "serialNo",
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter Serial No."
          value={
            (table.getColumn("serialNo")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("serialNo")?.setFilterValue(event.target.value)
          }
          icon={Filter}
          className="border-border shadow-popover-foreground bg-primary-foreground w-auto max-sm:w-[11em]"
        />

        <div className="flex items-center space-x-1 max-sm:space-x-1">
          {/* columns dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="max-sm:w-4 bg-primary-foreground border-0 shadow-popover-foreground rounded-lg text-secondary-foreground mr-1"
              >
                <span className="max-sm:hidden">Columns</span>
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* asset management buttons */}
          <AddAssetDrawer onAssetAdded={refreshAssets} userEmail={userEmail} />
          <UploadFile
            onDataAdded={refreshAssets}
            config={uploadConfig}
            buttonLabel="Import"
          />

          {/* bulk delete button and dialog */}
          {selectedRowIds.length > 0 && (
            <>
              <BulkDeleteTrigger
                selectedCount={selectedRowIds.length}
                onClick={() => openDeleteDialog(selectedRowIds)}
              />
              <BulkDeleteDialog
                isOpen={isOpen}
                onOpenChange={closeDeleteDialog}
                onDelete={handleBulkDelete}
                isDeleting={isDeleting}
                selectedCount={selectedRowIds.length}
                itemType={itemTypeLabel}
              />
            </>
          )}
        </div>
      </div>

      {/* Data table */}
      <Card className="bg-card p-3 border-0 shadow-popover-foreground overflow-x-auto rounded-md border-b">
        <ScrollArea className="rounded-md transition">
          <Table className="w-full shadow-popover-foreground">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : typeof header.column.columnDef.header === "function"
                        ? header.column.columnDef.header(header.getContext())
                        : header.column.columnDef.header}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-left"
                  >
                    <div className="flex justify-center items-center h-full">
                      <TableLoader />
                    </div>
                  </TableCell>
                </TableRow>
              ) : firebaseData.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {typeof cell.column.columnDef.cell === "function"
                          ? cell.column.columnDef.cell(cell.getContext())
                          : cell.column.columnDef.cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" className="scrollbar" />
        </ScrollArea>

        {/* Pagination controls */}
        <div className="flex items-center justify-between px-2 py-2">
          <Button
            variant="outline"
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: Math.max(prev.pageIndex - 1, 0),
              }))
            }
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span>
            Page <strong>{pagination.pageIndex + 1}</strong> of{" "}
            <strong>{table.getPageCount()}</strong>
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: prev.pageIndex + 1,
              }))
            }
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </Card>
    </>
  );
}
