
"use client"

import React from "react"
import { cn } from "@/lib/utils"

type LoaderProps = {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export const Loader = ({ size = "md", text, className }: LoaderProps) => {
  const sizeClass = {
    sm: "w-40 h-40",
    md: "w-60 h-60",
    lg: "w-80 h-80",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className={cn(sizeClass[size])}>
        {/* Using a standard HTML element with the Web Component inside */}
        <div 
          dangerouslySetInnerHTML={{ 
            __html: `<dotlottie-player 
              src="https://lottie.host/1fac53ad-93a7-422a-a58e-2b6450881e44/6TACEXpt31.lottie" 
              background="transparent" 
              speed="1" 
              loop 
              autoplay
              style="width: 100%; height: 100%;"
            ></dotlottie-player>`
          }}
        />
      </div>
      {text && <p className="text-muted-foreground text-sm">{text}</p>}
    </div>
  )
}
