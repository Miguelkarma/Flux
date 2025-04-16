import { NavLink } from "react-router-dom";
import { Command, Laptop, Users } from "lucide-react";
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
      case "emerald":
        return "from-emerald-800 via-emerald-600 to-emerald-400";
      case "amber":
        return "from-amber-700 via-amber-600 to-yellow-400";
      case "blue":
        return "from-sky-500 to-cyan-400  to-cyan-400";
      case "gray":
        return "from-indigo-500 via-violet-400 to-purple-400";
      case "red":
        return "from-rose-700 via-rose-500 to-rose-400";
      case "employees":
        return "from-cyan-teal via-teal-600 to-teal-400";
      default:
        return "from-cyan-600 via-cyan-500 to-teal-400";
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
  { title: "Dashboard", url: "/dashboard", icon: Command },
  { title: "Assets", url: "/assets", icon: Laptop },
  { title: "Employee", url: "/employee", icon: Users },
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
  const [allAssets, setAllAssets] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [totalEmployees, setTotalEmployees] = useState(0);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchAssetStatus(currentUser.uid);
        await fetchEmployeeCount(currentUser.uid);
      } else {
        setUser(null);
        console.log("User is not authenticated");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchEmployeeCount = async (uid: string) => {
    try {
      console.log("Fetching employee count for UID:", uid);

      const employeesQuery = query(
        collection(db, "employees"),
        where("userId", "==", uid)
      );

      const querySnapshot = await getDocs(employeesQuery);

      if (querySnapshot.empty) {
        console.warn("No employees found for this user. Check Firestore data.");
        setTotalEmployees(0);
      } else {
        const employeeCount = querySnapshot.size;
        console.log("Number of employees found:", employeeCount);
        setTotalEmployees(employeeCount);
      }
    } catch (error) {
      console.error("Error fetching employee count:", error);
      setTotalEmployees(0);
    }
  };

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

      const allAssetsList: any[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Fetched asset data:", data);

        total++;

        // Count status occurrences
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
        }

        // Add all assets to the list
        allAssetsList.push({
          id: doc.id,
          ...data,
        });
      });

      setStatusCounts({
        active,
        maintenance,
        retired,
        available,
        lost,
        total,
      });
      setAllAssets(allAssetsList);
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
        <>
          <div className="mt-2 pt-3 border-t border-sidebar-border ">
            <div className="text-xs text-accent-foreground mb-1 mt-2 font-semibold">
              OVERVIEW
            </div>
            {/* ALL ASSETS SECTION */}
            {allAssets.length > 0 && (
              <StatusItem
                label="Total Assets"
                value={allAssets.length}
                color="teal"
              />
            )}
            <div className="text-xs text-accent-foreground mb-2 mt-3 ">
              <StatusItem
                label="Total Employees"
                value={totalEmployees}
                color="employees"
              />
            </div>
            <div className="text-xs text-accent-foreground mb-2 mt-3 font-semibold">
              ASSET STATUS
            </div>
            <div className="space-y-3">
              <StatusItem
                label="Active"
                value={statusCounts.active}
                color="emerald"
              />
              <StatusItem
                label="Maintenance"
                value={statusCounts.maintenance}
                color="amber"
              />
              <StatusItem
                label="Retired"
                value={statusCounts.retired}
                color="gray"
              />
              <StatusItem
                label="Available"
                value={statusCounts.available}
                color="blue"
              />
              <StatusItem label="Lost" value={statusCounts.lost} color="red" />
            </div>
          </div>
        </>
      ) : (
        <div className="mt-8 pt-6 border-t border-sidebar-border text-xs text-red-500">
          Please log in to view asset status.
        </div>
      )}
    </div>
  );
}
