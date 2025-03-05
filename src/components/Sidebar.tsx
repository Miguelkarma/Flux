import { NavLink } from "react-router-dom";
import { Command, Laptop, Users, Banknote, ExternalLink } from "lucide-react";

interface StatusItemProps {
  label: string;
  value: number;
  colorVar: string;
}

function StatusItem({ label, value, colorVar }: StatusItemProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{value}%</div>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            backgroundColor: `hsl(var(${colorVar}))`,
          }}
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
  return (
    <div className="bg-[var(--sidebar-background)] border-sidebar-border backdrop-blur-sm h-full rounded-lg border p-4">
      <nav className="space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 
              ${
                isActive
                  ? "bg-slate-800/70 text-teal-400"
                  : "text-slate-400 hover:text-slate-100"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </NavLink>
        ))}
      </nav>
      <div className="mt-8 pt-6 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground mb-2 font-mono">
          ASSET STATUS
        </div>
        <div className="space-y-3">
          <StatusItem label="Active Assets" value={68} colorVar="--chart-1" />
          <StatusItem label="Maintenance" value={7} colorVar="--chart-2" />
          <StatusItem label="Retired" value={1} colorVar="--chart-5" />
        </div>
      </div>
    </div>
  );
}
