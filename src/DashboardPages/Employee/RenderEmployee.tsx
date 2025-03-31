import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import DashboardParticles from "@/Animation/DashboardParticles";
import { EmployeeTable } from "@/components/EmployeeComponents/table";
import { useTheme } from "@/hooks/ThemeProvider";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";

export default function Employee() {
  const { theme } = useTheme();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <Toaster
        position="top-right"
        duration={3000}
        richColors={true}
        theme="dark"
        closeButton={true}
        expand={true}
        visibleToasts={3}
        style={{ zIndex: 100000 }}
      />
      <div
        className={`${theme} min-h-screen bg-gradient-to-b from-teal-700/40 via-teal-900/20 text-slate-100 relative overflow-hidden`}
      >
        <DashboardParticles />
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
                <div className="absolute inset-2 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-4 border-4 border-r-purple-500 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
                <div className="absolute inset-6 border-4 border-b-blue-500 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
                <div className="absolute inset-8 border-4 border-l-green-500 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
              </div>
              <div className="mt-4 text-cyan-500 font-mono text-sm tracking-wider">
                SYSTEM INITIALIZING
              </div>
            </div>
          </div>
        )}
        <div className="custom-container mx-auto p-4 relative z-10 ">
          <Header />

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 md:col-span-3 lg:col-span-3 ">
              <Sidebar />
            </div>

            <div className="col-span-12 md:col-span-9 lg:col-span-9 p-2">
              <div className="grid gap-6">
                <EmployeeTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
