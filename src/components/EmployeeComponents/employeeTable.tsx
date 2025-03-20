import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  RowSelectionState,
} from "@tanstack/react-table";
import { ChevronDown, Upload } from "lucide-react";
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
import { toast, Toaster } from "sonner";
import { columns, FirebaseEmployeeData } from "./employeeColumns";
import { AddEmployeeDrawer } from "./AddEmployeeDrawer";
import { getAuth } from "firebase/auth";
import { getEmployees, deleteMultipleEmployees } from "@/hooks/employeeHooks";

export function EmployeeTable() {
  const [employees, setEmployees] = React.useState<FirebaseEmployeeData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "firstName", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [pagination, setPagination] = React.useState({
    pageSize: 5,
    pageIndex: 0,
  });

  // Get user email for the AddEmployeeDrawer
  const [userEmail, setUserEmail] = React.useState<string | null>(null);

  // Load employees from Firestore
  const loadEmployees = React.useCallback(async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("You must be logged in to view employees");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const employeeData = await getEmployees(user.uid);
      setEmployees(employeeData);
    } catch (error) {
      console.error("Failed to load employees:", error);
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setUserEmail(user.email);
      loadEmployees();
    } else {
      // Listen for auth state changes
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setUserEmail(user.email);
          loadEmployees();
        } else {
          setUserEmail(null);
          setEmployees([]);
          setLoading(false);
        }
      });

      return () => unsubscribe();
    }
  }, [loadEmployees]);

  const handleEmployeeAdded = () => {
    loadEmployees();
    toast.success("Employee list updated!");
  };

  const handleButtonClick = (action: string) => {
    toast(`${action} button clicked`, {
      description: `The ${action} functionality is not implemented yet.`,
    });
  };

  const handleBulkDelete = async () => {
    const selectedEmployeeIds = Object.keys(rowSelection).map(
      (index) => employees[parseInt(index)].id
    );

    if (selectedEmployeeIds.length === 0) {
      toast.error("No employees selected");
      return;
    }

    try {
      await deleteMultipleEmployees(selectedEmployeeIds);

      toast.success(
        `${selectedEmployeeIds.length} employees deleted successfully`
      );

      // Refresh the employee list
      loadEmployees();

      // Clear selection
      setRowSelection({});
    } catch (error) {
      console.error("Failed to delete employees:", error);
      toast.error("Failed to delete employees");
    }
  };

  const table = useReactTable({
    data: employees,
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
      <Toaster />
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter by first name..."
          value={
            (table.getColumn("firstName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("firstName")?.setFilterValue(event.target.value)
          }
          className="border-border shadow-popover-foreground bg-primary-foreground w-auto max-sm:w-[11em]"
        />

        <div className="flex items-center space-x-1 max-sm:space-x-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="max-sm:w-4 bg-primary-foreground border-0 shadow-popover-foreground rounded-lg text-secondary-foreground"
              >
                <span className="max-sm:hidden"> Columns </span>
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
            onEmployeeAdded={handleEmployeeAdded}
            userEmail={userEmail}
          />

          <Button
            onClick={() => handleButtonClick("Import")}
            variant="outline"
            className="bg-primary-foreground border-0 shadow-popover-foreground"
          >
            <Upload className="h-4 w-4 mr-2" />
            <span className="max-sm:hidden">Import</span>
          </Button>

          {Object.keys(rowSelection).length > 0 && (
            <Button
              onClick={handleBulkDelete}
              variant="destructive"
              className="shadow-popover-foreground"
            >
              Delete Selected ({Object.keys(rowSelection).length})
            </Button>
          )}
        </div>
      </div>

      <Card className="bg-card p-3 border-0 shadow-popover-foreground overflow-x-auto rounded-md border-b mt-4">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <p>Loading employees...</p>
          </div>
        ) : (
          <ScrollArea className="rounded-md transition">
            <Table className="w-full shadow-popover-foreground">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : React.isValidElement(header.column.columnDef.header)
                          ? header.column.columnDef.header
                          : typeof header.column.columnDef.header === "function"
                          ? header.column.columnDef.header(header.getContext())
                          : header.column.columnDef.header}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {React.isValidElement(cell.column.columnDef.cell)
                            ? cell.column.columnDef.cell
                            : typeof cell.column.columnDef.cell === "function"
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
        )}
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
            <strong>{table.getPageCount() || 1}</strong>
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
