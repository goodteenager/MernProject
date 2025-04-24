import * as React from "react";
import { cn } from "@/lib/utils";


const Badge = React.forwardRef<...>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-slate-800/50 backdrop-blur-sm border border-cyan-300/20 text-cyan-300 shadow-md",
      "animate-pulse-slow bg-gradient-to-br from-purple-600/30 to-blue-500/30",
      className
    )}
    {...props}
  />
));

Badge.displayName = "Badge";

export { Badge };
