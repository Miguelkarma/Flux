export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
  image?: string;
}

export const customElectronicProducts: Product[] = [
  {
    id: 10001,
    title: "Wireless Gaming Mouse",
    price: 79.99,
    description: "High-precision wireless gaming mouse with RGB lighting",
    category: "mouse",
    thumbnail:
      "https://gameone.ph/media/catalog/product/cache/d378a0f20f83637cdb1392af8dc032a2/1/_/1_6_2.jpg",
  },
  {
    id: 10002,
    title: "Mechanical Keyboard",
    price: 129.99,
    description: "Mechanical keyboard with blue switches and customizable RGB",
    category: "keyboards",
    thumbnail: "/api/placeholder/150/150",
  },
  {
    id: 10003,
    title: "Ergonomic Wireless Mouse",
    price: 59.99,
    description: "Comfortable wireless mouse with adjustable DPI",
    category: "mouse",
    thumbnail: "/api/placeholder/150/150",
  },
  {
    id: 10004,
    title: "Compact Mechanical Keyboard",
    price: 89.99,
    description: "Compact 60% mechanical keyboard with programmable keys",
    category: "keyboards",
    thumbnail: "/api/placeholder/150/150",
  },
  {
    id: 10005,
    title: "Server",
    price: 200.99,
    description: "A server",
    category: "server",
    thumbnail: "/api/placeholder/150/150",
  },
  {
    id: 10244,
    title: "Epson",
    price: 200.99,
    description: "A Printer",
    category: "printer",
    thumbnail: "/api/placeholder/150/150",
  },
  {
    id: 11242,
    title: "NVIDIA",
    price: 200.99,
    description: "A 144 hz monitor",
    category: "monitor",
    thumbnail: "/api/placeholder/150/150",
  },
];
