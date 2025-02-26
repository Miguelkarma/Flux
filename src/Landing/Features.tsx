import { Server, Database, ShieldCheck, Activity } from "lucide-react";

const features = [
  {
    name: "Centralized Asset Tracking",
    description:
      "Manage and monitor all IT assets from a single, unified dashboard for complete visibility.",
    icon: Server,
  },
  {
    name: "Automated Inventory Management",
    description:
      "Reduce manual effort with automated asset discovery, tracking, and reporting.",
    icon: Database,
  },
  {
    name: "Robust Security & Compliance",
    description:
      "Ensure your IT assets meet security standards with built-in compliance monitoring.",
    icon: ShieldCheck,
  },
  {
    name: "Real-Time Performance Monitoring",
    description:
      "Get instant insights into asset health, utilization, and lifecycle to optimize operations.",
    icon: Activity,
  },
];

export default function Features() {
  return (
    <section className="container space-y-16 py-24 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
          Smarter IT Asset Management
        </h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Optimize asset utilization, enhance security, and gain real-time
          insights with our advanced IT asset management solutions.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.name}
            className="relative overflow-hidden rounded-lg border bg-background p-8"
          >
            <div className="flex items-center gap-4">
              <feature.icon className="h-8 w-8" />
              <h3 className="font-bold">{feature.name}</h3>
            </div>
            <p className="mt-2 text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
  