"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/ThemeProvider";
import DashboardParticles from "@/Animation/DashboardParticles";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SystemTime from "@/components/DashboardComponents/SystemTime";
import AssetSummary from "@/components/DashboardComponents/AssetSummary";
import { toast, Toaster } from "sonner";
import CurrencyConverter from "@/components/DashboardComponents/currency-converter";
import MarketPriceTracker from "@/components/DashboardComponents/MarketPrice";
import Loader from "@/Animation/SmallLoader";

export default function Dashboard() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Toast message
  useEffect(() => {
    const toastMessage = sessionStorage.getItem("toastMessage");
    if (toastMessage) {
      toast.success(toastMessage);
      sessionStorage.removeItem("toastMessage");
    }
  }, []);

  return (
    <div
      className={`${theme} min-h-screen bg-gradient-to-b from-teal-700/40 via-teal-900/20 text-slate-100 relative overflow-hidden`}
    >
      <Toaster
        position="top-right"
        duration={3000}
        richColors={true}
        theme="system"
        closeButton={true}
        expand={true}
        visibleToasts={3}
      />

      {/* Background particle effect */}
      <DashboardParticles />

      {/* Loading overlay */}
      {isLoading && <Loader />}

      <div className="container mx-auto p-4 relative z-10">
        {/* Header */}
        <Header />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-3">
            <Sidebar />
          </div>

          {/* Main Dashboard */}
          <div className="md:col-span-6">
            <div className="grid gap-6">
              <AssetSummary />
              <MarketPriceTracker />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col gap-6 md:order-last">
            <SystemTime />
            <CurrencyConverter />
          </div>
        </div>
      </div>
    </div>
  );
}
