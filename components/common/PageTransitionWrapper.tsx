'use client';

import React, { useEffect, useState } from 'react';

interface PageTransitionWrapperProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
}

const PageTransitionWrapper: React.FC<PageTransitionWrapperProps> = ({ 
  children, 
  direction = 'right' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true);
    
    // Cleanup function to reset state when component unmounts
    return () => {
      setIsVisible(false);
    };
  }, []);

  // Define animation class based on direction
  const getAnimationClass = () => {
    switch (direction) {
      case 'left':
        return isVisible ? 'animate-fade-in' : '';
      case 'right':
        return isVisible ? 'animate-slide-in-right' : '';
      case 'up':
        return isVisible ? 'animate-slide-up' : '';
      case 'down':
        return isVisible ? 'animate-slide-up' : '';
      default:
        return isVisible ? 'animate-slide-in-right' : '';
    }
  };

  return (
    <div className={getAnimationClass()}>
      {children}
    </div>
  );
};

export default PageTransitionWrapper; 