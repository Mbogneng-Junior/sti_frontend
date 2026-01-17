import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40",
        destructive:
          "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40",
        primary: 
          "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40",
        primaryOutline:
          "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 shadow-sm",
        secondary: 
          "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40",
        secondaryOutline:
          "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 shadow-sm",
        danger: 
          "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40",
        dangerOutline:
          "bg-white text-red-600 border border-red-200 hover:bg-red-50 shadow-sm",
        super: 
          "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40",
        superOutline:
          "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 shadow-sm",
        outline:
          "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm",
        ghost: 
          "bg-transparent text-gray-600 hover:bg-gray-100",
        Sidebar: 
          "bg-transparent text-gray-600 hover:bg-blue-50 hover:text-blue-600",
        SidebarOutline: "bg-blue-50 text-blue-600 hover:bg-blue-100",
        link: "text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 rounded-md px-8",
        icon: "h-10 w-10",
        rounded: "rounded-full",
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
