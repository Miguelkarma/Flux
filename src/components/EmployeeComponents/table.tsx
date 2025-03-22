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
import { AddEmployeeDrawer } from "@/components/EmployeeComponents/AddEmployeeDrawer";
import { columns, EmployeeData } from "./columns";

import { db } from "@/firebase/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Card } from "../ui/card";
import TableLoader from "@/Animation/TableLoader";

import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export function EmployeeTable() {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "hireDate", desc: false },
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

  React.useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is authenticated:", user.uid, user.email);
        setUserEmail(user.email);
        const unsubscribeFirestore = fetchEmployees(user.uid);
        return () => unsubscribeFirestore && unsubscribeFirestore();
      } else {
        console.log("User is not authenticated");
        setUserEmail(null);
        setFirebaseData([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchEmployees = React.useCallback((userId: string) => {
    setLoading(true);
    const q = query(
      collection(db, "employees"),
      where("userId", "==", userId),
      orderBy("hireDate", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Snapshot received:", snapshot.docs.length, "documents");
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as EmployeeData[];
      console.log("Fetched data:", data);
      setFirebaseData(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

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

  return (
    <>
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search Employee ID"
          value={
            (table.getColumn("employeeId")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("employeeId")?.setFilterValue(event.target.value)
          }
          className="border-border shadow-popover-foreground bg-primary-foreground w-auto max-sm:w-[11em]  "
          icon={Filter}
        />
        <div className="flex items-center space-x-1 max-sm:space-x-1">
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

          <AddEmployeeDrawer
            onEmployeeAdded={() => {
              const auth = getAuth();
              const user = auth.currentUser;
              if (user) {
                fetchEmployees(user.uid);
              }
            }}
            userEmail={userEmail}
          />
        </div>
      </div>

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
                    No employees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" className="scrollbar" />
        </ScrollArea>
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
