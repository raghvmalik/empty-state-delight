import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Quiz = () => {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    console.log('%c🎊 Congratulations! You found the real website!', 'color: #2dd4bf; font-size: 18px; font-weight: bold;');
    console.log('%cThis is where the quiz would normally begin...', 'color: #6b7280;');
    
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative scanlines">
      {showWelcome && (
        <div className="absolute inset-0 bg-background flex items-center justify-center z-20 animate-fade-out"
          style={{ animation: 'fade-out 0.5s ease-out 2.5s forwards' }}
        >
          <h1 className="text-4xl md:text-6xl font-mono font-bold animate-pulse-glow">
            Welcome! 🎉
          </h1>
        </div>
      )}

      <div className="text-center px-4 z-10">
        <div className="mb-8">
          <span className="text-accent text-sm font-mono tracking-widest">
            ✓ BARRIER BROKEN
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-mono font-bold mb-6">
          The Real Quiz Begins Here
        </h1>
        
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          You've proven you're persistent enough. This is where your BCA quiz 
          content would go. For now, enjoy this victory screen!
        </p>

        <div className="space-y-4">
          <div className="p-6 bg-card border border-border rounded-lg max-w-sm mx-auto">
            <h3 className="font-mono text-lg mb-2">Your Stats</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Barrier: Destroyed</li>
              <li>• Persistence: Maximum</li>
              <li>• Console Secrets: Discovered</li>
              <li>• Status: Ready to Quiz</li>
            </ul>
          </div>

          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-secondary text-secondary-foreground font-mono text-sm rounded hover:opacity-80 transition-opacity"
          >
            ← Try Again (Reset)
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 text-xs text-muted-foreground opacity-50">
        <p>BCA Final Semester Project Demo</p>
      </div>

      <style>{`
        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; pointer-events: none; }
        }
      `}</style>
    </div>
  );
};

export default Quiz;
