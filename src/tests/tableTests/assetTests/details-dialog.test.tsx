import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssetDetailsDialog } from "@/components/SearchComponents/AssetsDetailsDialog";
import { FirestoreData } from "@/components/AssetsComponents/columns";

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

// Mock Lucide icons
jest.mock("lucide-react", () => ({
  Waypoints: () => <div data-testid="mock-waypoints-icon" />,
  FileText: () => <div data-testid="mock-filetext-icon" />,
}));

describe("AssetDetailsDialog", () => {
  const assetMock: FirestoreData = {
    id: "asset-123",
    serialNo: "123456",
    assetTag: "ASSET-001",
    type: "Laptop",
    customType: undefined,
    status: "Active",
    location: "Office A",
    assignedEmployee: "John Doe",
    dateAdded: "2023-01-01",
    model: "XPS 15",
    description: "Company laptop for professional use",
    productDetails: {
      title: "Dell XPS 15",
      description: "Company laptop for professional use",
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

    // More flexible checks
    expect(screen.getByText(/ASSET-001/)).toBeInTheDocument();
    expect(screen.getByText(/123456/)).toBeInTheDocument();

    // Check for Laptop text and badge
    expect(screen.getAllByText(/Laptop/)[0]).toBeInTheDocument();

    const laptopBadge = screen.getByTestId("mock-badge-Laptop");
    expect(laptopBadge).toBeInTheDocument();

    // Verify product details with more flexible matching
    expect(screen.getByText(/Dell XPS 15/)).toBeInTheDocument();

    // Check description more flexibly
    expect(screen.getByText("Dell XPS 15")).toBeInTheDocument();
    expect(
      screen.getByText("Company laptop for professional use")
    ).toBeInTheDocument();

    expect(screen.getByTestId("mock-badge-Laptop")).toBeInTheDocument();

    // Verify image
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
    expect(image).toHaveAttribute("alt", "Dell XPS 15");
  });

  test("renders default Waypoints icon when no thumbnail", () => {
    const assetWithoutThumbnail = {
      ...assetMock,
      productDetails: {
        ...assetMock.productDetails,
        thumbnail: undefined,
      },
    };

    render(
      <AssetDetailsDialog
        asset={assetWithoutThumbnail}
        isOpen={true}
        onOpenChange={jest.fn()}
      />
    );

    expect(screen.getByTestId("mock-waypoints-icon")).toBeInTheDocument();
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

  test("renders description section", () => {
    const assetWithDescription = {
      ...assetMock,
      description: "Company-owned asset for work purposes",
    };

    render(
      <AssetDetailsDialog
        asset={assetWithDescription}
        isOpen={true}
        onOpenChange={jest.fn()}
      />
    );

    expect(screen.getByTestId("mock-filetext-icon")).toBeInTheDocument();
    expect(
      screen.getByText("Company-owned asset for work purposes")
    ).toBeInTheDocument();
  });
});
