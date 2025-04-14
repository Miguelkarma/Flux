import { useEffect, useState } from "react";
import { ArrowUpIcon, ArrowDownIcon, RefreshCwIcon } from "lucide-react";
import { customElectronicProducts, Product } from "@/api/customElectronics";
import { fetchElectronicsProducts } from "@/api/electronicProductsAPI";

type MarketProduct = Product & { change: number };

function MarketPriceTracker() {
  const [prices, setPrices] = useState<MarketProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  // Add price change data to products
  const addPriceChangeData = (products: Product[]): MarketProduct[] => {
    return products.map((product) => ({
      ...product,
      change: parseFloat((Math.random() * 6 - 3).toFixed(1)), // -3% to +3% change
    }));
  };

  const loadData = async () => {
    setLoading(true);

    try {
      // Get all custom products
      let productsData: Product[] = [...customElectronicProducts];

      // Fetch all products from DummyJSON API
      const apiProducts = await fetchElectronicsProducts();
      productsData = [...productsData, ...apiProducts];

      const productsWithChange = addPriceChangeData(productsData);
      setPrices(productsWithChange);
    } catch (error) {
      console.error("Error loading product data:", error);
      // Fallback to custom data if API fails
      const fallbackData = addPriceChangeData(customElectronicProducts);
      setPrices(fallbackData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();

    // Simulate price updates
    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((item) => {
          // Calculate new price with small random change
          const priceChange = item.price * (Math.random() * 0.02 - 0.01); // -1% to +1%
          const newPrice = parseFloat((item.price + priceChange).toFixed(2));

          // Calculate new change percentage
          const newChange = parseFloat(
            (item.change + (Math.random() * 1 - 0.5)).toFixed(1)
          );

          // Keep change
          const boundedChange = Math.max(Math.min(newChange, 5), -5);

          return {
            ...item,
            price: newPrice,
            change: boundedChange,
          };
        })
      );
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Filter products by category
  const filteredProducts =
    category === "all"
      ? prices
      : prices.filter((product) => product.category === category);

  // Get unique categories from the data
  const categories = [
    "all",
    ...new Set(prices.map((product) => product.category)),
  ];

  return (
    <div className="bg-[hsl(var(--secondary))] rounded-lg border p-4 relative overflow-hidden shadow shadow-popover-foreground">
      <div className=" rounded-xl p-4 h-full text-foreground">
        <div className="flex justify-between items-center mb-3 ">
          <h3 className="text-lg font-semibold ">Equipment Market Prices</h3>
          <div className="flex gap-2">
            <select
              className="bg-[hsl(var(--secondary))] text-popover-foreground text-xs rounded-md border border-gray-700 p-1"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <button
              onClick={handleRefresh}
              className="bg-[hsl(var(--secondary))] text-popover-foreground p-1 rounded-md border border-gray-700"
              disabled={refreshing}
            >
              <RefreshCwIcon
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b border-gray-700 pb-2"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-black/40 rounded overflow-hidden mr-2">
                      <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 ">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate max-w-[120px]">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono">
                      ${item.price.toFixed(2)}
                    </p>
                    <p
                      className={`text-xs flex items-center justify-end ${
                        item.change >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {item.change >= 0 ? (
                        <ArrowUpIcon size={12} />
                      ) : (
                        <ArrowDownIcon size={12} />
                      )}
                      {Math.abs(item.change)}%
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-400">
                No products found for selected category
              </div>
            )}
          </div>
        )}
        <div className="mt-3 pt-2 border-t border-gray-700 flex justify-between items-center">
          <p className="text-xs text-gray-400">Market data for IT assets</p>
          <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-gradient-to-r opacity-20 blur-xl from-cyan-500 to-blue-500"></div>
          <p className="text-xs text-popover-foreground">
            {filteredProducts.length} items
          </p>
        </div>
      </div>
    </div>
  );
}

export default MarketPriceTracker;
