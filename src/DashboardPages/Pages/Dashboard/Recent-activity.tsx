import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    id: 1,
    description: "Equipment A maintenance completed",
    timestamp: "2 hours ago",
    type: "maintenance",
  },
  {
    id: 2,
    description: "New vehicle added to fleet",
    timestamp: "5 hours ago",
    type: "addition",
  },
  {
    id: 3,
    description: "Asset value updated: Manufacturing Equipment B",
    timestamp: "1 day ago",
    type: "update",
  },
  {
    id: 4,
    description: "Scheduled maintenance: Company Vehicle C",
    timestamp: "2 days ago",
    type: "scheduled",
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start justify-between space-x-4"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
