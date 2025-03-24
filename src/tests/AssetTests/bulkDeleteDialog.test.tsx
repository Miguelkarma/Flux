import "@testing-library/jest-dom";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { BulkDeleteComponent } from "@/components/AssetsComponents/BulkDeleteDialog";

import { deleteDoc } from "firebase/firestore";

// Mock Firebase Firestore functions
jest.mock("firebase/firestore", () => ({
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  getFirestore: jest.fn(() => ({})),
}));
jest.mock("lucide-react", () => ({
  X: () => "MockedXIcon",
}));
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({})),
}));
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
}));

describe("BulkDeleteComponent", () => {
  const selectedRowIds = ["1", "2", "3"];
  const clearSelection = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <BulkDeleteComponent
        selectedRowIds={selectedRowIds}
        clearSelection={clearSelection}
      />
    );
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("opens the dialog when DeleteButton is clicked", async () => {
    render(
      <BulkDeleteComponent
        selectedRowIds={selectedRowIds}
        clearSelection={clearSelection}
      />
    );

    const deleteButton = await screen.findByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(
      await screen.findByText(`Delete ${selectedRowIds.length} asset(s)?`)
    ).toBeInTheDocument();
  });

  it("calls handleBulkDelete and closes the dialog when Delete is clicked", async () => {
    render(
      <BulkDeleteComponent
        selectedRowIds={selectedRowIds}
        clearSelection={clearSelection}
      />
    );

    // Open the dialog
    fireEvent.click(await screen.findByRole("button", { name: /delete/i }));
    await screen.findByText(`Delete ${selectedRowIds.length} asset(s)?`);

    // Click the delete button inside the dialog
    const confirmDeleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(confirmDeleteButton);

    // Wait for delete function to be called
    await waitFor(() =>
      expect(deleteDoc).toHaveBeenCalledTimes(selectedRowIds.length)
    );
    await waitFor(() => expect(clearSelection).toHaveBeenCalled());

    // Ensure the dialog is closed
    expect(
      screen.queryByText(`Delete ${selectedRowIds.length} asset(s)?`)
    ).not.toBeInTheDocument();
  });

  it("closes the dialog when Cancel is clicked", async () => {
    render(
      <BulkDeleteComponent
        selectedRowIds={selectedRowIds}
        clearSelection={clearSelection}
      />
    );

    fireEvent.click(await screen.findByRole("button", { name: /delete/i }));
    await screen.findByText(`Delete ${selectedRowIds.length} asset(s)?`);

    fireEvent.click(screen.getByText(/cancel/i));

    expect(
      screen.queryByText(`Delete ${selectedRowIds.length} asset(s)?`)
    ).not.toBeInTheDocument();
  });
});
