import * as React from "react"

function cn(...classes: (string | boolean | undefined | null)[]) {
    return classes.filter(Boolean).join(" ")
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean
    success?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, success, ...props }, ref) => {
        const borderColor = error 
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
            : success 
            ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
            : "border-[#E5E7EB] focus:border-[#0077FF] focus:ring-[#0077FF]/20"

        return (
            <textarea
                className={cn(
                    "flex min-h-[80px] w-full rounded-lg border bg-white px-4 py-3 text-sm text-[#333333]",
                    "placeholder:text-[#9CA3AF]",
                    "focus:outline-none focus:ring-2 focus:ring-offset-1",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "resize-none",
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
Textarea.displayName = "Textarea"

export { Textarea }