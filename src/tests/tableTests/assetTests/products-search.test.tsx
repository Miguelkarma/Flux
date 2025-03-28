import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ElectronicsSearch from "@/components/SearchComponents/ProductsSearch";
import { fetchElectronicsProducts } from "@/api/electronicProductsAPI";

// Mock API and custom products
jest.mock("@/api/electronicProductsAPI", () => ({
  fetchElectronicsProducts: jest.fn(),
}));

jest.mock("@/api/customElectronics", () => ({
  customElectronicProducts: [
    {
      id: 1,
      title: "Custom Phone",
      description: "A cool phone",
      category: "mobile",
      price: 999,
      thumbnail: "/phone.jpg",
    },
    {
      id: 2,
      title: "Custom Laptop",
      description: "A fast laptop",
      category: "laptops",
      price: 1299,
      thumbnail: "/laptop.jpg",
    },
  ],
}));

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ open, onOpenChange, children }: any) => (
    <div data-testid="mock-dialog" data-open={open ? "true" : "false"}>
      {children}
      <button onClick={() => onOpenChange(false)}>Close</button>
    </div>
  ),
  DialogContent: ({ children }: any) => (
    <div data-testid="mock-dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
}));
describe("ElectronicsSearch Component", () => {
  const mockOnClose = jest.fn();
  const mockOnProductSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders and fetches products", async () => {
    (fetchElectronicsProducts as jest.Mock).mockResolvedValue([
      {
        id: 3,
        title: "API Phone",
        description: "From API",
        category: "mobile",
        price: 899,
        thumbnail: "/api-phone.jpg",
      },
    ]);

    render(
      <ElectronicsSearch
        isOpen={true}
        onClose={mockOnClose}
        onProductSelect={mockOnProductSelect}
      />
    );

    expect(
      screen.getByText("Loading electronics products...")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchElectronicsProducts).toHaveBeenCalled();
      expect(screen.getByText("API Phone")).toBeInTheDocument();
      expect(screen.getByText("Custom Phone")).toBeInTheDocument();
    });
  });

  test("handles API error and falls back to custom products", async () => {
    (fetchElectronicsProducts as jest.Mock).mockRejectedValue(
      new Error("API error")
    );

    render(
      <ElectronicsSearch
        isOpen={true}
        onClose={mockOnClose}
        onProductSelect={mockOnProductSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Custom Phone")).toBeInTheDocument();
      expect(screen.getByText("Custom Laptop")).toBeInTheDocument();
    });
  });

  test("filters products by search term", async () => {
    (fetchElectronicsProducts as jest.Mock).mockResolvedValue([]);

    render(
      <ElectronicsSearch
        isOpen={true}
        onClose={mockOnClose}
        onProductSelect={mockOnProductSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Custom Phone")).toBeInTheDocument();
      expect(screen.getByText("Custom Laptop")).toBeInTheDocument();
    });

    fireEvent.change(
      screen.getByPlaceholderText("Search electronics by name or description"),
      {
        target: { value: "Laptop" },
      }
    );

    expect(screen.queryByText("Custom Phone")).not.toBeInTheDocument();
    expect(screen.getByText("Custom Laptop")).toBeInTheDocument();
  });

  test("calls onProductSelect and onClose when product is selected", async () => {
    (fetchElectronicsProducts as jest.Mock).mockResolvedValue([]);

    render(
      <ElectronicsSearch
        isOpen={true}
        onClose={mockOnClose}
        onProductSelect={mockOnProductSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Custom Phone")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Custom Phone"));

    expect(mockOnProductSelect).toHaveBeenCalledWith({
      id: 1,
      title: "Custom Phone",
      description: "A cool phone",
      category: "mobile",
      price: 999,
      image: "/phone.jpg",
      thumbnail: "/phone.jpg",
    });

    expect(mockOnClose).toHaveBeenCalled();
  });
  test("displays 'No electronics products found' when filtered list is empty", async () => {
    (fetchElectronicsProducts as jest.Mock).mockResolvedValue([]);

    render(
      <ElectronicsSearch
        isOpen={true}
        onClose={mockOnClose}
        onProductSelect={mockOnProductSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Custom Phone")).toBeInTheDocument();
    });

    fireEvent.change(
      screen.getByPlaceholderText("Search electronics by name or description"),
      {
        target: { value: "Non-existent" },
      }
    );

    expect(
      screen.getByText("No electronics products found")
    ).toBeInTheDocument();
  });
});
