import Sidebar from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardPage from "@/DashboardPages/Pages/Dashboard/renderDashboard";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";

const DashboardLayout = () => {
  const { user, handleLogout } = useAuth();

  useEffect(() => {
    const toastMessage = sessionStorage.getItem("toastMessage");
    if (toastMessage) {
      toast.success(toastMessage);
      sessionStorage.removeItem("toastMessage");
    }
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        duration={3000}
        richColors={true}
        theme="system"
        closeButton={true}
        expand={true}
        visibleToasts={3}
      />
      <div className="h-screen overflow-hidden flex">
        <SidebarProvider>
          <Sidebar user={user} onLogout={handleLogout} />

          <main className="flex flex-col flex-grow min-w-0 p-4 transition">
            <SidebarTrigger />
            <DashboardPage />
          </main>
        </SidebarProvider>
      </div>
    </>
  );
};

export default DashboardLayout;
