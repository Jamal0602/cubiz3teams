
import React from 'react';
import { cn } from '@/lib/utils';

interface CubeLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const CubeLoader: React.FC<CubeLoaderProps> = ({
  size = 'md',
  text,
  className,
  ...props
}) => {
  const cubeSize = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)} {...props}>
      <div className={cn('cube-loader', cubeSize[size])}>
        <div className="cube-face cube-face-front"></div>
        <div className="cube-face cube-face-back"></div>
        <div className="cube-face cube-face-right"></div>
        <div className="cube-face cube-face-left"></div>
        <div className="cube-face cube-face-top"></div>
        <div className="cube-face cube-face-bottom"></div>
      </div>
      {text && <p className="mt-4 text-muted-foreground animate-pulse">{text}</p>}
      
      <style jsx>{`
        .cube-loader {
          transform-style: preserve-3d;
          animation: cube-rotate 3s infinite ease;
          position: relative;
        }
        
        .cube-face {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid hsl(var(--primary) / 0.7);
          background-color: hsl(var(--primary) / 0.1);
          box-shadow: 0 0 10px hsl(var(--primary) / 0.3);
        }
        
        .cube-face-front {
          transform: translateZ(calc(${size === 'sm' ? '6px' : size === 'md' ? '8px' : '12px'}));
        }
        
        .cube-face-back {
          transform: rotateY(180deg) translateZ(calc(${size === 'sm' ? '6px' : size === 'md' ? '8px' : '12px'}));
        }
        
        .cube-face-right {
          transform: rotateY(90deg) translateZ(calc(${size === 'sm' ? '6px' : size === 'md' ? '8px' : '12px'}));
        }
        
        .cube-face-left {
          transform: rotateY(-90deg) translateZ(calc(${size === 'sm' ? '6px' : size === 'md' ? '8px' : '12px'}));
        }
        
        .cube-face-top {
          transform: rotateX(90deg) translateZ(calc(${size === 'sm' ? '6px' : size === 'md' ? '8px' : '12px'}));
        }
        
        .cube-face-bottom {
          transform: rotateX(-90deg) translateZ(calc(${size === 'sm' ? '6px' : size === 'md' ? '8px' : '12px'}));
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
      `}</style>
    </div>
  );
};

export { CubeLoader };
