import { FC, ReactNode } from "react";
import Sidebar from "../../components/Sidebar";
import ParticlesBackground from "@/Landing/Animation/ParticlesBackground";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardPage from "@/DashboardPages/Pages/Dashboard/page";
import { useAuth } from "@/hooks/use-auth";

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = () => {
  const { user, handleLogout } = useAuth();
  return (
    <div className="dashboard-container h-screen overflow-hidden">
      <SidebarProvider>
        <Sidebar user={user} onLogout={handleLogout} />
        {/* Main Content */}
        <main className="flex flex-col flex-1 min-w-0 mb-8 overflow-auto scrollbar-none">
          <SidebarTrigger />
          <DashboardPage />
        </main>
        <ParticlesBackground />
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
