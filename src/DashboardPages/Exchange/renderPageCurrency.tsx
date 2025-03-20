"use client";

import { useEffect, useState } from "react";
import DashboardParticles from "@/Animation/DashboardParticles";
import { useTheme } from "@/hooks/ThemeProvider";
import Header from "@/components/DashboardComponents/Header";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import Loader from "@/Animation/SmallLoader";
import CurrencyConverter from "@/components/ExchangeComponents/currency-converter";
import ExchangeRateTable from "@/components/ExchangeComponents/ExchangeRateTable";

export default function Exchange() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`${theme} min-h-screen bg-gradient-to-b from-teal-700/40 via-teal-900/20 text-slate-100 relative overflow-hidden`}
    >
      <DashboardParticles />

      {/* Display the loader if loading */}
      {isLoading && <Loader />}

      <div className="container mx-auto p-4 relative z-10">
        <Header />

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3 lg:col-span-3">
            <Sidebar />
          </div>

          <Card className="col-span-12 md:col-span-9 lg:col-span-9 p-3">
            <div>
              <div className="grid gap-6">
                <CurrencyConverter />
                <ExchangeRateTable />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
