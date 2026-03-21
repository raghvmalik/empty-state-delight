import { useState, useEffect } from 'react';

interface DiscoModeProps {
  active: boolean;
}

const discoColors = [
  'hsl(0, 100%, 50%)',
  'hsl(60, 100%, 50%)',
  'hsl(120, 100%, 50%)',
  'hsl(180, 100%, 50%)',
  'hsl(240, 100%, 50%)',
  'hsl(300, 100%, 50%)',
];

const DiscoMode = ({ active }: DiscoModeProps) => {
  const [colorIndex, setColorIndex] = useState(0);
  const [balls, setBalls] = useState<{ x: number; y: number; color: string; size: number }[]>([]);

  useEffect(() => {
    if (!active) return;

    const colorInterval = setInterval(() => {
      setColorIndex(prev => (prev + 1) % discoColors.length);
    }, 200);

    const ballInterval = setInterval(() => {
      setBalls(prev => {
        const newBalls = [
          ...prev.slice(-15),
          {
            x: Math.random() * 100,
            y: Math.random() * 100,
            color: discoColors[Math.floor(Math.random() * discoColors.length)],
            size: 20 + Math.random() * 60,
          },
        ];
        return newBalls;
      });
    }, 300);

    return () => {
      clearInterval(colorInterval);
      clearInterval(ballInterval);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[40] pointer-events-none overflow-hidden">
      {/* Color wash overlay */}
      <div
        className="absolute inset-0 opacity-10 transition-colors duration-200"
        style={{ backgroundColor: discoColors[colorIndex] }}
      />
      
      {/* Floating disco balls */}
      {balls.map((ball, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float opacity-20 blur-sm"
          style={{
            left: `${ball.x}%`,
            top: `${ball.y}%`,
            width: ball.size,
            height: ball.size,
            backgroundColor: ball.color,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}

      {/* Disco text */}
      <div className="absolute top-4 right-4 text-xs font-mono animate-pulse" style={{ color: discoColors[colorIndex] }}>
        🪩 DISCO MODE 🪩
      </div>
    </div>
  );
};

export default DiscoMode;
