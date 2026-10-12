import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-label-lg transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100",
  {
    variants: {
      variant: {
        default:
          "bg-primary-container text-on-primary-container shadow-glow hover:bg-primary",
        secondary:
          "border border-outline-variant/30 bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
        outline:
          "border border-outline-variant/50 bg-transparent text-primary hover:bg-surface-container-high",
        ghost: "text-on-surface hover:bg-surface-container-high",
      },
      // Alle Größen erfüllen die Mindest-Touch-Fläche von 48 px
      size: {
        default: "min-h-touch px-5",
        lg: "min-h-touch-lg px-6",
        icon: "h-touch w-touch",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
