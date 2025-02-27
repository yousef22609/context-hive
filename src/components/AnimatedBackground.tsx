
import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  size: number;
  x: number;
  y: number;
  animationDuration: number;
}

const AnimatedBackground: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  
  useEffect(() => {
    const generateStars = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const numStars = Math.min(windowWidth, windowHeight) / 10; // Responsive number of stars
      
      const newStars: Star[] = [];
      
      for (let i = 0; i < numStars; i++) {
        newStars.push({
          id: i,
          size: Math.random() * 6 + 2, // Random size between 2-8px
          x: Math.random() * windowWidth,
          y: Math.random() * windowHeight,
          animationDuration: Math.random() * 4 + 2, // Random duration between 2-6s
        });
      }
      
      setStars(newStars);
    };
    
    generateStars();
    
    // Handle window resize
    const handleResize = () => {
      generateStars();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}px`,
            top: `${star.y}px`,
            animationDuration: `${star.animationDuration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
