import { useState, useEffect } from 'react';

interface CountdownTrollProps {
  visible: boolean;
  onComplete: () => void;
}

const CountdownTroll = ({ visible, onComplete }: CountdownTrollProps) => {
  const [count, setCount] = useState(10);
  const [resets, setResets] = useState(0);
  const [message, setMessage] = useState('Website unlocking in...');

  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          if (resets < 2) {
            // Reset the counter trollishly
            setResets(r => r + 1);
            setMessage(
              resets === 0 
                ? "Just kidding! Restarting..." 
                : "One more time, I promise!"
            );
            console.log('%c😈 Countdown reset! Patience is a virtue...', 'color: #ef4444;');
            return 10;
          } else {
            clearInterval(interval);
            setMessage("Fine, you win this round.");
            setTimeout(onComplete, 500);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [visible, resets, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[170] bg-background/90 backdrop-blur-sm flex items-center justify-center pointer-events-none">
      <div className="text-center animate-scale-in">
        <p className="text-sm text-muted-foreground mb-4">{message}</p>
        <p className="text-8xl font-mono font-bold text-accent animate-pulse-glow">
          {count}
        </p>
        {resets > 0 && (
          <p className="text-xs text-destructive mt-4">
            Reset {resets} time{resets > 1 ? 's' : ''}... {resets >= 2 ? '(last one, I swear)' : ''}
          </p>
        )}
      </div>
    </div>
  );
};

export default CountdownTroll;
