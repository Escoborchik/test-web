import { cn } from "@/lib/utils"
import * as SelectPrimitives from "@radix-ui/react-select"
import type { ComponentProps } from "react"

export const SelectContent = ({ className, style, ...props }: ComponentProps<typeof SelectPrimitives.Content>) => {
  return (
    <SelectPrimitives.Content
      className={cn("overflow-hidden rounded-lg border border-border bg-popover shadow-lg", className)}
      style={{
        width: "var(--radix-select-trigger-width)",
        ...(style || {}),
      }}
      {...props}
    />
  )
}
