import { AssetOverview } from "./Asset-overview";
import { AssetAllocation } from "./Asset-allocation";
import { AssetTable } from "./Asset-table";
import { RecentActivity } from "./Recent-activity";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <Card className=" flex-col flex-1 min-w-0 p-2 md:p-7 2xl:p-2 bg-gradient-to-b from-teal-800/70 via-black to-teal-900/10 ">
      <div className="flex flex-col gap-6 p-2 ">
        <AssetOverview />
        <div className="grid gap-2 md:grid-cols-2">
          <AssetAllocation />
          <RecentActivity />
        </div>
        <div className="grid gap-2 md:grid-cols-1 ">
          <AssetTable />
        </div>
      </div>
    </Card>
  );
}
