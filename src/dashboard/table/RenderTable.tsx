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
import { AddAssetDrawer } from "./AddAssetDrawer";
import { columns } from "./columns";
import { db } from "@/firebase/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [firebaseData, setFirebaseData] = React.useState<FirestoreData[]>([]);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);

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

  // Real-time listener for Firestore changes
  const fetchAssets = React.useCallback((userId: string) => {
    const q = query(collection(db, "it-assets"), where("userId", "==", userId));

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Card className="flex flex-col flex-1 min-w-0 p-4 md:p-7 2xl:p-10 bg-gradient-to-b from-teal-800/70 via-black to-teal-900/10">
      <div className="flex flex-col flex-1 w-full ">
        <div className="flex items-center gap-4 py-4">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-lg flex-grow"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto ">
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
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
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

        <div className="flex-1 overflow-auto rounded-md border min-w-0 ">
          <Table className="w-full ">
            <TableHeader className="bg-gradient-to-t from-black via-black to-teal-600/10 ">
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
            <TableBody className="bg-gradient-to-b from-black via-black to-teal-600/10  text-center font-medium ">
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
      </div>
    </Card>
  );
}
