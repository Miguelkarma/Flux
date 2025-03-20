import Header from "@/components/DashboardComponents/Header";
import Sidebar from "@/components/Sidebar";
import DashboardParticles from "@/Animation/DashboardParticles";
import { EmployeeTable } from "@/components/EmployeeComponents/employeeTable";

export default function Employee() {
  return (
    <>
      <div>
        <DashboardParticles />
        <div className="container mx-auto p-4 relative z-10 ">
          <Header />

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 md:col-span-3 lg:col-span-3 ">
              <Sidebar />
            </div>

            <div className="col-span-12 md:col-span-9 lg:col-span-9 p-2">
              <div className="grid gap-6">
                <EmployeeTable data={[]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
