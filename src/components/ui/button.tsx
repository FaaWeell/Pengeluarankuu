import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
    size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    // Variants
                    variant === "default" &&
                    "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
                    variant === "destructive" &&
                    "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20",
                    variant === "outline" &&
                    "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
                    variant === "secondary" &&
                    "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
                    variant === "ghost" &&
                    "hover:bg-accent hover:text-accent-foreground",
                    variant === "link" &&
                    "text-primary underline-offset-4 hover:underline",
                    // Sizes
                    size === "default" && "h-9 px-4 py-2",
                    size === "sm" && "h-8 rounded-md px-3 text-xs",
                    size === "lg" && "h-10 rounded-md px-6",
                    size === "icon" && "size-9",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
