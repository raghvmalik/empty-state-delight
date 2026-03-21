import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FakeNavigation from '@/components/FakeNavigation';
import LoadingScreen from '@/components/LoadingScreen';
import CrackOverlay from '@/components/CrackOverlay';
import FakePopup from '@/components/FakePopup';
import CursorBlocker from '@/components/CursorBlocker';
import MatrixRain from '@/components/MatrixRain';
import FakeBSOD from '@/components/FakeBSOD';
import PasswordTroll from '@/components/PasswordTroll';
import GravityFlip from '@/components/GravityFlip';
import CountdownTroll from '@/components/CountdownTroll';

const messages = [
  "There is no website here.",
  "Seriously.. Nothing to see.",
  "Why are you still clicking?",
  "STOP.",
  "I'm warning you...",
  "Fine. I'll take your cursor.",
  "Ha! Try clicking now!",
  "...How did you get it back?!",
  "Okay, new strategy...",
  "Catch the text if you can!",
  "You're not giving up?!",
  "Time for popups! 😈",
  "YOU CLOSED THEM?!",
  "Let me check your identity...",
  "Fine. You passed.",
  "BLUE SCREEN TIME!",
  "HOW?! You bypassed it!",
  "The world is upside down!",
  "Wait... let me count down...",
  "3... 2... 1... JUST KIDDING!",
  "The matrix has you...",
  "The cracks are forming...",
  "I can't hold on much longer!",
  "FINE! YOU WIN! :/",
];

const consoleHints = [
  "🤫 Psst... keep clicking.",
  "🔍 Something's hidden here...",
  "💡 The website is getting annoyed...",
  "⌨️ Hint: Try pressing some keys when stuck...",
  "🎮 This is basically a game now.",
  "🔓 You're making progress!",
  "✨ The defenses are weakening!",
  "🏆 You're a legend if you make it!",
  "🎉 Almost there!",
];

