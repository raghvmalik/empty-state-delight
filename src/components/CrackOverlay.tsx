interface CrackOverlayProps {
  intensity: number; // 0 to 1
  visible: boolean;
}

const CrackOverlay = ({ intensity, visible }: CrackOverlayProps) => {
  if (!visible) return null;

  return (
    <div 
      className={`crack-overlay ${visible ? 'visible' : ''}`}
      style={{ 
        opacity: intensity * 0.5,
        filter: `blur(${(1 - intensity) * 2}px)`
      }}
    >
      {/* Additional crack lines */}
      <svg 
        className="absolute inset-0 w-full h-full animate-crack"
        style={{ opacity: intensity }}
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <path 
          d="M50 0 L48 20 L52 35 L47 50 L53 65 L49 80 L51 100" 
          stroke="hsl(var(--crack))" 
          strokeWidth="0.3" 
          fill="none"
        />
        <path 
          d="M52 35 L65 40 L80 38" 
          stroke="hsl(var(--crack))" 
          strokeWidth="0.2" 
          fill="none"
        />
        <path 
          d="M47 50 L30 55 L15 52" 
          stroke="hsl(var(--crack))" 
          strokeWidth="0.2" 
          fill="none"
        />
        <path 
          d="M53 65 L70 70 L85 68" 
          stroke="hsl(var(--crack))" 
          strokeWidth="0.2" 
          fill="none"
        />
        <path 
          d="M49 80 L35 85 L20 82" 
          stroke="hsl(var(--crack))" 
          strokeWidth="0.15" 
          fill="none"
        />
      </svg>
    </div>
  );
};

export default CrackOverlay;
