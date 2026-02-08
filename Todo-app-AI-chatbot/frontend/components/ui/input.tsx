import * as React from "react"

function cn(...classes: (string | boolean | undefined | null)[]) {
    return classes.filter(Boolean).join(" ")
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean
    success?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, success, ...props }, ref) => {
        const borderColor = error 
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
            : success 
            ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
            : "border-[#E5E7EB] focus:border-[#0077FF] focus:ring-[#0077FF]/20"

        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-lg border bg-white px-4 py-2 text-sm text-[#333333]",
                    "placeholder:text-[#9CA3AF]",
                    "focus:outline-none focus:ring-2 focus:ring-offset-1",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "transition-all duration-200",
                    borderColor,
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }