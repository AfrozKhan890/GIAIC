import * as React from "react"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
    return clsx(inputs)
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "accent"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

        const variants = {
            default: "bg-[#0077FF] text-white hover:bg-[#0066DD] shadow-md hover:shadow-lg active:scale-95",
            destructive: "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg active:scale-95",
            outline: "border-2 border-[#0077FF] text-[#0077FF] bg-transparent hover:bg-[#0077FF]/10 hover:border-[#0066DD]",
            secondary: "bg-[#333333] text-white hover:bg-[#444444] shadow-md hover:shadow-lg active:scale-95",
            ghost: "text-[#333333] hover:bg-[#F5F5F5] hover:text-[#0077FF]",
            link: "text-[#0077FF] underline-offset-4 hover:underline",
            accent: "bg-[#FF6B35] text-white hover:bg-[#E55A2A] shadow-md hover:shadow-lg active:scale-95"
        }

        const sizes = {
            default: "h-10 px-6 py-2",
            sm: "h-8 px-4 py-1 text-xs rounded-md",
            lg: "h-12 px-8 py-3 text-base rounded-xl",
            icon: "h-10 w-10 p-0"
        }

        return (
            <button
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, cn }