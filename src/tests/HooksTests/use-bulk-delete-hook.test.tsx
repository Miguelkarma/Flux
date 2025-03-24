import { renderHook, act } from "@testing-library/react";
import { useBulkDelete } from "@/hooks/tableHooks/use-bulk-delete-hook";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "sonner";

// mock entire firebase module
jest.mock("@/firebase/firebase", () => ({
  db: {
    // provide a mock implementation of Firestore methods if needed
  },
}));

jest.mock("firebase/firestore", () => ({
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("useBulkDelete hook", () => {
  const mockOnDeleteSuccess = jest.fn();
  const mockIds = ["1", "2", "3"];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("initial state is correct", () => {
    const { result } = renderHook(() =>
      useBulkDelete({ collectionType: "it-assets" })
    );

    expect(result.current.isOpen).toBe(false);
    expect(result.current.isDeleting).toBe(false);
    expect(result.current.selectedIds).toEqual([]);
  });

  test("opens delete dialog with selected ids", () => {
    const { result } = renderHook(() =>
      useBulkDelete({ collectionType: "it-assets" })
    );

    act(() => {
      result.current.openDeleteDialog(mockIds);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.selectedIds).toEqual(mockIds);
  });

  test("closes delete dialog and resets state", () => {
    const { result } = renderHook(() =>
      useBulkDelete({ collectionType: "it-assets" })
    );

    act(() => {
      result.current.openDeleteDialog(mockIds);
      result.current.closeDeleteDialog();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedIds).toEqual([]);
  });

  test("handles bulk delete successfully", async () => {
    (doc as jest.Mock).mockReturnValue("mockDocRef");
    (deleteDoc as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useBulkDelete({
        collectionType: "it-assets",
        onDeleteSuccess: mockOnDeleteSuccess,
      })
    );

    act(() => {
      result.current.openDeleteDialog(mockIds);
    });

    await act(async () => {
      await result.current.handleBulkDelete();
    });

    expect(doc).toHaveBeenCalledTimes(3);
    expect(deleteDoc).toHaveBeenCalledTimes(3);
    expect(toast.success).toHaveBeenCalledWith(
      "3 asset(s) deleted successfully."
    );
    expect(mockOnDeleteSuccess).toHaveBeenCalled();
    expect(result.current.isOpen).toBe(false);
  });

  test("handles bulk delete error", async () => {
    (doc as jest.Mock).mockReturnValue("mockDocRef");
    (deleteDoc as jest.Mock).mockRejectedValue(new Error("delete failed"));

    const { result } = renderHook(() =>
      useBulkDelete({ collectionType: "it-assets" })
    );

    act(() => {
      result.current.openDeleteDialog(mockIds);
    });

    await act(async () => {
      await result.current.handleBulkDelete();
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Failed to delete assets. Please try again."
    );
    expect(result.current.isOpen).toBe(false);
  });
});
