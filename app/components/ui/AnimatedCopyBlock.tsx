import React from 'react';

interface AnimatedCopyBlockProps {
  lines: string[];
  stagger?: number;
  duration?: number;
  triggerStart?: string;
  triggerEnd?: string;
}

const AnimatedCopyBlock: React.FC<AnimatedCopyBlockProps> = ({ 
  lines, 
  stagger, 
  duration, 
  triggerStart, 
  triggerEnd 
}) => {
  return (
    <div className="padding-md text-neutral-inverse">
      {lines.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  );
};

export default AnimatedCopyBlock;