import { useState, useEffect, useRef } from 'react';

interface FakePopupProps {
  onClose: () => void;
  position: { x: number; y: number };
  message: string;
}

const trollMessages = [
  "Ha! You thought that would work?",
  "The button is faster than you!",
  "Maybe try clicking slower? 😈",
  "You're really committed to this!",
  "ERROR: User skill issue detected",
  "I could do this all day...",
  "Your persistence is noted... and mocked.",
];

const fakeErrors = [
  "Error 418: I'm a teapot",
  "Error 404: Button not found",
  "Error 999: User too slow",
  "Error -1: Reality malfunction",
  "Error π: Irrational behavior",
];

const FakePopup = ({ onClose, position, message }: FakePopupProps) => {
  const [isShaking, setIsShaking] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [escapeCount, setEscapeCount] = useState(0);
  const [currentTroll, setCurrentTroll] = useState(message);
  const [showMiniPopups, setShowMiniPopups] = useState(false);
  const [spinButton, setSpinButton] = useState(false);
  const [buttonScale, setButtonScale] = useState(1);
  const [showFakeError, setShowFakeError] = useState(false);
  const [fakeErrorMsg, setFakeErrorMsg] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [buttonOpacity, setButtonOpacity] = useState(1);
  const popupRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for button escape
  useEffect(() => {
    if (escapeCount < 3) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!popupRef.current) return;
      const rect = popupRef.current.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2 + buttonPosition.x;
      const buttonCenterY = rect.bottom - 40 + buttonPosition.y;
      
      const dx = e.clientX - buttonCenterX;
      const dy = e.clientY - buttonCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const angle = Math.atan2(dy, dx);
        setButtonPosition({
          x: -Math.cos(angle) * 80,
          y: -Math.sin(angle) * 40,
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [escapeCount, buttonPosition]);

  const handleCloseAttempt = () => {
    const newCount = escapeCount + 1;
    setEscapeCount(newCount);
    
    // Different trolling behaviors based on escape count
    if (newCount < 6) {
      // Button runs away
      setButtonPosition({
        x: (Math.random() - 0.5) * 150,
        y: (Math.random() - 0.5) * 80,
      });
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
      
      setCurrentTroll(trollMessages[Math.min(newCount - 1, trollMessages.length - 1)]);
      console.log('%c😈 Nice try! The button escaped!', 'color: #ef4444;');
    } else if (newCount === 6) {
      // Button starts spinning
      setSpinButton(true);
      setCurrentTroll("The button is having an existential crisis!");
    } else if (newCount === 7) {
      // Button shrinks
      setButtonScale(0.5);
      setSpinButton(false);
      setCurrentTroll("The button is scared of you!");
    } else if (newCount === 8) {
      // Show fake error
      setShowFakeError(true);
      setFakeErrorMsg(fakeErrors[Math.floor(Math.random() * fakeErrors.length)]);
      setTimeout(() => setShowFakeError(false), 1500);
    } else if (newCount === 9) {
      // Flip the popup
      setIsFlipped(true);
      setCurrentTroll("ǝɯ pɐǝɹ uɐɔ noʎ ǝdoH");
    } else if (newCount === 10) {
      // Button becomes ghost
      setButtonOpacity(0.3);
      setIsFlipped(false);
      setCurrentTroll("The button is fading from existence...");
    } else if (newCount === 11) {
      // Spawn mini popups
      setShowMiniPopups(true);
      setCurrentTroll("MORE POPUPS! 🎉");
    } else if (newCount >= 15) {
      // Finally close after 15 attempts
      console.log('%c🎉 You survived the popup chaos!', 'color: #2dd4bf; font-size: 16px;');
      onClose();
    }
  };

  return (
    <>
      <div 
        ref={popupRef}
        className={`fixed z-[100] bg-card border border-border rounded-lg shadow-2xl p-4 w-80 animate-scale-in transition-all duration-300 ${
          isFlipped ? 'scale-y-[-1]' : ''
        }`}
        style={{ 
          left: `${position.x}%`, 
          top: `${position.y}%`,
        }}
      >
        {/* Fake window controls */}
        <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer" onClick={handleCloseAttempt}></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 cursor-pointer" onClick={handleCloseAttempt}></div>
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 cursor-pointer" onClick={handleCloseAttempt}></div>
          </div>
          <span className="text-xs text-muted-foreground font-mono">definitely_not_a_virus.exe</span>
          <button 
            onClick={handleCloseAttempt}
            className="text-muted-foreground hover:text-foreground text-lg leading-none px-2 hover:bg-muted rounded"
          >
            ×
          </button>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl animate-bounce">⚠️</span>
          <div>
            <p className="text-destructive text-sm font-bold">CRITICAL WARNING</p>
            <p className="text-xs text-muted-foreground">System has detected user interaction</p>
          </div>
        </div>
        
        <p className={`text-sm mb-4 ${isShaking ? 'animate-shake' : ''}`}>
          {currentTroll}
        </p>

        {/* Fake loading indicator */}
        {escapeCount >= 4 && escapeCount < 8 && (
          <div className="mb-4">
            <div className="h-1 bg-muted rounded overflow-hidden">
              <div className="h-full bg-destructive animate-pulse" style={{ width: '100%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Processing your frustration...</p>
          </div>
        )}
        
        {/* Fake error overlay */}
        {showFakeError && (
          <div className="absolute inset-0 bg-destructive/90 rounded-lg flex items-center justify-center animate-pulse">
            <div className="text-center text-destructive-foreground p-4">
              <p className="font-mono text-lg font-bold">💀 FATAL ERROR 💀</p>
              <p className="text-sm mt-2">{fakeErrorMsg}</p>
            </div>
          </div>
        )}
        
        <div className="flex gap-2 relative">
          <button
            onClick={handleCloseAttempt}
            className={`flex-1 px-3 py-2 bg-secondary text-secondary-foreground text-sm rounded hover:opacity-80 transition-all ${
              spinButton ? 'animate-spin' : ''
            }`}
            style={{
              transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px) scale(${buttonScale})`,
              transition: 'transform 0.2s ease-out',
              opacity: buttonOpacity,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCloseAttempt}
            className={`flex-1 px-3 py-2 bg-destructive text-destructive-foreground text-sm rounded hover:opacity-80 transition-all ${
              spinButton ? 'animate-spin' : ''
            }`}
            style={{
              transform: `scale(${buttonScale})`,
              opacity: buttonOpacity,
              animationDelay: '0.1s',
            }}
          >
            Yes, Continue
          </button>
        </div>
        
        {escapeCount > 0 && (
          <div className="mt-3 text-center">
            <p className="text-xs text-muted-foreground">
              Button escaped {escapeCount} time(s)!
            </p>
            <div className="flex justify-center gap-1 mt-1">
              {Array.from({ length: Math.min(escapeCount, 12) }).map((_, i) => (
                <span key={i} className="text-xs">😈</span>
              ))}
            </div>
          </div>
        )}

        {/* Helpful hint after many attempts */}
        {escapeCount >= 5 && (
          <p className="text-xs text-accent mt-2 text-center animate-pulse">
            💡 Hint: Try pressing ESC to escape the popup chaos!
          </p>
        )}
      </div>

      {/* Mini popup spawns */}
      {showMiniPopups && (
        <>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="fixed z-[99] bg-card border border-border rounded p-2 shadow-lg animate-scale-in"
              style={{
                left: `${15 + i * 20}%`,
                top: `${30 + (i % 2) * 30}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <p className="text-xs">🎉 Bonus popup #{i + 1}!</p>
              <button
                onClick={handleCloseAttempt}
                className="text-xs px-2 py-1 bg-muted rounded mt-1 w-full hover:bg-muted/80"
              >
                Close? 😏
              </button>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default FakePopup;
