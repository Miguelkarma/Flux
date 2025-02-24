import { FC, ReactNode } from "react";
import Sidebar from "../Sidebar";
import ParticlesBackground from "@/Landing/Animation/ParticlesBackground";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const { user, handleLogout } = useAuth();

  return (
    <div className="dashboard-container">
      <SidebarProvider>
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="dashboard-content">
          <SidebarTrigger />
          {children}
          <ParticlesBackground />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
