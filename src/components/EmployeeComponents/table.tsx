"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
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

import { AddEmployeeDrawer } from "@/components/EmployeeComponents/AddEmployeeDrawer";
import { columns, EmployeeData } from "./columns";
import TableLoader from "@/Animation/TableLoader";
import {
  BulkDeleteDialog,
  BulkDeleteTrigger,
} from "@/components/sharedComponent/BulkDeleteDialog";
import { useBulkDelete } from "@/hooks/assetHook/use-bulk-delete-hook";
import { UploadFile } from "@/components/sharedComponent/UploadFile";

import { db } from "@/firebase/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export function EmployeeTable() {
  // State management
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "hireDate", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [firebaseData, setFirebaseData] = React.useState<EmployeeData[]>([]);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [pagination, setPagination] = React.useState({
    pageSize: 8,
    pageIndex: 0,
  });
  const [loading, setLoading] = React.useState(true);

  // fetch employees from Firebase
  const fetchEmployees = React.useCallback((userId: string) => {
    setLoading(true);
    const q = query(
      collection(db, "employees"),
      where("userId", "==", userId),
      orderBy("hireDate", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as EmployeeData[];
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
        const unsubscribeFirestore = fetchEmployees(user.uid);
        return () => unsubscribeFirestore && unsubscribeFirestore();
      } else {
        setUserEmail(null);
        setFirebaseData([]);
      }
    });

    return () => unsubscribeAuth();
  }, [fetchEmployees]);

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
    collectionType: "employees",
    onDeleteSuccess: () => setRowSelection({}),
  });

  // component to trigger refresh of employees
  const refreshEmployees = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      fetchEmployees(user.uid);
    }
  };

  // Upload config for employees
  const uploadConfig = {
    title: "Upload Employees",
    collectionName: "employees",
    formatExamples: {
      csv: "employeeId,firstName,lastName,email,department,position,status,hireDate,location\nEMP001,John,Doe,john.doe@example.com,IT,Developer,Active,2023-01-15,Remote\nEMP002,Jane,Smith,jane.smith@example.com,Marketing,Specialist,Active,2023-02-20,New York",
      json: '[{"employeeId":"EMP001","firstName":"John","lastName":"Doe","email":"john.doe@example.com","department":"IT","position":"Developer","status":"Active","hireDate":"2023-01-15","location":"Remote"},{"employeeId":"EMP002","firstName":"Jane","lastName":"Smith","email":"jane.smith@example.com","department":"Marketing","position":"Specialist","status":"Active","hireDate":"2023-02-20","location":"New York"}]',
    },
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter Employee ID"
          value={
            (table.getColumn("employeeId")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("employeeId")?.setFilterValue(event.target.value)
          }
          className="border-border shadow-popover-foreground bg-primary-foreground w-auto max-sm:w-[11em]"
        />

        <div className="flex items-center space-x-2 max-sm:space-x-1">
          {/* columns dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="max-sm:w-4 bg-primary-foreground border-0 shadow-popover-foreground rounded-lg text-secondary-foreground"
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

          {/* employee management buttons */}
          <AddEmployeeDrawer
            onEmployeeAdded={refreshEmployees}
            userEmail={userEmail}
          />
          <UploadFile
            onDataAdded={refreshEmployees}
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
