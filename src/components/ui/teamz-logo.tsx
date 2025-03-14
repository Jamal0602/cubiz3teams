
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface TeamzLogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export const TeamzLogo: React.FC<TeamzLogoProps> = ({
  className,
  variant = 'full',
  size = 'md',
}) => {
  const { theme } = useTheme();
  
  const sizeClasses = {
    sm: variant === 'full' ? 'h-6' : 'h-8',
    md: variant === 'full' ? 'h-8' : 'h-10',
    lg: variant === 'full' ? 'h-12' : 'h-16',
  };
  
  return (
    <div className={cn('relative flex items-center', className)}>
      {variant === 'full' ? (
        <img 
          src="/lovable-uploads/aa48fa2d-6c13-4c91-801e-847599f08aa7.png"
          alt="Teamz Workspace" 
          className={cn(sizeClasses[size], 'object-contain')}
        />
      ) : (
        <div className={cn(sizeClasses[size], 'aspect-square relative')}>
          <img 
            src="/lovable-uploads/aa48fa2d-6c13-4c91-801e-847599f08aa7.png"
            alt="Teamz" 
            className="h-full object-contain object-center"
          />
        </div>
      )}
    </div>
  );
};
