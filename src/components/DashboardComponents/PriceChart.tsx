"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchElectronicsProducts } from "@/api/electronicProductsAPI";
import { Product } from "@/api/customElectronics";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function PriceChart() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await fetchElectronicsProducts();
        setData(products);
      } catch (err) {
        setError("Failed to fetch product data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const processData = () => {
    return data.map((product) => ({
      name:
        product.title.length > 15
          ? `${product.title.substring(0, 15)}...`
          : product.title,
      price: product.price,
      category: product.category,
    }));
  };

  if (loading) {
    return (
      <Card className="p-2 space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-64 w-full" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-2 text-center text-red-500 font-semibold">
        {error}
      </Card>
    );
  }

  return (
    <Card className="p-2 space-y-2 text-popover-foreground">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          All Products by Price
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={processData()}
              margin={{ top: 5, right: 20, left: 10, bottom: 50 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2d3748"
                opacity={0.3}
              />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 10, fill: "#64748b" }}
              />
              <YAxis
                tickFormatter={(value) => `$${value}`}
                width={60}
                tick={{ fill: "#64748b" }}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, "Price"]}
                labelFormatter={(label) => `Product: ${label}`}
                contentStyle={{ backgroundColor: "#1a202c", color: "#ffffff" }}
              />
              <Legend wrapperStyle={{ color: "#ffffff" }} />
              <Area
                type="monotone"
                dataKey="price"
                name="Product Price"
                fill="url(#colorPrice)"
                stroke="#0f766e"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

