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
    if (document.querySelector('script[src*="dotlottie-player"]')) {
      setIsScriptLoaded(true);
      return;
    }
    
    // Create script element for dotlottie player
    const script = document.createElement('script');
    script.src = "https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs";
    script.type = "module";
    script.setAttribute('data-loading', 'true');
    
    script.onload = () => {
      script.removeAttribute('data-loading');
      setIsScriptLoaded(true);
    };
    
    script.onerror = (error) => {
      console.error('Error loading dotlottie-player:', error);
      // Keep isScriptLoaded as false to show fallback
    };
    
    document.head.appendChild(script);

    // Clean up script if component unmounts during loading
    return () => {
      const pendingScript = document.querySelector('script[src*="dotlottie-player"][data-loading="true"]');
      if (pendingScript) {
        pendingScript.remove();
      }
    };
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
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full"></div>
          </div>
        )}
      </div>
      {text && (
        <p className="text-muted-foreground text-sm text-center">
          {text}
        </p>
      )}
    </div>
  )
}
