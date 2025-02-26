import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSign,
  Package,
  Percent,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Assets Value",
    value: "$123,456",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Active Assets",
    value: "45",
    change: "+3",
    trend: "up",
    icon: Package,
  },
  {
    title: "ROI",
    value: "15.2%",
    change: "-2.1%",
    trend: "down",
    icon: Percent,
  },
  {
    title: "Asset Growth",
    value: "23.5%",
    change: "+4.3%",
    trend: "up",
    icon: TrendingUp,
  },
];

export function AssetOverview() {
  return (
    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs">
              {stat.trend === "up" ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                }
              >
                {stat.change}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
