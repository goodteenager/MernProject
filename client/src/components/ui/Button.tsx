import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-violet-600 text-white hover:bg-violet-700 shadow-md",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-md",
        outline: "border border-violet-600 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950",
        secondary: "bg-slate-700 text-white hover:bg-slate-800 shadow-md",
        ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        link: "underline-offset-4 hover:underline text-violet-600 dark:text-violet-400",
        achievement: "bg-amber-500 text-slate-900 hover:bg-amber-600 shadow-md",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), loading ? "opacity-50 cursor-not-allowed" : "")}
        ref={ref}
        disabled={loading}
        {...props}
      >
        {loading ? (
          <span className="loader">Загрузка...</span>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };