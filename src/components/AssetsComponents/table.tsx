"use client";

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

import { AddAssetDrawer } from "@/components/AssetsComponents/AddAssetDrawer";
import { columns } from "@/components/AssetsComponents/columns";
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
import React, { useState, useEffect } from "react";
import type { FirestoreData } from "@/components/AssetsComponents/types";

export function DataTable() {
  // auth hook for user data
  const { userId, userEmail, loading: authLoading } = useAuth();

  const [isLargeScreen, setIsLargeScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // firestore data hook
  const {
    data: assets,
    loading: dataLoading,
    refreshData: refreshAssets,
  } = useFirestoreData<FirestoreData>({
    collectionName: "it-assets",
    userId,
    orderByField: "dateAdded",
    orderDirection: "desc",
  });

  // memoize to prevent re-renders
  const memoizedAssets = React.useMemo(() => assets, [assets]);

  // table hook for state management
  const { table, selectedRowIds, setRowSelection } = useDataTable({
    data: memoizedAssets,
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
    collectionType: "it-assets",
    onDeleteSuccess: () => setRowSelection({}),
  });

  // upload configuration
  const uploadConfig = {
    title: "Upload IT Assets",
    collectionName: "it-assets",
    formatExamples: {
      csv: "serialNo,assetTag,model,type,location,description,status\n123456,AT001,Dell Latitude,Laptop,Office A,Work laptop,Active",
    },
    requiredFields: [
      "serialNo",
      "assetTag",
      "model",
      "type",
      "location",
      "description",
      "status",
    ],
    uniqueField: "serialNo",
  };

  const loading = authLoading || dataLoading;

  // stable refresh callback
  const handleRefresh = React.useCallback(() => {
    refreshAssets();
  }, [refreshAssets]);

  // handle bulk delete
  const memoizedSelectedRowIds = React.useMemo(
    () => selectedRowIds,
    [selectedRowIds]
  );
  const handleOpenDelete = React.useCallback(() => {
    openDeleteDialog(memoizedSelectedRowIds);
  }, [openDeleteDialog, memoizedSelectedRowIds]);

  useEffect(() => {
    if (isLargeScreen) {
      table.getAllColumns().forEach((column) => {
        if (column.getCanHide()) {
          column.toggleVisibility(true);
        }
      });
    }
  }, [isLargeScreen, table]);

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
          className="border-border shadow-popover-foreground bg-secondary w-auto max-sm:w-[13em] text-foreground"
        />

        <div className="flex items-center space-x-2 ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="max-sm:w-4 bg-secondary border-0 shadow-popover-foreground rounded-lg text-foreground"
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
                    className="capitalize text-foreground"
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
          <AddAssetDrawer onAssetAdded={handleRefresh} userEmail={userEmail} />
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
      <Card className="bg-secondary p-3 border-0 shadow-popover-foreground overflow-hidden rounded-md border-b text-foreground">
        <div className={`w-full ${isLargeScreen ? "" : "overflow-auto"}`}>
          {isLargeScreen ? (
            <Table className="w-full shadow-popover-foreground">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="whitespace-nowrap">
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
                ) : memoizedAssets.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() ? "selected" : undefined}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={
                            cell.column.id === "description"
                              ? "max-w-xs truncate"
                              : ""
                          }
                        >
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
          ) : (
            <ScrollArea className="rounded-md transition">
              <Table className="w-full shadow-popover-foreground">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className={`whitespace-nowrap ${
                            header.id === "serialNo" ||
                            header.id === "status" ||
                            header.id === "actions"
                              ? "sticky"
                              : ""
                          }`}
                        >
                          {header.isPlaceholder
                            ? null
                            : typeof header.column.columnDef.header ===
                              "function"
                            ? header.column.columnDef.header(
                                header.getContext()
                              )
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
                  ) : memoizedAssets.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={
                          row.getIsSelected() ? "selected" : undefined
                        }
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={`${
                              cell.column.id === "serialNo" ||
                              cell.column.id === "status" ||
                              cell.column.id === "actions"
                                ? "sticky"
                                : ""
                            } ${
                              cell.column.id === "description"
                                ? "max-w-xs truncate"
                                : "whitespace-nowrap"
                            }`}
                          >
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
          )}
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between px-2 py-2 mt-2">
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-xs sm:text-sm"
          >
            Previous
          </Button>
          <span className="text-xs sm:text-sm">
            Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
            <strong>{table.getPageCount() || 1}</strong>
          </span>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="text-xs sm:text-sm"
          >
            Next
          </Button>
        </div>
      </Card>
    </>
  );
}
