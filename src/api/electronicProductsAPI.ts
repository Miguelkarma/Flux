import { Product } from "./customElectronics";

// Fetch Dummy JSON electronics products
export async function fetchElectronicsProducts(): Promise<Product[]> {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=0");
    const data = await response.json();

    // Filter for electronics
    const electronicsProducts = data.products.filter(
      (product: Product) =>
        product.category.toLowerCase().includes("electronics") ||
        [
          "smartphones",
          "laptops",
          "computer",
          "tablet",
          "mobile",
          "tech",
          "gadget",
          "electronic",
        ].some((keyword) => product.category.toLowerCase().includes(keyword))
    );

    // Fetch specs for each product and merge
    const productsWithSpecs = await Promise.all(
      electronicsProducts.map(async (product: Product) => {
        const specs = await fetchProductSpecs(product.title);
        return { ...product, specs };
      })
    );

    return productsWithSpecs;
  } catch (error) {
    console.error("Failed to fetch electronics products:", error);
    return [];
  }
}

// Fetch specs from Open Product Data API
async function fetchProductSpecs(title: string): Promise<string[]> {
  try {
    const specsResponse = await fetch(
      `https://api.product-open-data.com/electronics?name=${encodeURIComponent(
        title
      )}`
    );

    if (!specsResponse.ok) {
      throw new Error(`Failed to fetch specs for ${title}`);
    }

    const specsData = await specsResponse.json();

    if (specsData && specsData.products && specsData.products.length > 0) {
      return specsData.products[0].specifications || ["No specs available"];
    }

    return ["No specs available"];
  } catch (error) {
    console.error(`Failed to fetch specs for ${title}:`, error);
    return ["No specs available"];
  }
}

// Generate unique serial number
export function generateUniqueSerialNumber(prefix: string = "ASSET"): string {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 10000);
  return `${prefix}-${timestamp}-${randomPart}`;
}
