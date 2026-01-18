interface CursorBlockerProps {
  visible: boolean;
}

const CursorBlocker = ({ visible }: CursorBlockerProps) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center">
      {/* Fake cursor replacement */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <span className="text-6xl animate-pulse">🚫</span>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
            cursor.exe has stopped
          </span>
        </div>
      </div>
      
      {/* Floating taunts */}
      <div className="absolute top-1/4 right-1/4 text-sm text-muted-foreground animate-float opacity-50">
        Missing something?
      </div>
      <div className="absolute bottom-1/4 left-1/4 text-sm text-muted-foreground animate-float opacity-50" style={{ animationDelay: '1s' }}>
        Check your keyboard...
      </div>
    </div>
  );
};

export default CursorBlocker;
