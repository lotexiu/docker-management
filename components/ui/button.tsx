import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(`
	rounded-md 
	flex items-center justify-center
	`,{
    variants: {
      variant: {
        default: `bg-primary 
									text-primary-foreground 
									hover:bg-primary/70
									focus:bg-primary/50`,
        destructive: `bg-destructive 
											text-white
											hover:bg-destructive/70
											focus:bg-destructive/50
											`,
        outline: `bg-background 
									border
									hover:bg-accent
									focus:bg-accent/50
									`,
        secondary: `bg-secondary 
									text-secondary-foreground 
									hover:bg-secondary/80
									focus:bg-secondary/50
									`,
        ghost: `hover:bg-accent 
								focus:bg-accent/50
								`,
        link: `text-primary
							underline-offset-4
							hover:underline`,
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md gap-1.5 px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
