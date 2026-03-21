import { useEffect, useRef } from 'react';

interface MatrixRainProps {
  visible: boolean;
}

const MatrixRain = ({ visible }: MatrixRainProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !containerRef.current) return;

    const container = containerRef.current;
    const columns = Math.floor(window.innerWidth / 20);
    
    const createDrop = (col: number) => {
      const drop = document.createElement('span');
      drop.className = 'matrix-drop';
      drop.textContent = String.fromCharCode(0x30A0 + Math.random() * 96);
      drop.style.left = `${col * 20}px`;
      drop.style.animationDuration = `${1 + Math.random() * 2}s`;
      drop.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(drop);
      
      setTimeout(() => drop.remove(), 4000);
    };

    const interval = setInterval(() => {
      const col = Math.floor(Math.random() * columns);
      createDrop(col);
    }, 50);

    return () => {
      clearInterval(interval);
      container.innerHTML = '';
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[45] pointer-events-none overflow-hidden"
      aria-hidden="true"
    />
  );
};

export default MatrixRain;
