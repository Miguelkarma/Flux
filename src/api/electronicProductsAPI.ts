import { Product } from "./customElectronics";

export async function fetchElectronicsProducts(): Promise<Product[]> {
  try {
    // fetch
    const response = await fetch("https://dummyjson.com/products?limit=0");
    const data = await response.json();

    // filter
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

    return electronicsProducts;
  } catch (error) {
    console.error("Failed to fetch electronics products:", error);
    return []; // Return empty array if fetch fails
  }
}

export function generateUniqueSerialNumber(prefix: string = "ASSET"): string {
  // combine prefix with a timestamp and random number
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 10000);

  return `${prefix}-${timestamp}-${randomPart}`;
}
