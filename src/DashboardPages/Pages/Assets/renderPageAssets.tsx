import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "../../Sidebar";
import { DataTable } from "@/DashboardPages/Pages/Assets/table";
import ParticlesBackground from "@/Landing/Animation/ParticlesBackground";
import { useAuth } from "@/hooks/use-auth";

export default function Assets() {
  const { user, handleLogout } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex">
          <Sidebar user={user} onLogout={handleLogout} />
        </aside>

        {/* Main Content */}
        <main className="flex flex-col flex-1 min-w-0 p-4 overflow-auto">
          <SidebarTrigger />
          <ParticlesBackground />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Asset Management Section */}
            <div className="lg:col-span-2 p-4 bg-gray-900/10 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-2">Asset Management</h2>
              <DataTable />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
