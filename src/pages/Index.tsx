import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FakeNavigation from '@/components/FakeNavigation';
import LoadingScreen from '@/components/LoadingScreen';
import CrackOverlay from '@/components/CrackOverlay';

const messages = [
  "There is no website here.",
  "Seriously. Nothing to see.",
  "Why are you still clicking?",
  "Stop. It.",
  "Okay, that tickles.",
  "Fine, you're persistent...",
  "I'm starting to crack...",
  "You're actually breaking me!",
  "OKAY OKAY! You win!",
];

const consoleHints = [
  "🤫 Psst... keep clicking.",
  "🔍 Something's hidden here...",
  "💡 The more you click, the weaker I get.",
  "🎮 This is basically a game now.",
  "🔓 You're close to breaking through!",
  "✨ Almost there, persistent one!",
  "🎉 The barrier is weakening!",
  "🚀 One more push!",
];

const Index = () => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showCracks, setShowCracks] = useState(false);
  const [crackIntensity, setCrackIntensity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const breakThreshold = 15;

  // Console welcome message
  useEffect(() => {
    console.log('%c🎭 Welcome, curious one...', 'color: #2dd4bf; font-size: 20px; font-weight: bold;');
    console.log('%cThere really is no website here. Or is there?', 'color: #6b7280; font-size: 14px;');
    console.log('%c💡 Hint: Interact with the page...', 'color: #fbbf24; font-size: 12px;');
  }, []);

  // Update message based on clicks
  useEffect(() => {
    const messageIndex = Math.min(
      Math.floor(clickCount / 2),
      messages.length - 1
    );
    setCurrentMessage(messageIndex);

    // Log hints at certain thresholds
    if (clickCount > 0 && clickCount % 2 === 0) {
      const hintIndex = Math.min(
        Math.floor(clickCount / 2),
        consoleHints.length - 1
      );
      console.log(`%c${consoleHints[hintIndex]}`, 'color: #fbbf24; font-size: 12px;');
    }

    // Show cracks after certain clicks
    if (clickCount >= 6) {
      setShowCracks(true);
      setCrackIntensity(Math.min((clickCount - 6) / 9, 1));
    }

    // Reveal the "real" link
    if (clickCount >= breakThreshold - 3) {
      setIsRevealed(true);
    }

    // Trigger break
    if (clickCount >= breakThreshold) {
      console.log('%c💥 THE BARRIER IS BROKEN!', 'color: #ef4444; font-size: 24px; font-weight: bold;');
      setTimeout(() => setIsLoading(true), 500);
    }
  }, [clickCount]);

  const handleClick = useCallback(() => {
    if (isLoading) return;
    
    setClickCount(prev => prev + 1);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    // Random glitch effect
    if (Math.random() > 0.5) {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 300);
    }
  }, [isLoading]);
    

  const handleLoadingComplete = () => {
    navigate('/quiz');
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div 
      className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden scanlines cursor-pointer select-none"
      onClick={handleClick}
    >
      <CrackOverlay intensity={crackIntensity} visible={showCracks} />
      
      <FakeNavigation 
        onLinkClick={handleClick} 
        isActive={isRevealed}
        clickCount={clickCount}
      />

      {/* Main message */}
      <div className="text-center z-10 px-4">
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
          {clickCount >= 8 && clickCount < 12 && "Something is happening..."}
          {clickCount >= 12 && "You're almost there!"}
        </p>

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
            className="mt-8 px-6 py-3 bg-accent text-accent-foreground font-mono text-sm rounded reveal-button hover:opacity-90 transition-opacity"
          >
            Enter the Real Website →
          </button>
        )}
      </div>

      {/* Floating glitch elements */}
      {clickCount > 6 && (
        <>
          <div 
            className="absolute top-1/4 left-1/4 text-muted-foreground text-xs opacity-20 animate-float"
            style={{ animationDelay: '0s' }}
          >
            404
          </div>
          <div 
            className="absolute bottom-1/3 right-1/4 text-muted-foreground text-xs opacity-20 animate-float"
            style={{ animationDelay: '1s' }}
          >
            null
          </div>
          <div 
            className="absolute top-1/3 right-1/3 text-muted-foreground text-xs opacity-20 animate-float"
            style={{ animationDelay: '2s' }}
          >
            undefined
          </div>
        </>
      )}

      {/* Footer hint */}
      <div className="absolute bottom-8 text-xs text-muted-foreground opacity-30">
        <p className={`transition-all duration-300 ${isGlitching ? 'animate-flicker' : ''}`}>
          {clickCount < 3 
            ? "Nothing happens here. Trust me." 
            : "Check the console for secrets..."}
        </p>
      </div>
    </div>
  );
};

export default Index;
