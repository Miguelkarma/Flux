import axios from "axios";
import { Product } from "./customElectronics";

// fetch Dummy JSON electronics products
export async function fetchElectronicsProducts(): Promise<Product[]> {
  try {
    const response = await axios.get("https://dummyjson.com/products?limit=0");
    const data = response.data;

    // filter
    const electronicsProducts = data.products.filter(
      (product: Product) =>
        product.category.toLowerCase().includes("electronics") ||
        [
          "smartphones",
          "laptops",
          "computers",
          "tablet",
          "mobile",
          "tech",
          "gadget",
          "electronic",
          "keyboards",
          "monitor",
          "mouse",
          "printer",
          "server",
          "mobile-accessories",
        ].some((keyword) => product.category.toLowerCase().includes(keyword))
    );

    return electronicsProducts;
  } catch (error) {
    console.error("Failed to fetch electronics products:", error);
    return [];
  }
}

// Generate unique serial number
export function generateUniqueSerialNumber(prefix: string = "ASSET"): string {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 10000);
  return `${prefix}-${timestamp}-${randomPart}`;
}
