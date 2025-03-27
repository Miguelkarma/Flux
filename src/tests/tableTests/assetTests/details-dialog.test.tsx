import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssetDetailsDialog } from "@/components/AssetsComponents/AssetsDetailsDialog";

// Mock UI components
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open, onOpenChange }: any) =>
    open ? (
      <div data-testid="mock-dialog" onClick={() => onOpenChange(false)}>
        {children}
      </div>
    ) : null,
  DialogContent: ({ children }: any) => (
    <div data-testid="mock-dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
}));

jest.mock("@/components/ui/badge", () => ({
  Badge: ({ children, className }: any) => (
    <span data-testid={`mock-badge-${children}`} className={className}>
      {children}
    </span>
  ),
}));

jest.mock("@/components/ui/separator", () => ({
  Separator: () => <hr data-testid="mock-separator" />,
}));

describe("AssetDetailsDialog", () => {
  const assetMock = {
    id: "asset-123",
    serialNo: "123456",
    assetTag: "ASSET-001",
    type: "Laptop",
    customType: undefined,
    status: "Active",
    location: "Office A",
    assignedEmployee: "John Doe",
    dateAdded: "2023-01-01",
    productDetails: {
      title: "Dell XPS 15",
      description: "High-performance laptop for professionals.",
      category: "Computers",
      thumbnail: "https://example.com/image.jpg",
    },
  };

  test("renders asset details correctly when open", () => {
    const onOpenChangeMock = jest.fn();
    render(
      <AssetDetailsDialog
        asset={assetMock}
        isOpen={true}
        onOpenChange={onOpenChangeMock}
      />
    );

    // Verify dialog title and status
    expect(screen.getByText("Asset Details")).toBeInTheDocument();
    expect(screen.getByTestId("mock-badge-Active")).toBeInTheDocument();

    // Verify basic asset details
    expect(screen.getByText("123456")).toBeInTheDocument();
    expect(screen.getByText("ASSET-001")).toBeInTheDocument();
    expect(screen.getByText("Laptop")).toBeInTheDocument();

    // Verify product details
    expect(screen.getByText("Dell XPS 15")).toBeInTheDocument();
    expect(
      screen.getByText("High-performance laptop for professionals.")
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-badge-Computers")).toBeInTheDocument();

    // Verify image
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
    expect(image).toHaveAttribute("alt", "Dell XPS 15");
  });

  test("does not render content when closed", () => {
    render(
      <AssetDetailsDialog
        asset={assetMock}
        isOpen={false}
        onOpenChange={jest.fn()}
      />
    );

    expect(screen.queryByText("Asset Details")).not.toBeInTheDocument();
  });

  test("calls onOpenChange when dialog is closed", async () => {
    const onOpenChangeMock = jest.fn();
    render(
      <AssetDetailsDialog
        asset={assetMock}
        isOpen={true}
        onOpenChange={onOpenChangeMock}
      />
    );

    // Close dialog
    const mockDialog = screen.getByTestId("mock-dialog");
    await userEvent.click(mockDialog);

    expect(onOpenChangeMock).toHaveBeenCalledTimes(1);
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  test("renders custom type when type is 'Other'", () => {
    const assetWithCustomType = {
      ...assetMock,
      type: "Other",
      customType: "Special Equipment",
    };

    render(
      <AssetDetailsDialog
        asset={assetWithCustomType}
        isOpen={true}
        onOpenChange={jest.fn()}
      />
    );

    expect(screen.getByText("Other (Special Equipment)")).toBeInTheDocument();
  });

  test("handles missing product details gracefully", () => {
    const assetWithoutProductDetails = {
      ...assetMock,
      productDetails: undefined,
    };

    render(
      <AssetDetailsDialog
        asset={assetWithoutProductDetails}
        isOpen={true}
        onOpenChange={jest.fn()}
      />
    );

    // Verify dialog renders without errors
    expect(screen.getByText("Asset Details")).toBeInTheDocument();
  });
});
