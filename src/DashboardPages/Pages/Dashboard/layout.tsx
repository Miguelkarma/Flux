import Sidebar from "../../../components/Sidebar";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardPage from "@/DashboardPages/Pages/Dashboard/renderDashboard";
import { useAuth } from "@/hooks/use-auth";

const DashboardLayout = () => {
  const { user, handleLogout } = useAuth();

  return (
    <div className="h-screen overflow-hidden flex">
      <SidebarProvider>
        <Sidebar user={user} onLogout={handleLogout} />

        <main className="flex flex-col flex-grow min-w-0 p-4 transition">
          <SidebarTrigger />
          <DashboardPage />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
