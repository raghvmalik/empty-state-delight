import { useState, useEffect, useCallback } from 'react';

interface FakeVirusScanProps {
  visible: boolean;
  onComplete: () => void;
}

const scanItems = [
  { name: 'user_patience.dll', status: 'INFECTED', threat: 'Dangerously Low Patience' },
  { name: 'click_counter.sys', status: 'SUSPICIOUS', threat: 'Excessive Clicking Detected' },
  { name: 'stubbornness.exe', status: 'CRITICAL', threat: 'User Won\'t Leave' },
  { name: 'curiosity.bat', status: 'INFECTED', threat: 'Lethal Curiosity Levels' },
  { name: 'keyboard_skills.dll', status: 'OK', threat: 'Surprisingly Competent' },
  { name: 'persistence.sys', status: 'WARNING', threat: 'Off The Charts' },
  { name: 'free_time.tmp', status: 'MISSING', threat: 'User Has Too Much Free Time' },
  { name: 'sanity_check.exe', status: 'FAILED', threat: 'Sanity Not Found' },
  { name: 'website_barrier.fw', status: 'COMPROMISED', threat: 'Defenses Crumbling' },
  { name: 'final_boss.dat', status: 'LOADING', threat: 'Almost There...' },
];

const FakeVirusScan = ({ visible, onComplete }: FakeVirusScanProps) => {
  const [currentScan, setCurrentScan] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [phase, setPhase] = useState<'scanning' | 'results' | 'done'>('scanning');

  const finishScan = useCallback(() => {
    setPhase('done');
    setTimeout(onComplete, 1500);
  }, [onComplete]);

  useEffect(() => {
    if (!visible) return;

    const scanInterval = setInterval(() => {
      setCurrentScan(prev => {
        const next = prev + 1;
        setScanProgress((next / scanItems.length) * 100);
        if (next >= scanItems.length) {
          clearInterval(scanInterval);
          setPhase('results');
          setTimeout(finishScan, 3000);
        }
        return Math.min(next, scanItems.length);
      });
    }, 800);

    return () => clearInterval(scanInterval);
  }, [visible, finishScan]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[155] bg-background/95 backdrop-blur-sm flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
      <div className="bg-card border border-border rounded-lg p-6 w-96 max-h-[80vh] overflow-auto shadow-2xl animate-scale-in">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl animate-pulse">🛡️</span>
          <div>
            <h3 className="text-sm font-bold text-destructive">THREAT DETECTED</h3>
            <p className="text-xs text-muted-foreground">Scanning user behavior...</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-muted rounded overflow-hidden mb-4">
          <div 
            className="h-full bg-destructive transition-all duration-300"
            style={{ width: `${scanProgress}%` }}
          />
        </div>

        {/* Scan results */}
        <div className="space-y-1.5 mb-4 font-mono text-xs">
          {scanItems.slice(0, currentScan).map((item, i) => (
            <div key={i} className="flex justify-between items-center py-1 border-b border-border/50">
              <span className="text-muted-foreground truncate flex-1">{item.name}</span>
              <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                item.status === 'OK' ? 'bg-accent/20 text-accent' :
                item.status === 'CRITICAL' ? 'bg-destructive/20 text-destructive animate-pulse' :
                item.status === 'INFECTED' ? 'bg-destructive/10 text-destructive' :
                item.status === 'MISSING' ? 'bg-muted text-muted-foreground' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
          {currentScan < scanItems.length && (
            <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
              <span>⏳ Scanning {scanItems[currentScan]?.name}...</span>
            </div>
          )}
        </div>

        {phase === 'results' && (
          <div className="border border-destructive/30 rounded p-3 bg-destructive/5 animate-scale-in">
            <p className="text-xs font-bold text-destructive mb-1">⚠️ SCAN COMPLETE</p>
            <p className="text-xs text-muted-foreground">
              Found: 4 infections, 2 warnings, 1 missing file, 1 critical threat.
            </p>
            <p className="text-xs text-accent mt-2">
              Diagnosis: User is too persistent. Recommending... letting them through.
            </p>
          </div>
        )}

        {phase === 'done' && (
          <div className="text-center animate-scale-in">
            <p className="text-accent text-sm font-bold">✅ Scan complete. You may proceed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FakeVirusScan;
