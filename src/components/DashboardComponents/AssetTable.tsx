import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Edit, Trash2 } from "lucide-react";

interface Asset {
  serialNo: string;
  assetName: string;
  email: string;
  assignedEmployee: string;
  dateAdded: string;
  status: "Active" | "Maintenance" | "Retired" | "Unassigned";
}

export default function AssetTable() {
  // Sample asset data
  const assets: Asset[] = [
    {
      serialNo: "LT-2023-001",
      assetName: "Dell XPS 15",
      email: "john.doe@company.com",
      assignedEmployee: "John Doe",
      dateAdded: "2023-01-15",
      status: "Active",
    },
    {
      serialNo: "LT-2023-002",
      assetName: "MacBook Pro 16",
      email: "jane.smith@company.com",
      assignedEmployee: "Jane Smith",
      dateAdded: "2023-02-20",
      status: "Active",
    },
    {
      serialNo: "LT-2022-045",
      assetName: "Lenovo ThinkPad X1",
      email: "robert.johnson@company.com",
      assignedEmployee: "Robert Johnson",
      dateAdded: "2022-11-05",
      status: "Maintenance",
    },
    {
      serialNo: "DT-2022-089",
      assetName: "HP EliteDesk 800",
      email: "sarah.williams@company.com",
      assignedEmployee: "Sarah Williams",
      dateAdded: "2022-08-12",
      status: "Active",
    },
    {
      serialNo: "MN-2023-012",
      assetName: 'Dell UltraSharp 27"',
      email: "michael.brown@company.com",
      assignedEmployee: "Michael Brown",
      dateAdded: "2023-03-10",
      status: "Active",
    },
    {
      serialNo: "TB-2022-034",
      assetName: "Microsoft Surface Pro",
      email: "",
      assignedEmployee: "",
      dateAdded: "2022-10-18",
      status: "Unassigned",
    },
    {
      serialNo: "PR-2021-067",
      assetName: "HP LaserJet Pro",
      email: "office@company.com",
      assignedEmployee: "Office Admin",
      dateAdded: "2021-06-30",
      status: "Active",
    },
    {
      serialNo: "NW-2020-023",
      assetName: "Cisco Switch 24-Port",
      email: "",
      assignedEmployee: "",
      dateAdded: "2020-12-15",
      status: "Retired",
    },
  ];

  const getStatusColor = (status: Asset["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "Maintenance":
        return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "Retired":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "Unassigned":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  return (
    <div className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm rounded-lg border overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-medium text-slate-100">
          IT Equipment Assets
        </h2>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
          >
            Add Asset
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-slate-700/50 text-slate-400 hover:bg-slate-700/50"
          >
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-slate-400 bg-slate-800/50">
              <th className="px-4 py-3 text-left">Serial No.</th>
              <th className="px-4 py-3 text-left">Asset Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Assigned Employee</th>
              <th className="px-4 py-3 text-left">Date Added</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {assets.map((asset) => (
              <tr
                key={asset.serialNo}
                className="text-sm hover:bg-slate-800/30"
              >
                <td className="px-4 py-3 text-slate-300 font-mono">
                  {asset.serialNo}
                </td>
                <td className="px-4 py-3 text-slate-300">{asset.assetName}</td>
                <td className="px-4 py-3 text-slate-400">
                  {asset.email || "-"}
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {asset.assignedEmployee || "-"}
                </td>
                <td className="px-4 py-3 text-slate-400">{asset.dateAdded}</td>
                <td className="px-4 py-3">
                  <Badge className={getStatusColor(asset.status)}>
                    {asset.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-slate-400 hover:text-cyan-400"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-700/50 flex items-center justify-between">
        <div className="text-sm text-slate-400">Showing 8 of 8 assets</div>
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant="outline"
            className="border-slate-700/50 text-slate-400 hover:bg-slate-700/50"
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-slate-700/50 text-slate-400 hover:bg-slate-700/50"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
