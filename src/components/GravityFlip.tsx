import { useEffect, useState } from 'react';

interface GravityFlipProps {
  active: boolean;
}

const GravityFlip = ({ active }: GravityFlipProps) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!active) {
      setRotation(0);
      return;
    }

    const interval = setInterval(() => {
      setRotation(prev => (prev + 180) % 360);
    }, 3000);

    return () => clearInterval(interval);
  }, [active]);

  useEffect(() => {
    if (active) {
      document.body.style.transition = 'transform 1s ease-in-out';
      document.body.style.transform = `rotate(${rotation}deg)`;
    } else {
      document.body.style.transform = 'none';
      document.body.style.transition = '';
    }

    return () => {
      document.body.style.transform = 'none';
      document.body.style.transition = '';
    };
  }, [rotation, active]);

  if (!active) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[90] text-xs text-accent animate-pulse pointer-events-none">
      💡 Gravity is broken! Press "G" to stabilize
    </div>
  );
};

export default GravityFlip;
