import { renderHook, act } from "@testing-library/react";
import { useDataTable } from "@/hooks/tableHooks/table-hook";
import * as reactTable from "@tanstack/react-table";

//mock react-table
jest.mock("@tanstack/react-table", () => ({
  ...jest.requireActual("@tanstack/react-table"),
  useReactTable: jest.fn(),
}));

describe("useDataTable", () => {
  const mockData = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
  ];

  const mockColumns = [{ id: "name", accessorKey: "name", header: "Name" }];

  const mockTable = {
    getPrePaginationRowModel: jest.fn().mockReturnValue({
      rows: [
        { id: "0", original: { id: "1" } },
        { id: "1", original: { id: "2" } },
      ],
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (reactTable.useReactTable as jest.Mock).mockReturnValue(mockTable);
  });

  test("initializes with correct default values", () => {
    const { result } = renderHook(() =>
      useDataTable({
        data: mockData,
        columns: mockColumns,
      })
    );

    expect(reactTable.useReactTable).toHaveBeenCalledWith(
      expect.objectContaining({
        data: mockData,
        columns: mockColumns,
        state: expect.objectContaining({
          pagination: expect.objectContaining({
            pageSize: 8,
            pageIndex: 0,
          }),
        }),
      })
    );

    expect(result.current.table).toBe(mockTable);
    expect(result.current.selectedRowIds).toEqual([]);
  });

  test("returns selected row ids", () => {
    const { result, rerender } = renderHook(() =>
      useDataTable({
        data: mockData,
        columns: mockColumns,
      })
    );

    // simulate row selection
    act(() => {
      result.current.setRowSelection({ "0": true });
    });

    rerender();

    expect(result.current.selectedRowIds).toEqual(["1"]);
  });
});