const Index = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Core state
  const [clickCount, setClickCount] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Visual effects
  const [isGlitching, setIsGlitching] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showCracks, setShowCracks] = useState(false);
  const [crackIntensity, setCrackIntensity] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  
  // Stage states
  const [cursorHidden, setCursorHidden] = useState(false);
  const [cursorRestored, setCursorRestored] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [isRunningAway, setIsRunningAway] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupCount, setPopupCount] = useState(0);
  const [screenInverted, setScreenInverted] = useState(false);
  const [showFakeProgress, setShowFakeProgress] = useState(false);
  const [fakeProgress, setFakeProgress] = useState(0);
  const [secretKeyPressed, setSecretKeyPressed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showKeyHint, setShowKeyHint] = useState(false);
  
  // New stage states
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSolved, setPasswordSolved] = useState(false);
  const [showBSOD, setShowBSOD] = useState(false);
  const [bsodDismissed, setBsodDismissed] = useState(false);
  const [gravityFlip, setGravityFlip] = useState(false);
  const [gravityFixed, setGravityFixed] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownDone, setCountdownDone] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [textScramble, setTextScramble] = useState(false);
  const [screenZoom, setScreenZoom] = useState(1);
  const [screenRotate, setScreenRotate] = useState(0);
  const [confettiEmojis, setConfettiEmojis] = useState<{x: number, y: number, emoji: string, id: number}[]>([]);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [miniGameTarget, setMiniGameTarget] = useState({ x: 50, y: 50 });
  const [miniGameHits, setMiniGameHits] = useState(0);

  const breakThreshold = 90;

  // Console welcome
  useEffect(() => {
    console.log('%c🎭 Welcome, curious one...', 'color: #2dd4bf; font-size: 20px; font-weight: bold;');
    console.log('%cThere really is no website here. Or is there?', 'color: #6b7280; font-size: 14px;');
    console.log('%c💡 Hint: The website will fight back. Be persistent.', 'color: #fbbf24; font-size: 12px;');
  }, []);

  // Track mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cursorHidden && !cursorRestored && e.key.toLowerCase() === 'c') {
        console.log('%c🎉 Cursor restored!', 'color: #2dd4bf; font-size: 16px;');
        setCursorRestored(true);
        setCursorHidden(false);
        setSecretKeyPressed(true);
        setClickCount(prev => prev + 3);
      }
      
      if (showPopup && e.key === 'Escape') {
        console.log('%c🎉 ESC closes the chaos!', 'color: #2dd4bf;');
        setShowPopup(false);
        setPopupCount(0);
        setClickCount(prev => prev + 2);
      }

      if (isRunningAway && e.key.toLowerCase() === 'r') {
        console.log('%c🎉 Text frozen!', 'color: #2dd4bf;');
        setIsRunningAway(false);
        setTextPosition({ x: 0, y: 0 });
        setClickCount(prev => prev + 2);
      }

      if (gravityFlip && !gravityFixed && e.key.toLowerCase() === 'g') {
        console.log('%c🎉 Gravity stabilized!', 'color: #2dd4bf;');
        setGravityFlip(false);
        setGravityFixed(true);
        setClickCount(prev => prev + 3);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cursorHidden, cursorRestored, showPopup, isRunningAway, gravityFlip, gravityFixed]);

  // Stage progression
  useEffect(() => {
    const messageIndex = Math.min(
      Math.floor(clickCount / 4),
      messages.length - 1
    );
    setCurrentMessage(messageIndex);

    if (clickCount > 0 && clickCount % 7 === 0) {
      const hintIndex = Math.min(
        Math.floor(clickCount / 7),
        consoleHints.length - 1
      );
      console.log(`%c${consoleHints[hintIndex]}`, 'color: #fbbf24; font-size: 12px;');
    }

    // STAGE 1: Initial annoyance (0-10)
    if (clickCount >= 5 && clickCount < 10) {
      // Random screen zoom pulses
      if (Math.random() > 0.6) {
        setScreenZoom(1 + Math.random() * 0.05);
        setTimeout(() => setScreenZoom(1), 300);
      }
    }

    // STAGE 2: Cursor disappears (10-18)
    if (clickCount >= 10 && !cursorRestored && !secretKeyPressed) {
      setCursorHidden(true);
      setShowKeyHint(true);
    }

    // STAGE 3: Text runs away (18-25)
    if (clickCount >= 18 && clickCount < 25 && !isRunningAway && cursorRestored) {
      setIsRunningAway(true);
      console.log('%c🏃 Text is running! Press "R" to freeze!', 'color: #ef4444;');
    }

    // STAGE 4: Screen inversion flash (25-28)
    if (clickCount >= 25 && clickCount < 28) {
      setScreenInverted(true);
      setTimeout(() => setScreenInverted(false), 1500);
    }

    // STAGE 5: Popup chaos (28-35)
    if (clickCount >= 28 && clickCount < 35 && !showPopup && popupCount < 3) {
      setShowPopup(true);
      console.log('%c📢 Popup attack!', 'color: #ef4444;');
    }

    // STAGE 6: Password wall (35-42)
    if (clickCount >= 35 && !passwordSolved && !showPassword) {
      setShowPassword(true);
      console.log('%c🔒 Password required!', 'color: #ef4444;');
    }

    // STAGE 7: Fake progress (42-48)
    if (clickCount >= 42 && clickCount < 48 && !showFakeProgress && passwordSolved) {
      setShowFakeProgress(true);
      setFakeProgress(0);
    }

    // STAGE 8: Fake BSOD (48-55)
    if (clickCount >= 48 && !bsodDismissed && !showBSOD && passwordSolved) {
      setShowBSOD(true);
      setShowFakeProgress(false);
    }

    // STAGE 9: Gravity flip (55-62)
    if (clickCount >= 55 && !gravityFixed && !gravityFlip && bsodDismissed) {
      setGravityFlip(true);
      console.log('%c🌀 Gravity is broken! Press "G"!', 'color: #ef4444;');
    }

    // STAGE 10: Mini clicking game (62-70)
    if (clickCount >= 62 && clickCount < 70 && !showMiniGame && gravityFixed) {
      setShowMiniGame(true);
      setMiniGameHits(0);
      console.log('%c🎯 Quick! Click the targets!', 'color: #2dd4bf;');
    }

    // STAGE 11: Countdown troll (70-76)
    if (clickCount >= 70 && !countdownDone && !showCountdown && miniGameHits >= 5) {
      setShowCountdown(true);
      setShowMiniGame(false);
    }

    // STAGE 12: Matrix rain + text scramble (76-85)
    if (clickCount >= 76 && clickCount < 85 && countdownDone) {
      setShowMatrix(true);
      setTextScramble(true);
      // Random rotation
      if (Math.random() > 0.7) {
        setScreenRotate((Math.random() - 0.5) * 4);
        setTimeout(() => setScreenRotate(0), 500);
      }
    }

    if (clickCount >= 85) {
      setShowMatrix(false);
      setTextScramble(false);
    }

    // Cracks
    if (clickCount >= 30) {
      setShowCracks(true);
      setCrackIntensity(Math.min((clickCount - 30) / 40, 1));
    }

    // Reveal button
    if (clickCount >= breakThreshold - 5) {
      setIsRevealed(true);
    }

    // Final breakthrough
    if (clickCount >= breakThreshold) {
      console.log('%c💥 THE BARRIER IS BROKEN!', 'color: #ef4444; font-size: 24px; font-weight: bold;');
      // Spawn confetti
      const newConfetti = Array.from({ length: 20 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        emoji: ['🎉', '🎊', '✨', '🏆', '⭐'][Math.floor(Math.random() * 5)],
        id: i,
      }));
      setConfettiEmojis(newConfetti);
      setTimeout(() => setIsLoading(true), 1500);
    }
  }, [clickCount, cursorRestored, secretKeyPressed, popupCount, passwordSolved, bsodDismissed, gravityFixed, miniGameHits, countdownDone]);

  // Running text
  useEffect(() => {
    if (!isRunningAway) return;
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const dx = mousePosition.x - centerX;
    const dy = mousePosition.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 300) {
      const angle = Math.atan2(dy, dx);
      const pushDistance = (300 - distance) * 0.3;
      setTextPosition({
        x: -Math.cos(angle) * pushDistance,
        y: -Math.sin(angle) * pushDistance,
      });
    }
  }, [mousePosition, isRunningAway]);

  // Fake progress
  useEffect(() => {
    if (!showFakeProgress) return;
    const interval = setInterval(() => {
      setFakeProgress(prev => {
        if (prev >= 99) return 0;
        return prev + Math.random() * 10;
      });
    }, 500);
    if (clickCount >= 48) {
      setShowFakeProgress(false);
    }
    return () => clearInterval(interval);
  }, [showFakeProgress, clickCount]);

  // Mini game target movement
  useEffect(() => {
    if (!showMiniGame) return;
    const interval = setInterval(() => {
      setMiniGameTarget({
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [showMiniGame]);

  // Text scramble effect
  const scrambleText = (text: string) => {
    if (!textScramble) return text;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*';
    return text.split('').map(c => 
      c === ' ' ? ' ' : Math.random() > 0.6 ? chars[Math.floor(Math.random() * chars.length)] : c
    ).join('');
  };

  const handleClick = useCallback(() => {
    if (isLoading) return;
    
    if (cursorHidden && !cursorRestored) {
      console.log('%c🚫 Clicks disabled! Press "C"!', 'color: #ef4444;');
      return;
    }

    if (showPassword && !passwordSolved) return;
    if (showBSOD && !bsodDismissed) return;
    if (showCountdown && !countdownDone) return;
    
    setClickCount(prev => prev + 1);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    if (Math.random() > 0.5) {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 300);
    }

    // Spawn emoji on click location
    if (clickCount > 20) {
      const emoji = ['💥', '✨', '🔥', '⚡', '💀'][Math.floor(Math.random() * 5)];
      const newEmoji = { x: mousePosition.x, y: mousePosition.y, emoji, id: Date.now() };
      setConfettiEmojis(prev => [...prev.slice(-10), newEmoji]);
      setTimeout(() => {
        setConfettiEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
      }, 1000);
    }
  }, [isLoading, cursorHidden, cursorRestored, showPassword, passwordSolved, showBSOD, bsodDismissed, showCountdown, countdownDone, clickCount, mousePosition]);

  const handlePopupClose = () => {
    setPopupCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setShowPopup(false);
        setClickCount(c => c + 3);
        return 0;
      }
      return newCount;
    });
  };

  const handleMiniGameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMiniGameHits(prev => {
      const newHits = prev + 1;
      console.log(`%c🎯 Hit! ${newHits}/5`, 'color: #2dd4bf;');
      if (newHits >= 5) {
        setShowMiniGame(false);
        setClickCount(c => c + 5);
      }
      return newHits;
    });
    setMiniGameTarget({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
    });
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => navigate('/quiz')} />;
  }

  // Stage info for indicators
  const stages = [
    { threshold: 0, label: '👆' },
    { threshold: 10, label: '🖱️' },
    { threshold: 18, label: '🏃' },
    { threshold: 28, label: '📢' },
    { threshold: 35, label: '🔒' },
    { threshold: 42, label: '📊' },
    { threshold: 48, label: '💀' },
    { threshold: 55, label: '🌀' },
    { threshold: 62, label: '🎯' },
    { threshold: 70, label: '⏰' },
    { threshold: 76, label: '🟢' },
    { threshold: 85, label: '🏆' },
  ];

  const getSubtext = () => {
    if (clickCount < 5) return "Error 404 :-(";
    if (clickCount < 10) return "...or so you think.";
    if (clickCount < 18 && cursorHidden) return "Where did your cursor go? 😈";
    if (clickCount < 18) return "Clever! But I have more tricks...";
    if (clickCount < 25) return "Catch me if you can! (or press R)";
    if (clickCount < 28) return "Enjoying the inverted colors? 😏";
    if (clickCount < 35) return "Close all the popups! (or press ESC)";
    if (clickCount < 42) return "Type the password to continue...";
    if (clickCount < 48) return "Loading... or is it? 🤔";
    if (clickCount < 55) return "💀 BSOD! Press B to bypass!";
    if (clickCount < 62) return "🌀 Everything's upside down! Press G!";
    if (clickCount < 70) return "🎯 Click the targets! Quick!";
    if (clickCount < 76) return "⏰ Waiting for the countdown...";
    if (clickCount < 85) return "You're in the matrix now...";
    return "You're actually going to win... 🏆";
  };

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden scanlines select-none transition-all duration-300 ${
        cursorHidden ? 'cursor-none' : 'cursor-pointer'
      } ${screenInverted ? 'invert' : ''}`}
      style={{
        transform: `scale(${screenZoom}) rotate(${screenRotate}deg)`,
        transition: 'transform 0.3s ease',
      }}
      onClick={handleClick}
    >
      <CrackOverlay intensity={crackIntensity} visible={showCracks} />
      <CursorBlocker visible={cursorHidden && !cursorRestored} />
      <MatrixRain visible={showMatrix} />
      <FakeBSOD visible={showBSOD && !bsodDismissed} onDismiss={() => { setBsodDismissed(true); setClickCount(c => c + 3); }} />
      <PasswordTroll visible={showPassword && !passwordSolved} onSolved={() => { setPasswordSolved(true); setShowPassword(false); setClickCount(c => c + 5); }} />
      <GravityFlip active={gravityFlip && !gravityFixed} />
      <CountdownTroll visible={showCountdown && !countdownDone} onComplete={() => { setCountdownDone(true); setShowCountdown(false); setClickCount(c => c + 3); }} />
      
      {/* Popups */}
      {showPopup && (
        <>
          <FakePopup onClose={handlePopupClose} position={{ x: 20, y: 20 }} message="Are you sure you want to continue?" />
          {popupCount >= 1 && <FakePopup onClose={handlePopupClose} position={{ x: 40, y: 40 }} message="Are you REALLY sure?" />}
          {popupCount >= 2 && <FakePopup onClose={handlePopupClose} position={{ x: 60, y: 60 }} message="Last chance to give up!" />}
        </>
      )}

      {/* Mini clicking game */}
      {showMiniGame && (
        <div className="fixed inset-0 z-[150] pointer-events-none">
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px]" />
          <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-10">
            <p className="text-sm text-accent font-bold">🎯 Click the targets! ({miniGameHits}/5)</p>
          </div>
          <button
            className="absolute z-10 w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl pointer-events-auto hover:scale-110 transition-transform animate-pulse"
            style={{
              left: `${miniGameTarget.x}%`,
              top: `${miniGameTarget.y}%`,
              transition: 'left 0.3s, top 0.3s',
            }}
            onClick={handleMiniGameClick}
          >
            🎯
          </button>
        </div>
      )}
      
      <FakeNavigation onLinkClick={handleClick} isActive={isRevealed} clickCount={clickCount} />

      {/* Key hint */}
      {showKeyHint && cursorHidden && !cursorRestored && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 text-xs text-accent animate-pulse z-50">
          <p>💡 Your cursor is gone... press the right key to get it back</p>
          <p className="text-muted-foreground mt-1 opacity-50">Maybe try the first letter of "cursor"?</p>
        </div>
      )}

      {/* Fake progress */}
      {showFakeProgress && (
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-64 z-50">
          <p className="text-sm text-center mb-2 text-muted-foreground">Loading real website...</p>
          <div className="h-2 bg-muted rounded overflow-hidden">
            <div className="h-full bg-accent transition-all duration-300" style={{ width: `${Math.min(fakeProgress, 99)}%` }} />
          </div>
          <p className="text-xs text-center mt-1 text-muted-foreground">
            {fakeProgress >= 99 ? "Just kidding! 😈" : `${Math.floor(fakeProgress)}%`}
          </p>
        </div>
      )}

      {/* Click emojis */}
      {confettiEmojis.map(e => (
        <span
          key={e.id}
          className="fixed pointer-events-none text-2xl animate-float z-[60]"
          style={{ left: e.x, top: e.y, opacity: 0.8 }}
        >
          {e.emoji}
        </span>
      ))}

      {/* Main message */}
      <div 
        className="text-center z-10 px-4 transition-transform duration-100"
        style={{ transform: `translate(${textPosition.x}px, ${textPosition.y}px)` }}
      >
        <h1 
          className={`text-4xl md:text-6xl lg:text-7xl font-mono font-bold mb-6 transition-all duration-300 ${
            isGlitching ? 'animate-glitch' : ''
          } ${isShaking ? 'animate-shake' : ''} ${
            isRevealed ? 'animate-pulse-glow' : ''
          }`}
          style={{
            opacity: 1 - (crackIntensity * 0.3),
            filter: crackIntensity > 0.5 ? `blur(${crackIntensity * 2}px)` : 'none',
          }}
        >
          {scrambleText(messages[currentMessage])}
        </h1>

        <p className={`text-muted-foreground text-sm md:text-base transition-opacity duration-500 ${
          clickCount > 4 ? 'opacity-50' : 'opacity-100'
        }`}>
          {getSubtext()}
        </p>

        {/* Stage progress dots */}
        <div className="flex justify-center gap-1.5 mt-6 flex-wrap max-w-xs mx-auto">
          {stages.map((stage, i) => {
            const nextThreshold = stages[i + 1]?.threshold || breakThreshold;
            const isComplete = clickCount >= nextThreshold;
            const isCurrent = clickCount >= stage.threshold && clickCount < nextThreshold;
            return (
              <div
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                  isComplete ? 'bg-accent/20 scale-90' : isCurrent ? 'bg-accent/30 animate-pulse scale-110' : 'bg-muted/50 opacity-40'
                }`}
                title={`Stage ${i + 1}`}
              >
                {stage.label}
              </div>
            );
          })}
        </div>

        {/* Reveal button */}
        {isRevealed && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLoading(true);
            }}
            className="mt-8 px-6 py-3 bg-accent text-accent-foreground font-mono text-sm rounded reveal-button hover:opacity-90 transition-all"
          >
            Enter the Real Website →
          </button>
        )}
      </div>

      {/* Floating glitch elements */}
      {clickCount > 10 && (
        <>
          <div className="absolute top-1/4 left-1/4 text-muted-foreground text-xs opacity-20 animate-float" style={{ animationDelay: '0s' }}>
            {cursorHidden ? "press 'C'" : "404"}
          </div>
          <div className="absolute bottom-1/3 right-1/4 text-muted-foreground text-xs opacity-20 animate-float" style={{ animationDelay: '1s' }}>
            {isRunningAway ? "press 'R'" : "null"}
          </div>
          <div className="absolute top-1/3 right-1/3 text-muted-foreground text-xs opacity-20 animate-float" style={{ animationDelay: '2s' }}>
            {showPopup ? "press 'ESC'" : "undefined"}
          </div>
        </>
      )}

      {/* Footer */}
      <div className="absolute bottom-8 text-xs text-muted-foreground opacity-30">
        <p className={`transition-all duration-300 ${isGlitching ? 'animate-flicker' : ''}`}>
          {clickCount < 3 && "Nothing happens here. Trust me."}
          {clickCount >= 3 && clickCount < 10 && "Check the console for secrets..."}
          {clickCount >= 10 && "The website is fighting back!"}
        </p>
      </div>
    </div>
  );
};

export default Index;
