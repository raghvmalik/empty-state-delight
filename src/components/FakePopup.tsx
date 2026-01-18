import { useState, useEffect } from 'react';

interface FakePopupProps {
  onClose: () => void;
  position: { x: number; y: number };
  message: string;
}

const FakePopup = ({ onClose, position, message }: FakePopupProps) => {
  const [isShaking, setIsShaking] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [escapeCount, setEscapeCount] = useState(0);

  const handleCloseAttempt = () => {
    if (escapeCount < 2) {
      // Button runs away
      setButtonPosition({
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 50,
      });
      setEscapeCount(prev => prev + 1);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
      console.log('%c😈 Nice try! The button escaped!', 'color: #ef4444;');
    } else {
      onClose();
    }
  };

  return (
    <div 
      className="fixed z-[100] bg-card border border-border rounded-lg shadow-2xl p-4 w-72 animate-scale-in"
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-destructive text-sm font-bold">⚠️ Warning</span>
        <button 
          onClick={handleCloseAttempt}
          className="text-muted-foreground hover:text-foreground text-lg leading-none"
        >
          ×
        </button>
      </div>
      
      <p className={`text-sm mb-4 ${isShaking ? 'animate-shake' : ''}`}>
        {message}
      </p>
      
      <div className="flex gap-2">
        <button
          onClick={handleCloseAttempt}
          className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground text-sm rounded hover:opacity-80 transition-all"
          style={{
            transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px)`,
            transition: 'transform 0.2s ease-out',
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleCloseAttempt}
          className="flex-1 px-3 py-2 bg-destructive text-destructive-foreground text-sm rounded hover:opacity-80"
        >
          Yes, Continue
        </button>
      </div>
      
      {escapeCount > 0 && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          The button escaped {escapeCount} time(s)!
        </p>
      )}
    </div>
  );
};

export default FakePopup;
