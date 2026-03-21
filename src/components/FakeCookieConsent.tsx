import { useState } from 'react';

interface FakeCookieConsentProps {
  visible: boolean;
  onAccept: () => void;
}

const FakeCookieConsent = ({ visible, onAccept }: FakeCookieConsentProps) => {
  const [rejectCount, setRejectCount] = useState(0);
  const [acceptSize, setAcceptSize] = useState(1);
  const [rejectSize, setRejectSize] = useState(1);
  const [message, setMessage] = useState('We use cookies to track your frustration. Accept?');
  const [extraCheckboxes, setExtraCheckboxes] = useState(false);
  const [showFineprint, setShowFineprint] = useState(false);

  const messages = [
    'We use cookies to track your frustration. Accept?',
    'Are you sure you don\'t want cookies? They\'re delicious! 🍪',
    'PLEASE accept cookies. The website is lonely.',
    'What if we say pretty please? 🥺',
    'Fine. But you\'re missing out on PREMIUM cookies.',
    'Last chance for cookies! The Accept button is RIGHT THERE.',
    'Okay okay, we\'ll stop asking... after this one more time.',
  ];

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newCount = rejectCount + 1;
    setRejectCount(newCount);
    setMessage(messages[Math.min(newCount, messages.length - 1)]);
    
    // Accept button grows, reject shrinks
    setAcceptSize(prev => Math.min(prev + 0.3, 3));
    setRejectSize(prev => Math.max(prev - 0.1, 0.3));
    
    if (newCount >= 3) setExtraCheckboxes(true);
    if (newCount >= 5) setShowFineprint(true);
    
    if (newCount >= 7) {
      console.log('%c🍪 Fine, no cookies for you!', 'color: #fbbf24;');
      onAccept();
    }
  };

  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('%c🍪 Cookies accepted! (not really)', 'color: #2dd4bf;');
    onAccept();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[165] flex items-end justify-center p-4" onClick={(e) => e.stopPropagation()}>
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
      <div className="relative bg-card border border-border rounded-lg p-5 w-full max-w-lg shadow-2xl animate-scale-in mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-3xl">🍪</span>
          <h3 className="text-sm font-bold">Cookie Consent</h3>
        </div>
        
        <p className="text-xs text-muted-foreground mb-4">{message}</p>
        
        {extraCheckboxes && (
          <div className="mb-4 space-y-2 text-xs text-muted-foreground border border-border rounded p-3">
            <p className="font-bold text-foreground mb-2">Select your cookie preferences:</p>
            {[
              'Essential Cookies (tracking your clicks)',
              'Analytics Cookies (measuring your frustration)',
              'Marketing Cookies (selling your patience)',
              'Chaos Cookies (for maximum annoyance)',
              'Quantum Cookies (they exist and don\'t exist)',
            ].map((cookie, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-accent" onClick={(e) => e.stopPropagation()} />
                <span>{cookie}</span>
              </label>
            ))}
          </div>
        )}

        {showFineprint && (
          <p className="text-[8px] text-muted-foreground mb-3 opacity-40 leading-tight">
            By existing on this page you agree to our Terms of Frustration, Privacy Violation Policy, 
            Cookie Monster Agreement, Digital Patience Testing Protocol, and the Universal Declaration 
            of "We Do What We Want". All rights reversed. No refunds on time wasted. Side effects may 
            include: increased clicking, keyboard mashing, and existential questioning.
          </p>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={handleAccept}
            className="flex-1 bg-accent text-accent-foreground text-sm py-2 rounded font-bold transition-transform hover:opacity-90"
            style={{ transform: `scale(${acceptSize})`, transformOrigin: 'center' }}
          >
            Accept All 🍪
          </button>
          <button
            onClick={handleReject}
            className="flex-1 bg-muted text-muted-foreground text-sm py-2 rounded transition-all hover:opacity-80"
            style={{ transform: `scale(${rejectSize})`, opacity: Math.max(rejectSize, 0.3) }}
          >
            Reject
          </button>
        </div>
        
        {rejectCount > 0 && (
          <p className="text-[10px] text-center text-muted-foreground mt-2 opacity-50">
            Rejected {rejectCount} time(s). The Accept button grows stronger...
          </p>
        )}
      </div>
    </div>
  );
};

export default FakeCookieConsent;
