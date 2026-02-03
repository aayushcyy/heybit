"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  value: number;
  totalValue: number;
  color?: string;
}

function Progress({
  className,
  value,
  totalValue,
  color,
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2.5 w-full overflow-hidden rounded-full bg-[#2e2e2e]",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all rounded-full"
        style={{
          backgroundColor: color ?? "#ffffff",
          transform: `translateX(-${100 - (value / totalValue) * 100}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
