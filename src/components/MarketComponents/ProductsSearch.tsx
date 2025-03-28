import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

import { Product, customElectronicProducts } from "@/api/customElectronics";
import { fetchElectronicsProducts } from "@/api/electronicProductsAPI";

interface ElectronicsSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSelect: (product: Product) => void;
}

export function ElectronicsSearch({
  isOpen,
  onClose,
  onProductSelect,
}: ElectronicsSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadElectronics = async () => {
      setIsLoading(true);
      try {
        // Fetch electronics from API
        const fetchedProducts = await fetchElectronicsProducts();

        // Combine fetched electronics with custom products
        const combinedProducts = [
          ...fetchedProducts,
          ...customElectronicProducts,
        ];

        setProducts(combinedProducts);
        setFilteredProducts(combinedProducts);
      } catch (error) {
        console.error("Error loading products:", error);
        // Fall back to custom products if anything goes wrong
        setProducts(customElectronicProducts);
        setFilteredProducts(customElectronicProducts);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadElectronics();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const handleProductSelect = (product: Product) => {
    onProductSelect({
      ...product,
      image: product.thumbnail,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[600px] flex flex-col text-popover-foreground">
        <DialogHeader>
          <DialogTitle>Electronics Products</DialogTitle>
          <DialogDescription>
            Browse and select electronics from Dummy JSON and custom products
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Search electronics by name or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
        />

        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            Loading electronics products...
          </div>
        ) : (
          <ScrollArea className="h-[400px] w-full pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 hover:bg-accent cursor-pointer flex flex-col items-center "
                  onClick={() => handleProductSelect(product)}
                >
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-24 h-24 object-contain mb-2 bg-white rounded-lg"
                  />
                  <h3 className="text-sm font-semibold text-center">
                    {product.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {product.category}
                  </p>
                  <p className="text-sm font-bold">${product.price}</p>
                </div>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center text-muted-foreground mt-4">
                No electronics products found
              </div>
            )}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ElectronicsSearch;
