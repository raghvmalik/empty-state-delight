import { useState, useEffect, useRef } from 'react';

interface PasswordTrollProps {
  visible: boolean;
  onSolved: () => void;
}

const wrongMessages = [
  "Nope! 🙅",
  "Not even close!",
  "Are you even trying?",
  "That's definitely wrong.",
  "Hint: It's not that.",
  "Warmer... just kidding. Ice cold.",
  "The password is literally on screen...",
];

const PasswordTroll = ({ visible, onSolved }: PasswordTrollProps) => {
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [wrongMsg, setWrongMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const password = 'letmein';

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  useEffect(() => {
    if (attempts >= 3) {
      setShowPassword(true);
    }
  }, [attempts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (input.toLowerCase() === password) {
      console.log('%c🎉 Password correct! You typed "letmein"!', 'color: #2dd4bf; font-size: 14px;');
      onSolved();
    } else {
      setAttempts(prev => prev + 1);
      setWrongMsg(wrongMessages[Math.min(attempts, wrongMessages.length - 1)]);
      setShaking(true);
      setInput('');
      setTimeout(() => setShaking(false), 500);
      console.log(`%c❌ Wrong password: "${input}"`, 'color: #ef4444;');
    }
  };

  if (!visible) return null;

  return (
    <div 
      className="fixed inset-0 z-[160] bg-background/95 backdrop-blur-sm flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`bg-card border border-border rounded-lg p-6 w-80 shadow-2xl ${shaking ? 'animate-shake' : 'animate-scale-in'}`}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🔒</span>
          <h3 className="text-sm font-bold">Authentication Required</h3>
        </div>
        
        <p className="text-xs text-muted-foreground mb-4">
          Enter the password to continue clicking.
        </p>

        {showPassword && (
          <div className="mb-3 p-2 bg-muted rounded text-xs">
            <span className="text-muted-foreground">Hint: The password is </span>
            <span className="text-accent font-bold tracking-wider">{password}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter password..."
            className="w-full bg-muted border border-border rounded px-3 py-2 text-sm font-mono mb-3 focus:outline-none focus:ring-1 focus:ring-accent"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="submit"
            className="w-full bg-accent text-accent-foreground text-sm py-2 rounded hover:opacity-90 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            Submit
          </button>
        </form>
        
        {wrongMsg && (
          <p className="text-xs text-destructive mt-3 text-center animate-pulse">
            {wrongMsg}
          </p>
        )}
        
        <p className="text-xs text-muted-foreground mt-3 text-center opacity-50">
          Attempts: {attempts}
        </p>
      </div>
    </div>
  );
};

export default PasswordTroll;
