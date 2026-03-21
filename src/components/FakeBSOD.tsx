import { useState, useEffect } from 'react';

interface FakeBSODProps {
  visible: boolean;
  onDismiss: () => void;
}

const FakeBSOD = ({ visible, onDismiss }: FakeBSODProps) => {
  const [showHint, setShowHint] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) return;
    
    const timer = setTimeout(() => setShowHint(true), 3000);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Progress goes up then resets at random points
        if (Math.random() < 0.1 && prev > 30) {
          return prev - 20;
        }
        return prev + Math.random() * 3;
      });
    }, 200);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'b') {
        console.log('%c🎉 BSOD bypassed! Press "B" for Blue Screen of Death... or to Beat it!', 'color: #2dd4bf;');
        onDismiss();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
      window.removeEventListener('keydown', handleKey);
    };
  }, [visible, onDismiss]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[180] bg-[#0078d4] flex items-center justify-center p-8 cursor-none animate-scale-in">
      <div className="max-w-xl text-white font-mono">
        <p className="text-8xl mb-8">:(</p>
        <p className="text-xl mb-4">Your PC ran into a problem and needs to restart.</p>
        <p className="text-sm mb-6 opacity-80">
          We're just collecting some error info, and then we'll restart for you.
        </p>
        <p className="text-sm mb-2">{Math.floor(Math.min(progress, 99))}% complete</p>
        <div className="w-64 h-1 bg-white/30 rounded overflow-hidden mb-8">
          <div 
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${Math.min(progress, 99)}%` }}
          />
        </div>
        <p className="text-xs opacity-60 mb-2">
          Stop code: WEBSITE_PERSISTENCE_OVERFLOW
        </p>
        <p className="text-xs opacity-60">
          If you'd like to know more, search online for: USER_TOO_STUBBORN_TO_LEAVE
        </p>

        {showHint && (
          <div className="mt-8 animate-pulse">
            <p className="text-xs text-yellow-300">
              💡 This isn't real... press "B" to bypass
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FakeBSOD;
