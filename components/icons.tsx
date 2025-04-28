import * as React from "react"
import { type LucideIcon, BitcoinIcon } from "lucide-react"

export const Bitcoin: LucideIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<"svg">>(({ ...props }, ref) => (
  <BitcoinIcon ref={ref} {...props} />
))
Bitcoin.displayName = "Bitcoin"
