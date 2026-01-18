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
  const [hoverCount, setHoverCount] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showCracks, setShowCracks] = useState(false);
  const [crackIntensity, setCrackIntensity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const totalInteractions = clickCount + Math.floor(hoverCount / 3);
  const breakThreshold = 20;

  // Console welcome message
  useEffect(() => {
    console.log('%c🎭 Welcome, curious one...', 'color: #2dd4bf; font-size: 20px; font-weight: bold;');
    console.log('%cThere really is no website here. Or is there?', 'color: #6b7280; font-size: 14px;');
    console.log('%c💡 Hint: Interact with the page...', 'color: #fbbf24; font-size: 12px;');
  }, []);

  // Update message based on interactions
  useEffect(() => {
    const messageIndex = Math.min(
      Math.floor(totalInteractions / 2.5),
      messages.length - 1
    );
    setCurrentMessage(messageIndex);

    // Log hints at certain thresholds
    if (totalInteractions > 0 && totalInteractions % 3 === 0) {
      const hintIndex = Math.min(
        Math.floor(totalInteractions / 3),
        consoleHints.length - 1
      );
      console.log(`%c${consoleHints[hintIndex]}`, 'color: #fbbf24; font-size: 12px;');
    }

    // Show cracks after certain interactions
    if (totalInteractions >= 8) {
      setShowCracks(true);
      setCrackIntensity(Math.min((totalInteractions - 8) / 12, 1));
    }

    // Reveal the "real" link
    if (totalInteractions >= breakThreshold - 3) {
      setIsRevealed(true);
    }

    // Trigger break
    if (totalInteractions >= breakThreshold) {
      console.log('%c💥 THE BARRIER IS BROKEN!', 'color: #ef4444; font-size: 24px; font-weight: bold;');
      setTimeout(() => setIsLoading(true), 500);
    }
  }, [totalInteractions]);

  const handleClick = useCallback(() => {
    if (isLoading) return;
    
    setClickCount(prev => prev + 1);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    // Random glitch effect
    if (Math.random() > 0.6) {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 300);
    }
  }, [isLoading]);

  const handleHover = useCallback(() => {
    if (isLoading) return;
    setHoverCount(prev => prev + 1);
    
    if (Math.random() > 0.8) {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 150);
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
      onMouseMove={handleHover}
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
            totalInteractions > 5 ? 'opacity-50' : 'opacity-100'
          }`}
        >
          {totalInteractions < 5 && "This page is intentionally empty."}
          {totalInteractions >= 5 && totalInteractions < 10 && "...or so you think."}
          {totalInteractions >= 10 && totalInteractions < 15 && "Something is happening..."}
          {totalInteractions >= 15 && "You're almost there!"}
        </p>

        {/* Hidden interaction counter */}
        {totalInteractions > 3 && (
          <p className="text-xs text-muted-foreground mt-8 opacity-30 font-mono">
            [{totalInteractions}/{breakThreshold}]
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
      {totalInteractions > 8 && (
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
          {totalInteractions < 3 
            ? "Nothing happens here. Trust me." 
            : "Check the console for secrets..."}
        </p>
      </div>
    </div>
  );
};

export default Index;
