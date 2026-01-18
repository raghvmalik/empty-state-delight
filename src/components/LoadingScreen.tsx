import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  const loadingMessages = [
    'Initializing...',
    'Loading assets...',
    'Preparing quiz...',
    'Almost there...',
    'Just kidding, there\'s more...',
    'Compiling questions...',
    'Shuffling answers...',
    'Ready!',
  ];

  useEffect(() => {
    console.log('%c🚀 Finally! Loading the REAL website...', 'color: #2dd4bf; font-size: 16px; font-weight: bold;');
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15 + 5;
        
        const messageIndex = Math.min(
          Math.floor((newProgress / 100) * loadingMessages.length),
          loadingMessages.length - 1
        );
        setLoadingText(loadingMessages[messageIndex]);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            console.log('%c✨ Welcome to the quiz! You earned it.', 'color: #2dd4bf; font-size: 18px; font-weight: bold;');
            onComplete();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="loading-screen scanlines">
      <div className="text-center">
        <h2 className="text-2xl font-mono mb-2 animate-pulse-glow">
          {loadingText}
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          {progress < 100 ? 'Please wait...' : 'Launching!'}
        </p>
        
        <div className="loading-bar-container">
          <div 
            className="loading-bar transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-xs text-muted-foreground mt-4 font-mono">
          {Math.floor(progress)}%
        </p>
      </div>
      
      <div className="absolute bottom-8 text-xs text-muted-foreground opacity-50">
        <p>Tip: You broke through the fake layer. Well done!</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
