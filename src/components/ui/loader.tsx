
"use client"

import React, { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type LoaderProps = {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export const Loader = ({ size = "md", text, className }: LoaderProps) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  
  useEffect(() => {
    // Check if the script is already loaded
    if (!document.querySelector('script[src*="dotlottie-player"]')) {
      // Create script element for dotlottie player if not already loaded
      const script = document.createElement('script');
      script.src = "https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs";
      script.type = "module";
      script.onload = () => setIsScriptLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsScriptLoaded(true);
    }
  }, []);

  const sizeClass = {
    sm: "w-40 h-40",
    md: "w-60 h-60",
    lg: "w-80 h-80",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className={cn(sizeClass[size])}>
        {isScriptLoaded ? (
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
        ) : (
          <div className="animate-pulse rounded-full bg-muted h-full w-full flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        )}
      </div>
      {text && <p className="text-muted-foreground text-sm">{text}</p>}
    </div>
  )
}
