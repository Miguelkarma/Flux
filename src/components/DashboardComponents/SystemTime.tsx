"use client";

import { useEffect, useState } from "react";

export default function SystemTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-[hsl(var(--card))] border border-slate-700/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-md  shadow-teal-600">
      <div className="bg-[hsl(var(--secondary))]  p-6 border-b border-slate-700/50">
        <div className="text-center">
          <div className="text-xs text-popover-foreground mb-1 font-mono">
            SYSTEM TIME
          </div>
          <div className="text-3xl font-mono text-secondary-foreground mb-1">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-slate-400">
            {formatDate(currentTime)}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 gap-3 text-center">
          <div className="bg-[hsl(var(--secondary))] rounded-md p-3 border border-slate-700/50 ">
            <div className="text-xs text-secondary-foreground mb-1">
              Time Zone
            </div>
            <div className="text-sm font-mono text-primary">UTC-08:00</div>
          </div>
        </div>
      </div>
    </div>
  );
}
