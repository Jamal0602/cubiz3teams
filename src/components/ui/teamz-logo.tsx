
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
  
  // Use the provided logo image
  return (
    <div className={cn('relative flex items-center', className)}>
      {variant === 'full' ? (
        <img 
          src="/lovable-uploads/8a30cf11-26f2-4dcd-bd7d-bff4ec0b6f0e.png"
          alt="Teamz Workspace" 
          className={cn(sizeClasses[size], 'object-contain')}
        />
      ) : (
        <div className={cn(sizeClasses[size], 'aspect-square relative')}>
          <img 
            src="/lovable-uploads/8a30cf11-26f2-4dcd-bd7d-bff4ec0b6f0e.png"
            alt="Teamz" 
            className="h-full object-contain object-center"
          />
        </div>
      )}
    </div>
  );
};
