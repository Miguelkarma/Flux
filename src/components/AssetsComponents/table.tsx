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
import { ChevronDown} from "lucide-react";
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
import { AddAssetDrawer } from "./AddAssetDrawer";
import { columns } from "./columns";
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

export type FirestoreData = {
  id: string;
  serialNo: string;
  assetName: string;
  email: string;
  assignedEmployee: string;
  status: string;
  userId: string;
  dateAdded: string;
};

export function DataTable() {
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

  React.useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is authenticated:", user.uid, user.email);
        setUserEmail(user.email);
        const unsubscribeFirestore = fetchAssets(user.uid);
        return () => unsubscribeFirestore && unsubscribeFirestore();
      } else {
        console.log("User is not authenticated");
        setUserEmail(null);
        setFirebaseData([]);
      }
    });

    return () => unsubscribeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAssets = React.useCallback((userId: string) => {
    const q = query(
      collection(db, "it-assets"),
      where("userId", "==", userId),
      orderBy("dateAdded", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Snapshot received:", snapshot.docs.length, "documents");
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirestoreData[];
      console.log("Fetched data:", data);
      setFirebaseData(data);
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
    onPaginationChange: setPagination, // Ensure pagination updates
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination, // Pass the pagination state
    },
  });

  return (
    <>
      <div className="flex items-center gap-4 py-4">
        <Card className="max-w-lg flex-grow p-2">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="border-teal-700"
          />
        </Card>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <AddAssetDrawer
          onAssetAdded={() => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
              fetchAssets(user.uid);
            }
          }}
          userEmail={userEmail}
        />
      </div>

      <div className="overflow-auto rounded-md border min-w-0">
        <Table className="w-full">
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
            {table.getRowModel().rows.length ? (
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
      </div>
      <div className="flex items-center justify-between px-2 py-4">
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
    </>
  );
}
