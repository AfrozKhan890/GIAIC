import * as React from "react"
import { clsx, type ClassValue } from "clsx"

function cn(...inputs: ClassValue[]) {
    return clsx(inputs)
}

const Label = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(
            "text-sm font-semibold text-[#333333] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            "mb-1 block",
            className
        )}
        {...props}
    />
))
Label.displayName = "Label"

export { Label }