import React from "react";
import { cn } from "@/utils/cn";

const Progress = React.forwardRef(({ className, value = 0, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-primary to-primary-600",
    success: "bg-gradient-to-r from-success to-emerald-500",
    warning: "bg-gradient-to-r from-warning to-orange-500",
    danger: "bg-gradient-to-r from-error to-red-600"
  };

  return (
    <div
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-200", className)}
      {...props}
    >
      <div
        className={cn("h-full w-full flex-1 transition-all duration-500 ease-out", variants[variant])}
        style={{
          transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)`
        }}
      />
    </div>
  );
});

Progress.displayName = "Progress";

export default Progress;