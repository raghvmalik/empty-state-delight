import { useState, useEffect } from 'react';

interface CursorBlockerProps {
  visible: boolean;
}

const taunts = [
  "cursor.exe has stopped responding",
  "Your clicks mean nothing now",
  "404: Mouse pointer not found",
  "Have you tried pressing 'C'?",
  "The cursor is on vacation",
  "Click all you want, nothing happens!",
];

const CursorBlocker = ({ visible }: CursorBlockerProps) => {
  const [currentTaunt, setCurrentTaunt] = useState(0);
  const [clickAttempts, setClickAttempts] = useState(0);
  const [showRageMessage, setShowRageMessage] = useState(false);

  useEffect(() => {
    if (!visible) return;
    
    const interval = setInterval(() => {
      setCurrentTaunt(prev => (prev + 1) % taunts.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    
    const handleClick = () => {
      setClickAttempts(prev => {
        const newCount = prev + 1;
        if (newCount >= 5) {
          setShowRageMessage(true);
          setTimeout(() => setShowRageMessage(false), 1500);
        }
        console.log(`%c🚫 Click blocked! (${newCount} attempts)`, 'color: #ef4444;');
        return newCount;
      });
    };
    
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center">
      {/* Dark overlay with scanlines effect */}
      <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px]" />
      
      {/* Fake cursor replacement */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <span className="text-6xl animate-pulse">🚫</span>
          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm text-destructive whitespace-nowrap font-mono animate-pulse">
            {taunts[currentTaunt]}
          </span>
        </div>
      </div>

      {/* Rage message */}
      {showRageMessage && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground px-4 py-2 rounded font-mono text-sm animate-shake">
          Stop clicking! Try the keyboard! 😈
        </div>
      )}
      
      {/* Floating taunts */}
      <div className="absolute top-1/4 right-1/4 text-sm text-muted-foreground animate-float opacity-60">
        Missing something?
      </div>
      <div className="absolute bottom-1/4 left-1/4 text-sm text-muted-foreground animate-float opacity-60" style={{ animationDelay: '1s' }}>
        Check your keyboard...
      </div>
      <div className="absolute top-1/3 left-1/5 text-lg animate-bounce opacity-40" style={{ animationDelay: '0.5s' }}>
        🔑
      </div>
      <div className="absolute bottom-1/3 right-1/5 text-lg animate-bounce opacity-40" style={{ animationDelay: '1.5s' }}>
        ⌨️
      </div>

      {/* Click attempt counter */}
      {clickAttempts > 0 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-mono opacity-50">
          Blocked clicks: {clickAttempts}
        </div>
      )}

      {/* Big hint after many attempts */}
      {clickAttempts >= 3 && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center animate-pulse">
          <p className="text-accent text-sm font-bold">💡 HINT 💡</p>
          <p className="text-accent/80 text-xs mt-1">Press the letter "C" on your keyboard</p>
        </div>
      )}
    </div>
  );
};

export default CursorBlocker;
