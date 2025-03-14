"use client";

import { useEffect, useState } from "react";
import DashboardParticles from "@/Animation/DashboardParticles";
import { DataTable } from "../../../components/AssetsComponents/table";
import Header from "@/components/DashboardComponents/Header";
import Sidebar from "@/components/Sidebar";
import Loader from "@/Animation/SmallLoader";

export default function Dashboard() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div
      className={`${theme} min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden`}
    >
      <DashboardParticles />

      {/* Display the loader if loading */}
      {isLoading && <Loader />}

      <div className="container mx-auto p-4 relative z-10">
        <Header theme={theme} toggleTheme={toggleTheme} />

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3 lg:col-span-3">
            <Sidebar />
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-9 p-3">
            <div className="grid gap-6">
              <DataTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
