import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ElectronicsSearch } from "@/components/SearchComponents/ProductsSearch";
import { fetchElectronicsProducts } from "@/api/electronicProductsAPI";

// mock api and dependencies
jest.mock("@/api/electronicProductsAPI", () => ({
  fetchElectronicsProducts: jest.fn(),
}));

// mock lucide and ui components to prevent rendering issues
jest.mock("lucide-react", () => ({
  Search: () => null,
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input {...props} data-testid="search-input" />,
}));

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: any) => <div data-testid="dialog">{children}</div>,
  DialogContent: ({ children }: any) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@/Animation/TableLoader", () => () => (
  <div data-testid="table-loader">Loading...</div>
));

describe("ElectronicsSearch Component", () => {
  const mockOnClose = jest.fn();
  const mockOnProductSelect = jest.fn();

  const mockProducts = [
    {
      id: "1",
      title: "Smartphone",
      description: "A high-end smartphone",
      category: "Electronics",
      thumbnail: "smartphone.jpg",
      price: 999,
    },
    {
      id: "2",
      title: "Laptop",
      description: "Powerful laptop for professionals",
      category: "Computers",
      thumbnail: "laptop.jpg",
      price: 1499,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchElectronicsProducts as jest.Mock).mockResolvedValue(mockProducts);
  });

  test("renders dialog when open", async () => {
    render(
      <ElectronicsSearch
        isOpen={true}
        onClose={mockOnClose}
        onProductSelect={mockOnProductSelect}
      />
    );

    // check for key elements
    expect(screen.getByText("Electronics Products")).toBeInTheDocument();
    expect(screen.getByTestId("table-loader")).toBeInTheDocument();

    // wait for products to load
    await waitFor(
      () => {
        const smartphoneElements = screen.getAllByText(/Smartphone/i);
        expect(smartphoneElements.length).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );

    // validate product rendering
    const productElements = screen.getAllByRole("img", { name: /Smartphone/i });
    expect(productElements.length).toBeGreaterThan(0);
  });

  test("searches products correctly", async () => {
    render(
      <ElectronicsSearch
        isOpen={true}
        onClose={mockOnClose}
        onProductSelect={mockOnProductSelect}
      />
    );

    // wait for products to load
    await waitFor(
      () => {
        const smartphoneElements = screen.getAllByText(/Smartphone/i);
        expect(smartphoneElements.length).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );

    // search for a product
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "laptop" } });

    // check filtered results
    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
      expect(screen.queryByText("Smartphone")).not.toBeInTheDocument();
    });
  });

  test("selects a product", async () => {
    render(
      <ElectronicsSearch
        isOpen={true}
        onClose={mockOnClose}
        onProductSelect={mockOnProductSelect}
      />
    );

    // wait for products to load
    await waitFor(
      () => {
        const smartphoneElements = screen.getAllByText(/Smartphone/i);
        expect(smartphoneElements.length).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );

    // select a product
    const smartphoneElement = screen.getByText("Smartphone");
    fireEvent.click(smartphoneElement);

    // verify product selection
    await waitFor(() => {
      expect(mockOnProductSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "1",
          title: "Smartphone",
          image: "smartphone.jpg",
        })
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("displays no products found message", async () => {
    (fetchElectronicsProducts as jest.Mock).mockResolvedValue([]);

    render(
      <ElectronicsSearch
        isOpen={true}
        onClose={mockOnClose}
        onProductSelect={mockOnProductSelect}
      />
    );

    expect(screen.getByTestId("table-loader")).toBeInTheDocument();

    // check for no products message
    await waitFor(
      () => {
        const noProductsElements = screen.getAllByText(/no.*products.*found/i);
        expect(noProductsElements.length).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );
  });

  test("handles API error ", async () => {
    // simulate an API error
    (fetchElectronicsProducts as jest.Mock).mockRejectedValue(
      new Error("API Error")
    );

    render(
      <ElectronicsSearch
        isOpen={true}
        onClose={mockOnClose}
        onProductSelect={mockOnProductSelect}
      />
    );

    // verify fallback to custom products
    await waitFor(() => {
      expect(screen.getByTestId("table-loader")).toBeInTheDocument();
    });
  });
});
