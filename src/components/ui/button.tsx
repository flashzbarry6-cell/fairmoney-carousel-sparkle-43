import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-neon-lg hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_4px_20px_0_hsl(0_84%_60%_/_0.3)]",
        outline:
          "border border-primary/30 bg-transparent text-primary hover:bg-primary/10 hover:border-primary/60 hover:shadow-neon",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        phoenix: "relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-dark text-white font-semibold shadow-glow hover:shadow-neon-lg hover:-translate-y-0.5 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary-light before:to-primary before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        luxury: "bg-gradient-to-r from-primary to-primary-light text-primary-foreground font-semibold shadow-glow hover:shadow-neon-lg hover:-translate-y-0.5",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-[0_4px_20px_0_hsl(142_76%_42%_/_0.4)]",
        gold: "bg-gradient-to-r from-gold to-gold-dark text-gold-foreground font-semibold shadow-[0_4px_20px_0_hsl(45_100%_51%_/_0.4)] hover:shadow-[0_0_30px_hsl(45_100%_51%_/_0.5)]",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg font-semibold",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
