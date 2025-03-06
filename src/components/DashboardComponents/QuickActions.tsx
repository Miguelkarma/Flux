import {
  Download,
  type LucideIcon,
  RefreshCw,
  Shield,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuickActions() {
  return (
    <Card className="bg-[hsl(var(--card))] border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-slate-100 text-base">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 ">
          <ActionButton icon={Shield} label="Scan Assets" />
          <ActionButton icon={RefreshCw} label="Sync Data" />
          <ActionButton icon={Download} label="Export" />
          <ActionButton icon={Terminal} label="Reports" />
        </div>
      </CardContent>
    </Card>
  );
}

// Action button component
function ActionButton({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Button
      variant="outline"
      className="h-auto py-3 px-3 border-slate-700 bg-[hsl(var(--secondary))] hover:bg-slate-700/50 flex flex-col items-center justify-center space-y-1 w-full"
    >
      <Icon className="h-5 w-5 text-secondary-foreground" />
      <span className="text-xs">{label}</span>
    </Button>
  );
}
