import {
  Computer,
  HardDrive,
  Laptop,
  BarChart3,
  LineChart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend: "up" | "down" | "stable";
  color: string;
  detail: string;
  isPercentage?: boolean;
}

function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
  detail,
  isPercentage = false,
}: MetricCardProps) {
  const getColor = () => {
    switch (color) {
      case "cyan":
        return "from-red-600 to-red-800 border-cyan-500/30";
      case "teal":
        return "from-teal-600 to-teal-800 border-teal-500/30";
      case "green":
        return "from-green-500 to-emerald-500 border-green-500/30";
      case "amber":
        return "from-amber-500 to-amber-500 border-amber-500/30";
      case "purple":
        return "from-purple-500 to-pink-500 border-purple-500/30";
      default:
        return "from-cyan-500 to-blue-500 border-cyan-500/30";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <BarChart3 className="h-4 w-4 text-amber-500" />;
      case "down":
        return <BarChart3 className="h-4 w-4 rotate-180 text-green-500" />;
      case "stable":
        return <LineChart className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`bg-slate-800/50 rounded-lg border ${getColor()} p-4 relative overflow-hidden`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-400">{title}</div>
        <Icon className={`h-5 w-5 text-${color}-500`} />
      </div>
      <div className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent from-slate-100 to-slate-300">
        {value}
        {isPercentage ? "%" : ""}
      </div>
      <div className="text-xs text-slate-500">{detail}</div>
      <div className="absolute bottom-2 right-2 flex items-center">
        {getTrendIcon()}
      </div>
      <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-cyan-500 to-blue-500"></div>
    </div>
  );
}

export default function AssetSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        title="Total Assets"
        value={248}
        icon={Computer}
        trend="up"
        color="purple"
        detail="12 added this month"
      />
      <MetricCard
        title="Active Assets"
        value={215}
        icon={Laptop}
        trend="stable"
        color="green"
        detail="86.7% of total assets"
      />
      <MetricCard
        title="Maintenance"
        value={18}
        icon={HardDrive}
        trend="down"
        color="amber"
        detail="7.3% of total assets"
      />
    </div>
  );
}
