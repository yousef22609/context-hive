
import React, { useEffect, useRef } from 'react';

const FireEffects: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle system for fire effect
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      life: number;
      maxLife: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        // Random velocities for movement
        this.vx = Math.random() * 1 - 0.5;
        this.vy = Math.random() * -3 - 1;
        this.size = Math.random() * 15 + 5;
        
        // Fire colors: orange to red gradient
        const r = Math.floor(Math.random() * 55) + 200; // Red: 200-255
        const g = Math.floor(Math.random() * 100) + 50; // Green: 50-150
        const b = Math.floor(Math.random() * 20); // Blue: 0-20
        const a = Math.random() * 0.5 + 0.2; // Alpha: 0.2-0.7
        
        this.color = `rgba(${r}, ${g}, ${b}, ${a})`;
        this.life = 0;
        this.maxLife = Math.random() * 50 + 50;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.size *= 0.97;
        this.life++;
        return this.life < this.maxLife && this.size > 0.5;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const fadeRatio = 1 - this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Particles array
    let particles: Particle[] = [];

    // Create fire sources at the bottom of the screen
    const fireSourcePositions: {x: number, y: number}[] = [];
    const numberOfSources = 5;
    
    for (let i = 0; i < numberOfSources; i++) {
      fireSourcePositions.push({
        x: (canvas.width / (numberOfSources + 1)) * (i + 1),
        y: canvas.height + 20
      });
    }

    // Animation frame
    const animate = () => {
      // Add semi-transparent layer to create trail effect
      ctx.fillStyle = 'rgba(26, 31, 44, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Generate new particles from fire sources
      fireSourcePositions.forEach(source => {
        for (let i = 0; i < 2; i++) {
          particles.push(new Particle(
            source.x + Math.random() * 40 - 20, 
            source.y
          ));
        }
      });

      // Update and draw particles
      particles = particles.filter(p => {
        p.update();
        p.draw(ctx);
        return p.life < p.maxLife && p.size > 0.5;
      });

      requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Recalculate fire source positions
      for (let i = 0; i < numberOfSources; i++) {
        fireSourcePositions[i] = {
          x: (canvas.width / (numberOfSources + 1)) * (i + 1),
          y: canvas.height + 20
        };
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default FireEffects;
