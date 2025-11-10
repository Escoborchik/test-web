import { cn } from "@/lib/utils"
import * as SelectPrimitives from "@radix-ui/react-select"
import type { ComponentProps } from "react"

export const SelectItem = ({ className, ...props }: ComponentProps<typeof SelectPrimitives.Item>) => {
  return (
    <SelectPrimitives.Item
      className={cn(
        "relative flex cursor-default select-none items-center justify-center rounded-sm px-2 py-1.5 text-sm outline-none",
        "hover:bg-accent/10 hover:text-accent transition-colors",
        "focus:bg-accent/20 focus:text-accent",
        "data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    />
  )
}
