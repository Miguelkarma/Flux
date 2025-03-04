import { NavLink } from "react-router-dom";
import { Command, Laptop, Users, Banknote, ExternalLink } from "lucide-react";


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
      case "amber":
        return "from-amber-500 to-yellow-500";
      case "red":
        return "from-red-500 to-rose-500";
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

// Navigation items
const items = [
  { title: "Dashboard", url: "/Dashboard", icon: Command },
  { title: "Assets", url: "/Assets", icon: Laptop },
  { title: "Employee", url: "/Employee", icon: Users },
  { title: "Exchange", url: "/Exchange", icon: Banknote },
  { title: "Coming Soon", url: "/ExternalAPI", icon: ExternalLink },
];

export default function Sidebar() {
  return (
    <div className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full rounded-lg border p-4">
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

