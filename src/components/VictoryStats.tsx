import { useState, useEffect } from 'react';
import { playVictory } from '@/lib/sounds';

interface VictoryStatsProps {
  totalClicks: number;
  timeTaken: number; // in seconds
  stagesCleared: number;
  totalStages: number;
  onContinue: () => void;
}

const VictoryStats = ({ totalClicks, timeTaken, stagesCleared, totalStages, onContinue }: VictoryStatsProps) => {
  const [showStats, setShowStats] = useState(false);
  const [countUp, setCountUp] = useState({ clicks: 0, time: 0, stages: 0 });
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    playVictory();
    setTimeout(() => setShowStats(true), 500);
  }, []);

  useEffect(() => {
    if (!showStats) return;

    const duration = 1500;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      setCountUp({
        clicks: Math.floor(totalClicks * eased),
        time: Math.floor(timeTaken * eased),
        stages: Math.floor(stagesCleared * eased),
      });
      if (step >= steps) {
        clearInterval(timer);
        setCountUp({ clicks: totalClicks, time: timeTaken, stages: stagesCleared });
        setTimeout(() => setShowButton(true), 500);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [showStats, totalClicks, timeTaken, stagesCleared]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getRating = () => {
    if (timeTaken < 60) return { emoji: '⚡', text: 'Speed Demon!' };
    if (timeTaken < 180) return { emoji: '🔥', text: 'Impressive!' };
    if (timeTaken < 300) return { emoji: '👏', text: 'Well Done!' };
    return { emoji: '🐢', text: 'Persistent!' };
  };

  const rating = getRating();

  return (
    <div className="fixed inset-0 z-[300] bg-background flex items-center justify-center animate-scale-in">
      <div className="text-center px-6 max-w-md">
        <h1 className="text-5xl md:text-7xl font-mono font-bold mb-4 animate-pulse-glow">
          🏆 YOU WIN!
        </h1>
        <p className="text-muted-foreground mb-8">The barrier has been destroyed.</p>

        {showStats && (
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-3xl font-mono font-bold text-accent">{countUp.clicks}</p>
                <p className="text-xs text-muted-foreground mt-1">Clicks</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-3xl font-mono font-bold text-accent">{formatTime(countUp.time)}</p>
                <p className="text-xs text-muted-foreground mt-1">Time</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-3xl font-mono font-bold text-accent">{countUp.stages}/{totalStages}</p>
                <p className="text-xs text-muted-foreground mt-1">Stages</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-4xl mb-1">{rating.emoji}</p>
              <p className="font-mono font-bold text-lg">{rating.text}</p>
            </div>
          </div>
        )}

        {showButton && (
          <button
            onClick={onContinue}
            className="px-8 py-4 bg-accent text-accent-foreground font-mono text-lg rounded hover:opacity-90 transition-all animate-scale-in"
          >
            Continue to Quiz →
          </button>
        )}
      </div>
    </div>
  );
};

export default VictoryStats;
