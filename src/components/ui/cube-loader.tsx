
"use client"

import React from "react"
import { cn } from "@/lib/utils"

type CubeLoaderProps = {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export const CubeLoader = ({ size = "md", text, className }: CubeLoaderProps) => {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className={cn("cube-loader", sizeClasses[size])}>
        <div className="cube-face cube-face-front"></div>
        <div className="cube-face cube-face-back"></div>
        <div className="cube-face cube-face-top"></div>
        <div className="cube-face cube-face-bottom"></div>
        <div className="cube-face cube-face-left"></div>
        <div className="cube-face cube-face-right"></div>
      </div>
      {text && <p className="text-muted-foreground text-sm">{text}</p>}
      
      <style dangerouslySetInnerHTML={{ __html: `
        .cube-loader {
          position: relative;
          transform-style: preserve-3d;
          animation: cube-rotate 4s infinite ease;
        }
        
        .cube-face {
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(var(--primary-rgb), 0.7);
          border: 2px solid rgba(var(--primary-rgb), 0.8);
          box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.5);
        }
        
        .cube-face-front {
          transform: translateZ(calc(var(--size) / 2));
        }
        
        .cube-face-back {
          transform: rotateY(180deg) translateZ(calc(var(--size) / 2));
        }
        
        .cube-face-top {
          transform: rotateX(90deg) translateZ(calc(var(--size) / 2));
        }
        
        .cube-face-bottom {
          transform: rotateX(-90deg) translateZ(calc(var(--size) / 2));
        }
        
        .cube-face-left {
          transform: rotateY(-90deg) translateZ(calc(var(--size) / 2));
        }
        
        .cube-face-right {
          transform: rotateY(90deg) translateZ(calc(var(--size) / 2));
        }
        
        @keyframes cube-rotate {
          0% {
            transform: rotateX(0deg) rotateY(0deg);
          }
          25% {
            transform: rotateX(90deg) rotateY(90deg);
          }
          50% {
            transform: rotateX(180deg) rotateY(180deg);
          }
          75% {
            transform: rotateX(270deg) rotateY(270deg);
          }
          100% {
            transform: rotateX(360deg) rotateY(360deg);
          }
        }
        
        .cube-loader.w-10 {
          --size: 2.5rem;
        }
        
        .cube-loader.w-16 {
          --size: 4rem;
        }
        
        .cube-loader.w-24 {
          --size: 6rem;
        }
      `}} />
    </div>
  )
}
