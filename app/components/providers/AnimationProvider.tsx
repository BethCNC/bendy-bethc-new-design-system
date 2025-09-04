import React from 'react';

interface AnimationProviderProps {
  children: React.ReactNode;
  showPreloader?: boolean;
}

const AnimationProvider: React.FC<AnimationProviderProps> = ({ 
  children, 
  showPreloader 
}) => {
  return (
    <div className="bg-surface-neutral-inverse">
      {children}
    </div>
  );
};

export default AnimationProvider;