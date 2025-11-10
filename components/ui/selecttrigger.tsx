import { cn } from "@/lib/utils"
import * as SelectPrimitives from "@radix-ui/react-select"
import type { ComponentProps } from "react"

export const SelectTrigger = ({ className, ...props }: ComponentProps<typeof SelectPrimitives.Trigger>) => {
  return (
    <SelectPrimitives.Trigger
      className={cn(
        "flex h-10 items-center justify-center rounded-lg border border-input bg-background px-2 py-1 text-base",
        "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20",
        "hover:border-accent/60 hover:bg-accent/5 transition-colors",
        "data-[state=open]:border-accent data-[state=open]:ring-2 data-[state=open]:ring-accent/20",
        className,
      )}
      {...props}
    />
  )
}
