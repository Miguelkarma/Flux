import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssetSearch } from "@/components/SearchComponents/AssetSearch";
import { fetchElectronicsProducts } from "@/api/electronicProductsAPI";
import { Product } from "@/api/customElectronics";


// mock lucide-react icons
jest.mock("lucide-react", () => ({
  Search: () => <div data-testid="search-icon">Search Icon</div>,
}));


jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogClose: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));


jest.mock("@/api/electronicProductsAPI", () => ({
  fetchElectronicsProducts: jest.fn(),
}));

jest.mock("@/api/customElectronics", () => ({
  customElectronicProducts: [
    {
      id: 1,
      title: "Test Product 1",
      description: "Test description 1",
      category: "Laptop",
      price: 999,
      thumbnail: "/test-image-1.jpg",
    },
    {
      id: 2,
      title: "Test Product 2",
      description: "Test description 2",
      category: "Phone",
      price: 699,
      thumbnail: "/test-image-2.jpg",
    },
  ],
}));

// mock AssetDetailsDialog component
jest.mock("@/components/SearchComponents/AssetsDetailsDialog", () => ({
  AssetDetailsDialog: ({ asset, isOpen, onOpenChange }: { asset: any, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    return isOpen ? (
      <div data-testid="asset-dialog">
        <p>Asset: {asset?.productDetails?.title}</p>
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    ) : null;
  },
}));

describe("AssetSearch Component", () => {
  const mockedFetchedProducts: Product[] = [
    {
      id: 3,
      title: "Fetched Product",
      description: "Fetched description",
      category: "Monitor",
      price: 299,
      thumbnail: "/fetched-image.jpg",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchElectronicsProducts as jest.Mock).mockResolvedValue(
      mockedFetchedProducts
    );
  });

  test("renders search input and fetches products on mount", async () => {
    render(<AssetSearch />);

    expect(screen.getByPlaceholderText("Search assets...")).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchElectronicsProducts).toHaveBeenCalledTimes(1);
    });
  });

  test("filters products when searching and shows results", async () => {
    render(<AssetSearch />);

    await waitFor(() => {
      expect(fetchElectronicsProducts).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText("Search assets...");

    // test custom products search
    await act(async () => {
      await userEvent.type(searchInput, "Test");
    });

    await waitFor(() => {
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
      expect(screen.getByText("Test Product 2")).toBeInTheDocument();
      expect(screen.queryByText("Fetched Product")).not.toBeInTheDocument();
    });

    // test fetched products search
    await act(async () => {
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "Fetched");
    });

    await waitFor(() => {
      expect(screen.getByText("Fetched Product")).toBeInTheDocument();
      expect(screen.queryByText("Test Product 1")).not.toBeInTheDocument();
    });
  });

  test("opens dialog when product is clicked and clears search", async () => {
    // setup mock implementation of AssetSearch component
    render(<AssetSearch />);

    await waitFor(() => {
      expect(fetchElectronicsProducts).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText("Search assets...");

    // type in search box
    await act(async () => {
      await userEvent.type(searchInput, "Test");
    });


    const testProduct = await screen.findByText("Test Product 1");
    expect(testProduct).toBeInTheDocument();


    fireEvent.click(testProduct);

 
    expect(screen.getByTestId("asset-dialog")).toBeInTheDocument();
    expect(screen.getByText(/Asset: Test Product 1/i)).toBeInTheDocument();

    expect(searchInput).toHaveValue("");
  });

  test("handles API fetch error", async () => {
    (fetchElectronicsProducts as jest.Mock).mockRejectedValue(
      new Error("API Error")
    );
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<AssetSearch />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error loading products:",
        expect.any(Error)
      );
    });

    // fallback to custom products
    const searchInput = screen.getByPlaceholderText("Search assets...");
    await act(async () => {
      await userEvent.type(searchInput, "Test");
    });

    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });
});
