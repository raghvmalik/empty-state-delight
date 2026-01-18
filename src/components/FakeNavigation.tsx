import { useState } from 'react';

interface FakeNavigationProps {
  onLinkClick: () => void;
  isActive: boolean;
  clickCount: number;
}

const FakeNavigation = ({ onLinkClick, isActive, clickCount }: FakeNavigationProps) => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const links = [
    { name: 'Home', hint: 'You are home. This is it.' },
    { name: 'About', hint: 'About what? There\'s nothing here.' },
    { name: 'Start Quiz', hint: 'What quiz? Stop clicking.' },
    { name: 'Contact', hint: '404: Developer not found' },
  ];

  const handleClick = (linkName: string) => {
    if (isActive) {
      console.log(`%c🎉 "${linkName}" finally works!`, 'color: #2dd4bf; font-size: 14px;');
    } else {
      console.log(`%c❌ Nice try. "${linkName}" leads nowhere.`, 'color: #ef4444; font-size: 12px;');
    }
    onLinkClick();
  };

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 flex gap-8 text-sm">
      {links.map((link) => (
        <button
          key={link.name}
          className={`fake-link ${isActive ? 'active' : ''} ${
            clickCount > 5 && !isActive ? 'animate-distort' : ''
          }`}
          onClick={() => handleClick(link.name)}
          onMouseEnter={() => {
            setHoveredLink(link.name);
            if (!isActive) {
              console.log(`%c💭 ${link.hint}`, 'color: #6b7280; font-style: italic;');
            }
          }}
          onMouseLeave={() => setHoveredLink(null)}
        >
          {link.name}
          {hoveredLink === link.name && !isActive && clickCount > 3 && (
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap opacity-50">
              (broken)
            </span>
          )}
        </button>
      ))}
    </nav>
  );
};

export default FakeNavigation;
