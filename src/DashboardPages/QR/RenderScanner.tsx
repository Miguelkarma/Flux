"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import DashboardParticles from "@/Animation/DashboardParticles";
import { useTheme } from "@/hooks/ThemeProvider";
import { useState, useEffect } from "react";
import Loader from "@/Animation/SmallLoader";
import { QRScanner } from "@/components/QRComponents/QrScanner";
import { useAuth } from "@/hooks/use-auth";
import { Toaster } from "sonner";

export default function Scanner() {
  const { theme } = useTheme();
  const { user } = useAuth();
  // Change from id to uid for Firebase User
  const userId = user?.uid;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Handle scan completion
  const handleScanComplete = (serialNumber: string) => {
    console.log("Scan completed:", serialNumber);
    // Add any additional logic you want to execute after scan
  };

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
        {isLoading && <Loader />}
        <div className="container mx-auto p-4 relative z-10">
          <Header />

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 md:col-span-3 lg:col-span-3">
              <Sidebar />
            </div>

            <div className="col-span-12 md:col-span-9 lg:col-span-9 p-2">
              <div className="grid gap-6">
                {/* Updated QRScanner props */}
                <QRScanner
                  user={user}
                  userId={userId}
                  onScanComplete={handleScanComplete}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
