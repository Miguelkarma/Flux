import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "../../Sidebar";
import { useAuth } from "@/hooks/use-auth";
import CurrencyConverter from "@/DashboardPages/Pages/CurrencyExchange/currency-converter";
import ParticlesBackground from "@/Landing/Animation/ParticlesBackground";
import ExchangeRateTable from "./ExchangeRateTable";

export default function Settings() {
  const { user, handleLogout } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen">
        {/* Sidebar - Hidden on small screens */}
        <aside className="hidden md:flex">
          <Sidebar user={user} onLogout={handleLogout} />
        </aside>

        {/* Main Content */}
        <main className="flex flex-col flex-1 min-w-0 p-4 overflow-auto ">
          <SidebarTrigger />
          <ParticlesBackground />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Currency Converter */}
            <div className="lg:col-span-2 p-8 bg-gray-900/10 rounded-xl shadow">
              <CurrencyConverter />
            </div>

            {/* Exchange Rate Table */}
            <div className="lg:col-span-2 p-4 bg-gray-900/10 rounded-xl shadow">
              <ExchangeRateTable />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
