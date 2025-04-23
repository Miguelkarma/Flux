import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Product, customElectronicProducts } from "@/api/customElectronics";
import { fetchElectronicsProducts } from "@/api/electronicProductsAPI";
import { AssetDetailsDialog } from "./AssetsDetailsDialog";

export function AssetSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Combine custom products with fetched products
        const fetchedProducts = await fetchElectronicsProducts();
        const allProducts = [...customElectronicProducts, ...fetchedProducts];
        setProducts(allProducts);
      } catch (error) {
        console.error("Error loading products:", error);
        // Fallback to just custom products
        setProducts(customElectronicProducts);
      }
    };

    loadProducts();
  }, []);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts([]);
      setShowResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );

    setFilteredProducts(filtered.slice(0, 5));
    setShowResults(true);
  }, [searchQuery, products]);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProductClick = (product: Product) => {
    // Convert product to asset format for the dialog
    const assetData = {
      id: product.id.toString(),
      type: product.category,
      status: "Available",
      productDetails: product,
      description: product.description,
    };

    setSelectedAsset(assetData);
    setDialogOpen(true);
    setShowResults(false);
    setSearchQuery("");
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex items-center space-x-1 bg-secondary rounded-full px-2 sm:px-3 py-1.5 border border-slate-700/50 backdrop-blur-sm shadow-md shadow-popover-foreground">
        <Search className="h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search assets..."
          className="bg-transparent border-none focus:outline-none text-xs sm:text-sm w-24 max-sm:w-[5em] sm:w-[12em] md:w-40 placeholder:text-slate-500 text-popover-foreground"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (filteredProducts.length > 0) {
              setShowResults(true);
            }
          }}
        />
      </div>

      {showResults && filteredProducts.length > 0 && (
        <div className="absolute mt-2 w-48 sm:w-56 md:w-64 max-h-80 overflow-y-auto bg-card rounded-md shadow-lg border border-slate-700/50 z-50 text-popover-foreground">
          <ul className="py-1">
            {filteredProducts.map((product) => (
              <li
                key={product.id}
                className="px-2 sm:px-4 py-2 hover:bg-secondary cursor-pointer flex items-center gap-1 sm:gap-2"
                onClick={() => handleProductClick(product)}
              >
                {product.thumbnail && (
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-6 h-6 sm:w-8 sm:h-8 object-contain rounded-sm"
                  />
                )}
                <div>
                  <p className="text-xs sm:text-sm font-medium truncate">
                    {product.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden xs:block">
                    {product.category}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedAsset && (
        <AssetDetailsDialog
          asset={selectedAsset}
          isOpen={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  );
}
