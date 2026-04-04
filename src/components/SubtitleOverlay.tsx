import { useState, useEffect } from 'react';
import { subscribeSubtitles } from '@/lib/narrator';

const SubtitleOverlay = () => {
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    const unsub = subscribeSubtitles((newText, isVisible) => {
      if (isVisible && newText) {
        setText(newText);
        setVisible(true);
        setDisplayedText('');
      } else {
        setVisible(false);
      }
    });
    return unsub;
  }, []);

  // Typing effect
  useEffect(() => {
    if (!visible || !text) return;
    
    let i = 0;
    setDisplayedText('');
    
    const interval = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 30);
    
    return () => clearInterval(interval);
  }, [text, visible]);

  if (!visible && !displayedText) return null;

  return (
    <div 
      className={`fixed bottom-16 left-1/2 -translate-x-1/2 z-[300] max-w-lg w-[90%] transition-all duration-300 pointer-events-none ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-background/90 backdrop-blur-md border border-border rounded-lg px-5 py-3 shadow-2xl">
        <div className="flex items-start gap-2">
          <span className="text-accent text-sm mt-0.5 shrink-0">🎙️</span>
          <p className="text-sm font-mono text-foreground leading-relaxed">
            {displayedText}
            {displayedText.length < text.length && (
              <span className="inline-block w-[2px] h-4 bg-accent ml-0.5 animate-pulse" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubtitleOverlay;
