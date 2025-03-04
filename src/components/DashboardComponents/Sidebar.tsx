import {
  Activity,
  Command,
  type LucideIcon,
  Settings,
  Laptop,
  Users,
  FileText,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatusItemProps {
  label: string;
  value: number;
  color: string;
}

function StatusItem({ label, value, color }: StatusItemProps) {
  const getColor = () => {
    switch (color) {
      case "cyan":
        return "from-cyan-500 to-blue-500";
      case "green":
        return "from-green-500 to-emerald-500";
      case "blue":
        return "from-blue-500 to-indigo-500";
      case "purple":
        return "from-purple-500 to-pink-500";
      default:
        return "from-cyan-500 to-blue-500";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-slate-400">{label}</div>
        <div className="text-xs text-slate-400">{value}%</div>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getColor()} rounded-full`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <div className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full rounded-lg border p-4">
      <nav className="space-y-2">
        <NavItem icon={Command} label="Dashboard" active />
        <NavItem icon={Laptop} label="Assets" />
        <NavItem icon={Users} label="Employees" />
        <NavItem icon={Activity} label="Maintenance" />
        <NavItem icon={ShoppingCart} label="Procurement" />
        <NavItem icon={FileText} label="Reports" />
        <NavItem icon={Settings} label="Settings" />
      </nav>

      <div className="mt-8 pt-6 border-t border-slate-700/50">
        <div className="text-xs text-slate-500 mb-2 font-mono">
          ASSET STATUS
        </div>
        <div className="space-y-3">
          <StatusItem label="Active Assets" value={92} color="green" />
          <StatusItem label="Maintenance" value={7} color="amber" />
          <StatusItem label="Retired" value={1} color="red" />
        </div>
      </div>
    </div>
  );
}

// Component for nav items
function NavItem({
  icon: Icon,
  label,
  active,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start ${
        active
          ? "bg-slate-800/70 text-cyan-400"
          : "text-slate-400 hover:text-slate-100"
      }`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
