import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "../Sidebar";
import { DataTable } from "@/dashboard/table/RenderTable";
import ParticlesBackground from "@/Landing/Animation/ParticlesBackground";
import { useAuth } from "@/hooks/use-auth";

export default function Assets() {
  const { user, handleLogout } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen mr-2 ">
        {/* Sidebar */}
        <Sidebar user={user} onLogout={handleLogout} />

        {/* Main content area */}
        <main className="flex flex-col flex-1 min-w-0 mb-8">
          <ParticlesBackground />
          <SidebarTrigger />
          <div className="flex flex-1 overflow">
            <DataTable />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
