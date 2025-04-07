import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import DashboardParticles from "@/Animation/DashboardParticles";
import { useTheme } from "@/hooks/ThemeProvider";
import { useState, useEffect } from "react";
import Loader from "@/Animation/SmallLoader";
import { QRGenerator } from "@/components/QRComponents/QrGenerator";
import { useAuth } from "@/hooks/use-auth";

export default function Generate() {
  const { theme } = useTheme();
  const { userId } = useAuth(); // Get userId from auth hook
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        className={`${theme} min-h-screen bg-gradient-to-b from-teal-700/40 via-teal-900/20 text-slate-100 relative overflow-hidden`}
      >
        <DashboardParticles />
        {/* Loading overlay */}
        {isLoading && <Loader />}
        <div className="container mx-auto my-auto p-4 relative z-10 ">
          <Header />

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 md:col-span-3 lg:col-span-3 ">
              <Sidebar />
            </div>

            <div className="col-span-12 md:col-span-9 lg:col-span-9 p-2 ">
              <div className="grid gap-6">
                {/* Pass userId to QRGenerator */}
                <QRGenerator userId={userId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
