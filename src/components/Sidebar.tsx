import { NavLink } from "react-router-dom";
import { Command, Laptop, Users, Banknote, ExternalLink } from "lucide-react";
import { useTheme } from "@/hooks/ThemeProvider";

interface StatusItemProps {
  label: string;
  value: number;
  color: string;
}

function StatusItem({ label, value, color }: StatusItemProps) {
  const getColor = () => {
    switch (color) {
      case "teal":
        return "from-teal-700 via-teal-600 to-cyan-400";
      case "amber":
        return "from-amber-700 via-amber-600 to-yellow-400";
      case "blue":
        return "from-blue-500 to-indigo-500";
      case "red":
        return "from-rose-700 via-rose-500 to-rose-400";
      default:
        return "from-cyan-500 to-blue-500";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-secondary-foreground">{label}</div>
        <div className="text-xs text-secondary-foreground">{value}%</div>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getColor()} rounded-full`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}

const items = [
  { title: "Dashboard", url: "/Dashboard", icon: Command },
  { title: "Assets", url: "/Assets", icon: Laptop },
  { title: "Employee", url: "/Employee", icon: Users },
  { title: "Exchange", url: "/Exchange", icon: Banknote },
  { title: "Coming Soon", url: "/ExternalAPI", icon: ExternalLink },
];

export default function Sidebar() {
  const { theme } = useTheme();

  return (
    <div
      className={`${theme} bg-sidebar-background border-sidebar-border text-sidebar-foreground
      backdrop-blur-sm h-full rounded-lg border p-4`}
    >
      <nav className="space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 
              ${isActive ? "active-state" : "inactive-state"}`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </NavLink>
        ))}
      </nav>

      {/* ASSET STATUS SECTION */}
      <div className="mt-8 pt-6 border-t border-sidebar-border">
        <div className="text-xs text-accent-foreground mb-2 font-semibold">
          ASSET STATUS
        </div>
        <div className="space-y-3">
          <StatusItem label="Active Assets" value={68} color="teal" />
          <StatusItem label="Maintenance" value={79} color="amber" />
          <StatusItem label="Retired" value={50} color="red" />
        </div>
      </div>
    </div>
  );
}
