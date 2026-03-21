import { useState, useEffect } from 'react';

interface LightsOutProps {
  visible: boolean;
  onSolved: () => void;
}

const LightsOut = ({ visible, onSolved }: LightsOutProps) => {
  const [flashlightPos, setFlashlightPos] = useState({ x: 50, y: 50 });
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const handleMove = (e: MouseEvent) => {
      setFlashlightPos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'l') {
        console.log('%c💡 Let there be light!', 'color: #2dd4bf; font-size: 16px;');
        onSolved();
      }
    };

    const hintTimer = setTimeout(() => setShowHint(true), 4000);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('keydown', handleKey);
    return () => {
      clearTimeout(hintTimer);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('keydown', handleKey);
    };
  }, [visible, onSolved]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[175] cursor-none">
      {/* Dark layer with flashlight cutout */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle 80px at ${flashlightPos.x}% ${flashlightPos.y}%, transparent 0%, rgba(0,0,0,0.97) 100%)`,
        }}
      />
      
      {/* Hidden text in the darkness */}
      <div 
        className="absolute text-xs text-accent/60 font-mono"
        style={{ left: '30%', top: '40%' }}
      >
        press "L" for lights
      </div>
      <div 
        className="absolute text-xs text-accent/60 font-mono"
        style={{ left: '60%', top: '60%' }}
      >
        🔦 find the switch
      </div>
      <div 
        className="absolute text-xs text-accent/60 font-mono"
        style={{ left: '20%', top: '70%' }}
      >
        it's dark in here...
      </div>
      
      {/* Center message */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <p className="text-lg text-foreground/30 font-mono">WHO TURNED OFF THE LIGHTS?!</p>
        <p className="text-sm text-muted-foreground/20 mt-2">Move your mouse to look around...</p>
      </div>

      {showHint && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs text-accent animate-pulse pointer-events-none">
          💡 Press "L" to turn the lights back on!
        </div>
      )}
    </div>
  );
};

export default LightsOut;
