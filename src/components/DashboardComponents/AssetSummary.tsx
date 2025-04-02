import { useEffect, useState } from "react";
import {
  Computer,
  HardDrive,
  Laptop,
  BarChart3,
  LineChart,
  Users,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useAuth } from "@/hooks/use-auth";

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
        return "from-cyan-500 to-blue-500 border-cyan-500/30";
      case "green":
        return "from-green-500 to-emerald-500 border-green-500/30 shadow-md shadow-emerald-500 shadow-popover-foreground ";
      case "blue":
        return "from-blue-500 to-indigo-500 border-blue-500/30 shadow-md shadow-cyan-500 shadow-popover-foreground ";
      case "purple":
        return "from-purple-500 to-pink-500 border-purple-500/30 shadow-md shadow-purple-500 shadow-popover-foreground ";
      case "amber":
        return "from-amber-500 to-amber-500 border-amber-500/30  shadow-md shadow-amber-500 shadow-popover-foreground";
      case "teal":
        return "from-teal-600 to-teal-800 border-teal-500/30  shadow-md shadow-teal-500 shadow-popover-foreground";
      default:
        return "from-cyan-500 to-blue-500 border-cyan-500/30";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <BarChart3 className="h-4 w-4 text-amber-500" />;
      case "down":
        return <BarChart3 className="h-4 w-4 rotate-180 text-blue-500" />;
      case "stable":
        return <LineChart className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`bg-[hsl(var(--secondary))] rounded-lg border ${getColor()} p-4 relative overflow-hidden `}
    >
      <div className="flex items-center justify-between mb-2 ">
        <div className="text-sm text-popover-foreground">{title}</div>
        <Icon className={`h-5 w-5 text-${color}-500`} />
      </div>
      <div className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-popover-foreground from-slate-100 to-slate-300 ">
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
  const { user } = useAuth();
  const [assetsData, setAssetsData] = useState({
    total: 0,
    active: 0,
    maintenance: 0,
    recentlyAdded: 0,
  });
  const [employeesData, setEmployeesData] = useState({
    active: 0,
    onLeave: 0,
  });

  // calculate percentages
  const activePercentage =
    assetsData.total > 0
      ? Math.round((assetsData.active / assetsData.total) * 100 * 10) / 10
      : 0;
  const maintenancePercentage =
    assetsData.total > 0
      ? Math.round((assetsData.maintenance / assetsData.total) * 100 * 10) / 10
      : 0;

  useEffect(() => {
    if (!user) return;

    // fetch assets data
    const assetsQuery = query(
      collection(db, "it-assets"),
      where("userId", "==", user.uid)
    );
    const unsubscribeAssets = onSnapshot(assetsQuery, (snapshot) => {
      const currentDate = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(currentDate.getDate() - 30);

      let total = 0;
      let active = 0;
      let maintenance = 0;
      let recentlyAdded = 0;

      snapshot.forEach((doc) => {
        const assetData = doc.data();
        total++;

        if (assetData.status === "Active") active++;
        else if (assetData.status === "Maintenance") maintenance++;

        if (
          assetData.dateAdded &&
          new Date(
            assetData.dateAdded.toDate
              ? assetData.dateAdded.toDate()
              : assetData.dateAdded
          ) >= thirtyDaysAgo
        ) {
          recentlyAdded++;
        }
      });

      setAssetsData({ total, active, maintenance, recentlyAdded });
    });

    // fetch employees data
    const employeesQuery = query(
      collection(db, "employees"),
      where("userId", "==", user.uid)
    );
    const unsubscribeEmployees = onSnapshot(employeesQuery, (snapshot) => {
      let active = 0;
      let onLeave = 0;

      snapshot.forEach((doc) => {
        const employeeData = doc.data();
        if (employeeData.status === "Active") active++;
        else if (employeeData.status === "On Leave") onLeave++;
      });

      setEmployeesData({ active, onLeave });
    });

    return () => {
      unsubscribeAssets();
      unsubscribeEmployees();
    };
  }, [user]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* first row - asset metrics */}
      <MetricCard
        title="Total Assets"
        value={assetsData.total}
        icon={Computer}
        trend="up"
        color="purple"
        detail={`${assetsData.recentlyAdded} added this month`}
      />
      <MetricCard
        title="Active Assets"
        value={assetsData.active}
        icon={Laptop}
        trend="stable"
        color="green"
        detail={`${activePercentage}% of total assets`}
      />
      <MetricCard
        title="Maintenance"
        value={assetsData.maintenance}
        icon={HardDrive}
        trend="down"
        color="amber"
        detail={`${maintenancePercentage}% of total assets`}
      />

      {/* second row - employee metrics */}
      <div className="md:col-span-3 flex justify-center gap-6">
        <div className="w-full md:w-1/3">
          <MetricCard
            title="Active Employees"
            value={employeesData.active}
            icon={UserCheck}
            trend="up"
            color="blue"
            detail="Working"
          />
        </div>
        <div className="w-full md:w-1/3">
          <MetricCard
            title="On Leave"
            value={employeesData.onLeave}
            icon={Users}
            trend="down"
            color="teal"
            detail="Temporary absence"
          />
        </div>
      </div>
    </div>
  );
}
