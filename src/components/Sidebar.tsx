import { NavLink } from "react-router-dom";
import { Command, Laptop, Users, Banknote, ExternalLink } from "lucide-react";
import { useTheme } from "@/hooks/ThemeProvider";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

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
        <div className="text-xs text-secondary-foreground font-bold">
          {value}
        </div>
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
  const [statusCounts, setStatusCounts] = useState({
    active: 0,
    maintenance: 0,
    retired: 0,
    available: 0,
    lost: 0,
    total: 0,
  });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchAssetStatus(currentUser.uid);
      } else {
        setUser(null);
        console.log("User is not authenticated");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAssetStatus = async (uid: string) => {
    try {
      console.log("Fetching asset status for UID:", uid);

      const assetsQuery = query(
        collection(db, "it-assets"),
        where("userId", "==", uid)
      );

      const querySnapshot = await getDocs(assetsQuery);

      if (querySnapshot.empty) {
        console.warn("No assets found for this user. Check Firestore data.");
      } else {
        console.log("Number of assets found:", querySnapshot.size);
      }

      let active = 0,
        maintenance = 0,
        retired = 0,
        available = 0,
        lost = 0,
        total = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Fetched asset data:", data);

        total++;

        switch (data.status) {
          case "Active":
            active++;
            break;
          case "Maintenance":
            maintenance++;
            break;
          case "Retired":
            retired++;
            break;
          case "Available":
            available++;
            break;
          case "Lost":
            lost++;
            break;

          default:
            break;
        }
      });

      setStatusCounts({
        active,
        maintenance,
        retired,
        available,
        lost,
        total,
      });
    } catch (error) {
      console.error("Error fetching asset status:", error);
    }
  };
  return (
    <div
      className={`${theme} bg-sidebar-background border-sidebar-border text-sidebar-foreground
      backdrop-blur-sm h-full rounded-lg border p-4`}
    >
      <nav className="space-y-2 bg-sidebar-background">
        {items.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) =>
              `relative flex items-center gap-2 p-2 rounded-full transition-all hover-active-state-alt ${
                isActive ? "active-state-alt" : "inactive-state"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </NavLink>
        ))}
      </nav>

      {/* ASSET STATUS SECTION */}
      {user ? (
        <div className="mt-8 pt-6 border-t border-sidebar-border">
          <div className="text-xs text-accent-foreground mb-2 font-semibold">
            ASSET STATUS
          </div>
          <div className="space-y-3">
            <StatusItem
              label="Active Assets"
              value={statusCounts.active}
              color="teal"
            />
            <StatusItem
              label="Maintenance"
              value={statusCounts.maintenance}
              color="amber"
            />
            <StatusItem
              label="Retired"
              value={statusCounts.retired}
              color="red"
            />
            <StatusItem
              label="Available"
              value={statusCounts.available}
              color="red"
            />
            <StatusItem
              label="Lost/Stolen"
              value={statusCounts.lost}
              color="red"
            />
          </div>
        </div>
      ) : (
        <div className="mt-8 pt-6 border-t border-sidebar-border text-xs text-red-500">
          Please log in to view asset status.
        </div>
      )}
    </div>
  );
}
