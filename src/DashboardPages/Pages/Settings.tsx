import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "../../components/Sidebar";
import ParticlesBackground from "@/Landing/Animation/ParticlesBackground";
import { useAuth } from "@/hooks/use-auth";

export default function Settings() {
  const { user, handleLogout } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen mr-2 ">
        {/* Sidebar */}
        <Sidebar user={user} onLogout={handleLogout} />

        {/* Main content area */}
        <main className="flex flex-col flex-1 min-w-0 mb-8">
          <SidebarTrigger />
          <ParticlesBackground />

          <div className="flex flex-1 overflow"></div>
        </main>
      </div>
    </SidebarProvider>
  );
}
