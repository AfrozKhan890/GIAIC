import * as React from "react"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
    return clsx(inputs)
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger" | "info"
    size?: "sm" | "md" | "lg"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = "default", size = "md", ...props }, ref) => {
        const variants = {
            default: "bg-[#0077FF] text-white",
            secondary: "bg-[#333333] text-white",
            outline: "border border-[#0077FF] text-[#0077FF]",
            success: "bg-green-100 text-green-800 border border-green-200",
            warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
            danger: "bg-red-100 text-red-800 border border-red-200",
            info: "bg-blue-100 text-blue-800 border border-blue-200"
        }

        const sizes = {
            sm: "px-2 py-1 text-xs rounded-md",
            md: "px-3 py-1 text-sm rounded-lg",
            lg: "px-4 py-1.5 text-base rounded-lg"
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "inline-flex items-center font-medium",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        )
    }
)
Badge.displayName = "Badge"

export { Badge }