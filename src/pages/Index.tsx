import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FakeNavigation from '@/components/FakeNavigation';
import LoadingScreen from '@/components/LoadingScreen';
import CrackOverlay from '@/components/CrackOverlay';
import FakePopup from '@/components/FakePopup';
import CursorBlocker from '@/components/CursorBlocker';

const messages = [
  "There is no website here.",
  "Seriously. Nothing to see.",
  "Why are you still clicking?",
  "Stop. It.",
  "I'm warning you...",
  "Fine. I'll take your cursor.",
  "Ha! Try clicking now!",
  "...How did you get it back?!",
  "Okay, new strategy...",
  "STOP MOVING!",
  "I give up a little...",
  "You're actually persistent!",
  "The cracks are forming...",
  "I can't hold on much longer!",
  "FINE! YOU WIN!",
];

const consoleHints = [
  "🤫 Psst... keep clicking.",
  "🔍 Something's hidden here...",
  "💡 The website is getting annoyed...",
  "⌨️ Hint: Try pressing some keys when stuck...",
  "🎮 This is basically a game now.",
  "🔓 You're making progress!",
  "✨ The defenses are weakening!",
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
  
  // Obstacle stages
  const [cursorHidden, setCursorHidden] = useState(false);
  const [cursorRestored, setCursorRestored] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [isRunningAway, setIsRunningAway] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupCount, setPopupCount] = useState(0);
  const [screenInverted, setScreenInverted] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [fakeProgress, setFakeProgress] = useState(0);
  const [showFakeProgress, setShowFakeProgress] = useState(false);
  const [secretKeyPressed, setSecretKeyPressed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showKeyHint, setShowKeyHint] = useState(false);
  
  const breakThreshold = 40;

  // Console welcome message
  useEffect(() => {
    console.log('%c🎭 Welcome, curious one...', 'color: #2dd4bf; font-size: 20px; font-weight: bold;');
    console.log('%cThere really is no website here. Or is there?', 'color: #6b7280; font-size: 14px;');
    console.log('%c💡 Hint: The website will fight back. Be persistent.', 'color: #fbbf24; font-size: 12px;');
  }, []);

  // Track mouse for running away text
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Secret key listener to restore cursor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret: Press 'C' to restore cursor
      if (cursorHidden && !cursorRestored && e.key.toLowerCase() === 'c') {
        console.log('%c🎉 You found the secret! Cursor restored!', 'color: #2dd4bf; font-size: 16px;');
        setCursorRestored(true);
        setCursorHidden(false);
        setSecretKeyPressed(true);
        setClickCount(prev => prev + 3); // Bonus for solving puzzle
      }
      
      // Secret: Press 'Escape' during popups to close all
      if (showPopup && e.key === 'Escape') {
        console.log('%c🎉 Smart! ESC closes the chaos!', 'color: #2dd4bf; font-size: 14px;');
        setShowPopup(false);
        setPopupCount(0);
        setClickCount(prev => prev + 2);
      }

      // Secret: Press 'R' to stop running text
      if (isRunningAway && e.key.toLowerCase() === 'r') {
        console.log('%c🎉 You froze the text!', 'color: #2dd4bf; font-size: 14px;');
        setIsRunningAway(false);
        setTextPosition({ x: 0, y: 0 });
        setClickCount(prev => prev + 2);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cursorHidden, cursorRestored, showPopup, isRunningAway]);

  // Stage progression based on clicks
  useEffect(() => {
    // Message progression
    const messageIndex = Math.min(
      Math.floor(clickCount / 3),
      messages.length - 1
    );
    setCurrentMessage(messageIndex);

    // Console hints
    if (clickCount > 0 && clickCount % 5 === 0) {
      const hintIndex = Math.min(
        Math.floor(clickCount / 5),
        consoleHints.length - 1
      );
      console.log(`%c${consoleHints[hintIndex]}`, 'color: #fbbf24; font-size: 12px;');
    }

    // STAGE 1: Initial annoyance (clicks 1-8)
    // Just messages and light effects

    // STAGE 2: Cursor disappears (clicks 8-15)
    if (clickCount >= 8 && !cursorRestored && !secretKeyPressed) {
      setCursorHidden(true);
      setShowKeyHint(true);
      console.log('%c😈 Your cursor belongs to me now!', 'color: #ef4444; font-size: 14px;');
      console.log('%c💡 Hint: Press a key... maybe one that starts with "C"?', 'color: #fbbf24; font-size: 12px;');
    }

    // STAGE 3: Text runs away (clicks 15-22)
    if (clickCount >= 15 && clickCount < 22 && !isRunningAway && cursorRestored) {
      setIsRunningAway(true);
      console.log('%c🏃 The text is running away!', 'color: #ef4444; font-size: 14px;');
      console.log('%c💡 Hint: Press "R" to freeze it!', 'color: #fbbf24; font-size: 12px;');
    }

    // STAGE 4: Popup chaos (clicks 22-28)
    if (clickCount >= 22 && clickCount < 28 && !showPopup && popupCount < 3) {
      setShowPopup(true);
      console.log('%c📢 Popup attack!', 'color: #ef4444; font-size: 14px;');
    }

    // STAGE 5: Screen effects (clicks 28-35)
    if (clickCount >= 28 && clickCount < 32) {
      setScreenInverted(true);
      setTimeout(() => setScreenInverted(false), 2000);
    }

    // STAGE 6: Fake progress bar (clicks 32-38)
    if (clickCount >= 32 && clickCount < 38 && !showFakeProgress) {
      setShowFakeProgress(true);
      setFakeProgress(0);
    }

    // Cracks appear
    if (clickCount >= 20) {
      setShowCracks(true);
      setCrackIntensity(Math.min((clickCount - 20) / 20, 1));
    }

    // Reveal final button
    if (clickCount >= breakThreshold - 5) {
      setIsRevealed(true);
    }

    // Final breakthrough
    if (clickCount >= breakThreshold) {
      console.log('%c💥 THE BARRIER IS BROKEN!', 'color: #ef4444; font-size: 24px; font-weight: bold;');
      setTimeout(() => setIsLoading(true), 500);
    }
  }, [clickCount, cursorRestored, secretKeyPressed, popupCount]);

  // Running away text effect
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

  // Fake progress bar
  useEffect(() => {
    if (!showFakeProgress) return;
    
    const interval = setInterval(() => {
      setFakeProgress(prev => {
        if (prev >= 99) {
          // Reset at 99% to troll
          console.log('%c😈 Oops! Progress reset!', 'color: #ef4444; font-size: 12px;');
          return 0;
        }
        return prev + Math.random() * 10;
      });
    }, 500);

    // Clear after some clicks
    if (clickCount >= 38) {
      setShowFakeProgress(false);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [showFakeProgress, clickCount]);

  const handleClick = useCallback(() => {
    if (isLoading) return;
    
    // Block clicks entirely when cursor is hidden - only 'C' key restores functionality
    if (cursorHidden && !cursorRestored) {
      console.log('%c🚫 Nice try! Your clicks are disabled. Press "C" to restore your cursor!', 'color: #ef4444; font-size: 14px;');
      return; // Completely block the click
    }
    
    setClickCount(prev => prev + 1);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    if (Math.random() > 0.5) {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 300);
    }
  }, [isLoading, cursorHidden, cursorRestored]);

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

  const handleLoadingComplete = () => {
    navigate('/quiz');
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden scanlines select-none transition-all duration-300 ${
        cursorHidden ? 'cursor-none' : 'cursor-pointer'
      } ${screenInverted ? 'invert' : ''}`}
      onClick={handleClick}
    >
      <CrackOverlay intensity={crackIntensity} visible={showCracks} />
      <CursorBlocker visible={cursorHidden && !cursorRestored} />
      
      {/* Popups */}
      {showPopup && (
        <>
          <FakePopup 
            onClose={handlePopupClose} 
            position={{ x: 20, y: 20 }}
            message="Are you sure you want to continue?"
          />
          {popupCount >= 1 && (
            <FakePopup 
              onClose={handlePopupClose} 
              position={{ x: 40, y: 40 }}
              message="Are you REALLY sure?"
            />
          )}
          {popupCount >= 2 && (
            <FakePopup 
              onClose={handlePopupClose} 
              position={{ x: 60, y: 60 }}
              message="Last chance to give up!"
            />
          )}
        </>
      )}
      
      <FakeNavigation 
        onLinkClick={handleClick} 
        isActive={isRevealed}
        clickCount={clickCount}
      />

      {/* Key hint overlay */}
      {showKeyHint && cursorHidden && !cursorRestored && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 text-xs text-accent animate-pulse z-50">
          <p>💡 Your cursor is gone... press the right key to get it back</p>
          <p className="text-muted-foreground mt-1 opacity-50">Maybe try the first letter of "cursor"?</p>
        </div>
      )}

      {/* Fake progress bar */}
      {showFakeProgress && (
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-64 z-50">
          <p className="text-sm text-center mb-2 text-muted-foreground">Loading real website...</p>
          <div className="h-2 bg-muted rounded overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${Math.min(fakeProgress, 99)}%` }}
            />
          </div>
          <p className="text-xs text-center mt-1 text-muted-foreground">
            {fakeProgress >= 99 ? "Just kidding! 😈" : `${Math.floor(fakeProgress)}%`}
          </p>
        </div>
      )}

      {/* Main message */}
      <div 
        className="text-center z-10 px-4 transition-transform duration-100"
        style={{
          transform: `translate(${textPosition.x}px, ${textPosition.y}px)`,
        }}
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
          {messages[currentMessage]}
        </h1>

        {/* Subtext */}
        <p 
          className={`text-muted-foreground text-sm md:text-base transition-opacity duration-500 ${
            clickCount > 4 ? 'opacity-50' : 'opacity-100'
          }`}
        >
          {clickCount < 4 && "This page is intentionally empty."}
          {clickCount >= 4 && clickCount < 8 && "...or so you think."}
          {clickCount >= 8 && clickCount < 15 && cursorHidden && "Where did your cursor go? 😈"}
          {clickCount >= 8 && clickCount < 15 && !cursorHidden && "Clever! But I have more tricks..."}
          {clickCount >= 15 && clickCount < 22 && "Catch me if you can!"}
          {clickCount >= 22 && clickCount < 28 && "Close all the popups! (or press ESC)"}
          {clickCount >= 28 && clickCount < 35 && "Your eyes are playing tricks on you..."}
          {clickCount >= 35 && "You're actually going to win..."}
        </p>

        {/* Stage indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {[1, 2, 3, 4, 5, 6].map((stage) => {
            const stageThresholds = [0, 8, 15, 22, 28, 35];
            const isComplete = clickCount >= stageThresholds[stage];
            const isCurrent = clickCount >= stageThresholds[stage - 1] && clickCount < (stageThresholds[stage] || breakThreshold);
            return (
              <div 
                key={stage}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isComplete ? 'bg-accent' : isCurrent ? 'bg-accent/50 animate-pulse' : 'bg-muted'
                }`}
              />
            );
          })}
        </div>

        {/* Hidden interaction counter */}
        {clickCount > 3 && (
          <p className="text-xs text-muted-foreground mt-8 opacity-30 font-mono">
            [{clickCount}/{breakThreshold}]
          </p>
        )}

        {/* Reveal button */}
        {isRevealed && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLoading(true);
            }}
            className={`mt-8 px-6 py-3 bg-accent text-accent-foreground font-mono text-sm rounded reveal-button hover:opacity-90 transition-all ${
              buttonsDisabled ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            Enter the Real Website →
          </button>
        )}
      </div>

      {/* Floating glitch elements */}
      {clickCount > 10 && (
        <>
          <div 
            className="absolute top-1/4 left-1/4 text-muted-foreground text-xs opacity-20 animate-float"
            style={{ animationDelay: '0s' }}
          >
            {cursorHidden ? "press 'C'" : "404"}
          </div>
          <div 
            className="absolute bottom-1/3 right-1/4 text-muted-foreground text-xs opacity-20 animate-float"
            style={{ animationDelay: '1s' }}
          >
            {isRunningAway ? "press 'R'" : "null"}
          </div>
          <div 
            className="absolute top-1/3 right-1/3 text-muted-foreground text-xs opacity-20 animate-float"
            style={{ animationDelay: '2s' }}
          >
            {showPopup ? "press 'ESC'" : "undefined"}
          </div>
        </>
      )}

      {/* Footer hint */}
      <div className="absolute bottom-8 text-xs text-muted-foreground opacity-30">
        <p className={`transition-all duration-300 ${isGlitching ? 'animate-flicker' : ''}`}>
          {clickCount < 3 && "Nothing happens here. Trust me."}
          {clickCount >= 3 && clickCount < 8 && "Check the console for secrets..."}
          {clickCount >= 8 && "The website is fighting back!"}
        </p>
      </div>
    </div>
  );
};

export default Index;
