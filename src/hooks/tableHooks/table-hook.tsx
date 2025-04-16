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
  ColumnDef,
} from "@tanstack/react-table";

interface UseDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  initialSorting?: SortingState;
  initialPageSize?: number;
}

export function useDataTable<TData>({
  data,
  columns,
  initialSorting = [],
  initialPageSize = 8,
}: UseDataTableProps<TData>) {
  // state management
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [pagination, setPagination] = React.useState({
    pageSize: initialPageSize,
    pageIndex: 0,
  });

  // refs for stable references
  const dataRef = React.useRef(data);
  const paginationRef = React.useRef(pagination);
  const rowSelectionRef = React.useRef(rowSelection);

  // update refs when props/state change
  React.useEffect(() => {
    dataRef.current = data;
  }, [data]);

  React.useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  React.useEffect(() => {
    rowSelectionRef.current = rowSelection;
  }, [rowSelection]);

  // reset pagination when needed
  React.useEffect(() => {
    const pageCount = Math.ceil(data.length / pagination.pageSize);
    if (pagination.pageIndex >= pageCount && pageCount > 0) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: pageCount - 1,
      }));
    }
  }, [data.length, pagination.pageSize, pagination.pageIndex]);

  // memoize table instance
  const table = useReactTable({
    data,
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
    // ensure consistent behavior with checkboxes
    enableRowSelection: true,
    // use same page index even if pages change
    manualPagination: false,
  });

  // preserve row selection on page changes
  React.useEffect(() => {
    if (Object.keys(rowSelectionRef.current).length > 0) {
      setRowSelection(rowSelectionRef.current);
    }
  }, [data]);

  // get selected row ids from all rows
  const selectedRowIds = React.useMemo(() => {
    return Object.keys(rowSelection)
      .map((index) => {
        const allRows = table.getPrePaginationRowModel().rows;
        const row = allRows.find((r) => r.id === index);
        return row ? (row.original as any).id : null;
      })
      .filter(Boolean);
  }, [table, rowSelection]);

  return {
    table,
    selectedRowIds,
    rowSelection,
    setRowSelection,
    pagination,
    setPagination,
  };
}
