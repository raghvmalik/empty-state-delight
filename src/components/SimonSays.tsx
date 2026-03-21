import { useState, useEffect, useCallback } from 'react';

interface SimonSaysProps {
  visible: boolean;
  onComplete: () => void;
}

const COLORS = [
  { key: 'r', label: 'R', color: 'bg-red-500', glow: 'shadow-red-500/50' },
  { key: 'g', label: 'G', color: 'bg-green-500', glow: 'shadow-green-500/50' },
  { key: 'b', label: 'B', color: 'bg-blue-500', glow: 'shadow-blue-500/50' },
  { key: 'y', label: 'Y', color: 'bg-yellow-500', glow: 'shadow-yellow-500/50' },
];

const SimonSays = ({ visible, onComplete }: SimonSaysProps) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<'showing' | 'input' | 'success' | 'fail'>('showing');
  const [message, setMessage] = useState('Watch the sequence...');
  const maxRounds = 4;

  const generateNext = useCallback(() => {
    const newSeq = [...sequence, Math.floor(Math.random() * 4)];
    setSequence(newSeq);
    setPlayerInput([]);
    setPhase('showing');
    setMessage('Watch the sequence...');

    // Play the sequence
    newSeq.forEach((colorIdx, i) => {
      setTimeout(() => {
        setActiveColor(colorIdx);
        setTimeout(() => setActiveColor(null), 400);
      }, (i + 1) * 700);
    });

    setTimeout(() => {
      setPhase('input');
      setMessage('Your turn! Press the keys: R, G, B, Y');
    }, (newSeq.length + 1) * 700);
  }, [sequence]);

  useEffect(() => {
    if (!visible) return;
    if (sequence.length === 0) {
      generateNext();
    }
  }, [visible]);

  useEffect(() => {
    if (!visible || phase !== 'input') return;

    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const colorIdx = COLORS.findIndex(c => c.key === key);
      if (colorIdx === -1) return;

      setActiveColor(colorIdx);
      setTimeout(() => setActiveColor(null), 200);

      const newInput = [...playerInput, colorIdx];
      setPlayerInput(newInput);

      const currentIdx = newInput.length - 1;
      if (newInput[currentIdx] !== sequence[currentIdx]) {
        setPhase('fail');
        setMessage('Wrong! Restarting sequence...');
        setTimeout(() => {
          setSequence([]);
          setPlayerInput([]);
          setRound(0);
          setTimeout(() => {
            setSequence([]);
            generateNext();
          }, 100);
        }, 1000);
        return;
      }

      if (newInput.length === sequence.length) {
        const newRound = round + 1;
        setRound(newRound);
        if (newRound >= maxRounds) {
          setPhase('success');
          setMessage('🎉 Perfect memory! You passed!');
          setTimeout(onComplete, 1500);
        } else {
          setMessage(`Round ${newRound + 1}/${maxRounds} — Get ready...`);
          setTimeout(generateNext, 1000);
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [visible, phase, playerInput, sequence, round, generateNext, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[168] bg-background/90 backdrop-blur-sm flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
      <div className="text-center animate-scale-in">
        <h3 className="text-lg font-bold mb-2">🧠 Simon Says</h3>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>
        <p className="text-xs text-accent mb-4">Round {Math.min(round + 1, maxRounds)}/{maxRounds}</p>
        
        <div className="grid grid-cols-2 gap-3 w-48 mx-auto mb-6">
          {COLORS.map((color, i) => (
            <div
              key={i}
              className={`w-20 h-20 rounded-lg ${color.color} transition-all duration-200 flex items-center justify-center text-2xl font-bold text-white/80 ${
                activeColor === i ? `scale-110 shadow-lg ${color.glow} brightness-150` : 'opacity-40 scale-100'
              }`}
            >
              {color.label}
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-1">
          {sequence.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i < playerInput.length
                  ? playerInput[i] === sequence[i] ? 'bg-accent' : 'bg-destructive'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {phase === 'fail' && (
          <p className="text-destructive text-sm mt-4 animate-shake">❌ Try again!</p>
        )}
      </div>
    </div>
  );
};

export default SimonSays;
