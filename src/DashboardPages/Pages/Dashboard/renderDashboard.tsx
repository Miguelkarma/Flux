import { AssetOverview } from "./Asset-overview";
import { AssetAllocation } from "./Asset-allocation";
import { AssetTable } from "./Asset-table";
import { RecentActivity } from "./Recent-activity";
import ParticlesBackground from "@/Animation/ParticlesBackground";
export default function DashboardPage() {
  return (
    <div className="flex flex-grow min-w-0 p-4 transition-all ">
      <ParticlesBackground/>
      <div className="flex flex-col gap-3 p-2 w-full">
        <AssetOverview />
        <div className="grid gap-6 md:grid-cols-2">
          <AssetAllocation />
          <RecentActivity />
        </div>
        <div className="grid gap-6 md:grid-cols-1">
          <AssetTable />
        </div>
      </div>
    </div>
  );
}
