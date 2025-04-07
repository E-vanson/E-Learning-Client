"use client"

import * as React from "react";
import { HTMLAttributes } from "react";
import { cn } from "@elearning/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline";
}

 const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = "default", className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variant === "default" &&
          "border-transparent bg-primary text-primary-foreground",
        variant === "outline" &&
          "border-border bg-transparent text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

Badge.displayName = "Badge";

export { Badge };
