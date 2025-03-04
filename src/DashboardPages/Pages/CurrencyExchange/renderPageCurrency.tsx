import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "../../Sidebar";
import { useAuth } from "@/hooks/use-auth";
import CurrencyConverter from "@/DashboardPages/Pages/CurrencyExchange/currency-converter";
import ParticlesBackground from "@/Animation/ParticlesBackground";
import ExchangeRateTable from "./ExchangeRateTable";

export default function Exchange() {
  const { user, handleLogout } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen">
        {/* Sidebar - Hidden on small screens */}
        <aside className="hidden md:flex">
          <Sidebar user={user} onLogout={handleLogout} />
        </aside>

        {/* Main Content */}
        <main className="flex flex-col flex-1 min-w-0 p-4 overflow-auto w-full">
          <SidebarTrigger />
          <ParticlesBackground />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-5 w-full">
            {/* Currency Converter */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 w-full md:p-3 p-6 bg-transparent ">
              <CurrencyConverter />
            </div>

            {/* Exchange Rate Table  */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 w-full max-md:p-3 p-6 bg-transparent ">
              <ExchangeRateTable />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
