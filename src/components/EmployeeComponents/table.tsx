"use client";

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

import { AddEmployeeDrawer } from "@/components/EmployeeComponents/AddEmployeeDrawer";
import { columns, EmployeeData } from "@/components/EmployeeComponents/columns";
import TableLoader from "@/Animation/TableLoader";
import {
  BulkDeleteDialog,
  BulkDeleteTrigger,
} from "@/components/sharedComponent/BulkDeleteDialog";
import { UploadFile } from "@/components/sharedComponent/UploadFile";
import { useBulkDelete } from "@/hooks/tableHooks/use-bulk-delete-hook";
import { useAuth } from "@/hooks/use-auth";
import { useDataTable } from "@/hooks/tableHooks/table-hook";
import { useFirestoreData } from "@/hooks/tableHooks/firestore-data-hook";
import React from "react";

export function EmployeeTable() {
  // auth hook for user data
  const { userId, userEmail, loading: authLoading } = useAuth();

  // firestore data hook
  const {
    data: employees,
    loading: dataLoading,
    refreshData: refreshEmployees,
  } = useFirestoreData<EmployeeData>({
    collectionName: "employees",
    userId,
    orderByField: "dateAdded",
    orderDirection: "desc",
  });

  // memoize to prevent re-renders
  const memoizedEmployees = React.useMemo(() => employees, [employees]);

  // table hook for state management
  const { table, selectedRowIds, setRowSelection } = useDataTable({
    data: memoizedEmployees,
    columns,
    initialSorting: [{ id: "dateAdded", desc: true }],
    initialPageSize: 8,
  });

  // bulk delete functionality
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

  // upload configuration
  const uploadConfig = {
    title: "Upload Employees",
    collectionName: "employees",
    formatExamples: {
      csv: "employeeId,firstName,lastName,email,department,position,status,hireDate,location\nEMP001,John,Doe,john.doe@example.com,IT,Developer,Active,2023-01-15,Remote",
    },
    requiredFields: [
      "employeeId",
      "firstName",
      "lastName",
      "email",
      "department",
    ],
    uniqueField: "employeeId",
  };

  const loading = authLoading || dataLoading;

  // stable refresh callback
  const handleRefresh = React.useCallback(() => {
    refreshEmployees();
  }, [refreshEmployees]);

  // handle bulk delete
  const memoizedSelectedRowIds = React.useMemo(
    () => selectedRowIds,
    [selectedRowIds]
  );
  const handleOpenDelete = React.useCallback(() => {
    openDeleteDialog(memoizedSelectedRowIds);
  }, [openDeleteDialog, memoizedSelectedRowIds]);

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
          icon={Filter}
          className="border-border shadow-popover-foreground bg-primary-foreground w-auto max-sm:w-[13em]"
        />

        <div className="flex items-center space-x-2">
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
            onEmployeeAdded={handleRefresh}
            userEmail={userEmail}
          />
          <UploadFile
            onDataAdded={handleRefresh}
            config={uploadConfig}
            buttonLabel="Import"
          />

          {/* bulk delete button and dialog */}
          {memoizedSelectedRowIds.length > 0 && (
            <>
              <BulkDeleteTrigger
                selectedCount={memoizedSelectedRowIds.length}
                onClick={handleOpenDelete}
              />
              <BulkDeleteDialog
                isOpen={isOpen}
                onOpenChange={closeDeleteDialog}
                onDelete={handleBulkDelete}
                isDeleting={isDeleting}
                selectedCount={memoizedSelectedRowIds.length}
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
              ) : memoizedEmployees.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                  >
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
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span>
            Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
            <strong>{table.getPageCount() || 1}</strong>
          </span>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </Card>
    </>
  );
}
