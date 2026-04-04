import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FakeNavigation from '@/components/FakeNavigation';
import LoadingScreen from '@/components/LoadingScreen';
import CrackOverlay from '@/components/CrackOverlay';
import FakePopup from '@/components/FakePopup';
import CursorBlocker from '@/components/CursorBlocker';
import MatrixRain from '@/components/MatrixRain';
import FakeBSOD from '@/components/FakeBSOD';
import PasswordTroll from '@/components/PasswordTroll';
import GravityFlip from '@/components/GravityFlip';
import CountdownTroll from '@/components/CountdownTroll';
import FakeCookieConsent from '@/components/FakeCookieConsent';
import LightsOut from '@/components/LightsOut';
import FakeVirusScan from '@/components/FakeVirusScan';
import SimonSays from '@/components/SimonSays';
import DiscoMode from '@/components/DiscoMode';
import VictoryStats from '@/components/VictoryStats';
import SubtitleOverlay from '@/components/SubtitleOverlay';
import { playClick, playStageComplete, playBlocked, playError } from '@/lib/sounds';
import { narrate, narrateNow, narrateClickReaction, stopNarration } from '@/lib/narrator';

const messages = [
  "There is no website here.",
  "Seriously.. Nothing to see.",
  "Why are you still clicking?",
  "STOP.",
  "I'm warning you...",
  "🍪 Accept our cookies first!",
  "Fine. I'll take your cursor.",
  "Ha! Try clicking now!",
  "...How did you get it back?!",
  "Catch the text if you can!",
  "You're not giving up?!",
  "Time for popups! 😈",
  "YOU CLOSED THEM?!",
  "Let me check your identity...",
  "Fine. You passed.",
  "WHO TURNED OFF THE LIGHTS?!",
  "You found the switch!",
  "🛡️ Running a security scan...",
  "Wait... you're CLEAN?!",
  "BLUE SCREEN TIME!",
  "HOW?! You bypassed it!",
  "🧠 Test your memory!",
  "Impressive brain power!",
  "The world is upside down!",
  "🪩 DISCO TIME!",
  "Wait... let me count down...",
  "3... 2... 1... JUST KIDDING!",
  "The matrix has you...",
  "The cracks are forming...",
  "I can't hold on much longer!",
  "FINE! YOU WIN! :/",
];

const consoleHints = [
  "🤫 Psst... keep clicking.",
  "🔍 Something's hidden here...",
  "💡 The website is getting annoyed...",
  "⌨️ Hint: Try pressing some keys when stuck...",
  "🎮 This is basically a game now.",
  "🔓 You're making progress!",
  "✨ The defenses are weakening!",
  "🍪 Cookies? Really?",
  "🔦 It's getting dark...",
  "🛡️ Are you a virus?",
  "🏆 You're a legend if you make it!",
  "🎉 Almost there!",
];

const Index = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [clickCount, setClickCount] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [completionTime, setCompletionTime] = useState(0);
  const [lastStageClick, setLastStageClick] = useState(0); // track stage transitions for sound
  
  const [isGlitching, setIsGlitching] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showCracks, setShowCracks] = useState(false);
  const [crackIntensity, setCrackIntensity] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  
  // Stage states
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const [cursorHidden, setCursorHidden] = useState(false);
  const [cursorRestored, setCursorRestored] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [isRunningAway, setIsRunningAway] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupCount, setPopupCount] = useState(0);
  const [screenInverted, setScreenInverted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSolved, setPasswordSolved] = useState(false);
  const [showLightsOut, setShowLightsOut] = useState(false);
  const [lightsFixed, setLightsFixed] = useState(false);
  const [showVirusScan, setShowVirusScan] = useState(false);
  const [virusScanDone, setVirusScanDone] = useState(false);
  const [showBSOD, setShowBSOD] = useState(false);
  const [bsodDismissed, setBsodDismissed] = useState(false);
  const [showSimonSays, setShowSimonSays] = useState(false);
  const [simonDone, setSimonDone] = useState(false);
  const [gravityFlip, setGravityFlip] = useState(false);
  const [gravityFixed, setGravityFixed] = useState(false);
  const [discoMode, setDiscoMode] = useState(false);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [miniGameTarget, setMiniGameTarget] = useState({ x: 50, y: 50 });
  const [miniGameHits, setMiniGameHits] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownDone, setCountdownDone] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [textScramble, setTextScramble] = useState(false);
  const [showFakeProgress, setShowFakeProgress] = useState(false);
  const [fakeProgress, setFakeProgress] = useState(0);
  const [secretKeyPressed, setSecretKeyPressed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showKeyHint, setShowKeyHint] = useState(false);
  const [screenZoom, setScreenZoom] = useState(1);
  const [screenRotate, setScreenRotate] = useState(0);
  const [clickEmojis, setClickEmojis] = useState<{x: number, y: number, emoji: string, id: number}[]>([]);
  const [confettiEmojis, setConfettiEmojis] = useState<{x: number, y: number, emoji: string, id: number}[]>([]);

  const breakThreshold = 120;
  const narratedStages = useRef<Set<string>>(new Set());

  // Intro narration
  useEffect(() => {
    console.log('%c🎭 Welcome, curious one...', 'color: #2dd4bf; font-size: 20px; font-weight: bold;');
    console.log('%cThere really is no website here. Or is there?', 'color: #6b7280; font-size: 14px;');
    console.log('%c💡 Hint: The website will fight back. Be persistent.', 'color: #fbbf24; font-size: 12px;');
    
    const timer = setTimeout(() => {
      narrate("Hello there... This is awkward.", () => {
        narrate("You see, there's supposed to be a website here.", () => {
          narrate("But... sorry to disappoint you. There's nothing here. Please leave.");
        });
      });
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      stopNarration();
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cursorHidden && !cursorRestored && e.key.toLowerCase() === 'c') {
        console.log('%c🎉 Cursor restored!', 'color: #2dd4bf; font-size: 16px;');
        setCursorRestored(true);
        setCursorHidden(false);
        setSecretKeyPressed(true);
        setClickCount(prev => prev + 3);
        playStageComplete();
        narrateNow("What?! How did you get that back?!");
      }
      if (showPopup && e.key === 'Escape') {
        console.log('%c🎉 ESC closes the chaos!', 'color: #2dd4bf;');
        setShowPopup(false);
        setPopupCount(0);
        setClickCount(prev => prev + 2);
        playStageComplete();
        narrateNow("You closed them?! Those took me ages to make!");
      }
      if (isRunningAway && e.key.toLowerCase() === 'r') {
        console.log('%c🎉 Text frozen!', 'color: #2dd4bf;');
        setIsRunningAway(false);
        setTextPosition({ x: 0, y: 0 });
        setClickCount(prev => prev + 2);
        playStageComplete();
        narrateNow("Hey! You froze my text! That's cheating!");
      }
      if (gravityFlip && !gravityFixed && e.key.toLowerCase() === 'g') {
        console.log('%c🎉 Gravity stabilized!', 'color: #2dd4bf;');
        setGravityFlip(false);
        setGravityFixed(true);
        setClickCount(prev => prev + 3);
        playStageComplete();
        narrateNow("You fixed gravity? Fine. Show off.");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cursorHidden, cursorRestored, showPopup, isRunningAway, gravityFlip, gravityFixed]);

  // Stage progression
  useEffect(() => {
    const messageIndex = Math.min(Math.floor(clickCount / 4), messages.length - 1);
    setCurrentMessage(messageIndex);

    if (clickCount > 0 && clickCount % 8 === 0) {
      const hintIndex = Math.min(Math.floor(clickCount / 8), consoleHints.length - 1);
      console.log(`%c${consoleHints[hintIndex]}`, 'color: #fbbf24; font-size: 12px;');
    }

    // Helper to narrate once per stage
    const narrateOnce = (key: string, text: string) => {
      if (!narratedStages.current.has(key)) {
        narratedStages.current.add(key);
        narrateNow(text);
      }
    };

    // Click-based narration (first clicks)
    if (clickCount === 1) narrateOnce('click1', "Wait... are you clicking? Why are you clicking?");
    if (clickCount === 4) narrateOnce('click4', "Seriously, stop that. There's nothing here!");
    if (clickCount === 7) narrateOnce('click7', "You're persistent, I'll give you that.");

    // STAGE 1: Initial clicks + zoom pulses (0-8)
    if (clickCount >= 3 && clickCount < 8 && Math.random() > 0.6) {
      setScreenZoom(1 + Math.random() * 0.05);
      setTimeout(() => setScreenZoom(1), 300);
    }

    // STAGE 2: Cookie consent (8-14)
    if (clickCount >= 8 && !cookieAccepted && !showCookieConsent) {
      setShowCookieConsent(true);
      narrateOnce('cookie', "Oh great, now I have to show you the cookie popup. Company policy.");
    }

    // STAGE 3: Cursor stolen (14-22)
    if (clickCount >= 14 && !cursorRestored && !secretKeyPressed && cookieAccepted) {
      setCursorHidden(true);
      setShowKeyHint(true);
      narrateOnce('cursor', "Ha! Good luck clicking without a cursor!");
    }

    // STAGE 4: Text runs away (22-28)
    if (clickCount >= 22 && clickCount < 28 && !isRunningAway && cursorRestored) {
      setIsRunningAway(true);
      narrateOnce('runtext', "Run, text, RUN! Don't let them catch you!");
      console.log('%c🏃 Text is running! Press "R"!', 'color: #ef4444;');
    }

    // STAGE 5: Screen inversion (28-32)
    if (clickCount >= 28 && clickCount < 32) {
      setScreenInverted(true);
      setTimeout(() => setScreenInverted(false), 1500);
    }

    // STAGE 6: Popup chaos (32-38)
    if (clickCount >= 32 && clickCount < 38 && !showPopup && popupCount < 3) {
      setShowPopup(true);
      narrateOnce('popup', "Popups! Everyone's favorite! You're welcome.");
    }

    // STAGE 7: Password wall (38-44)
    if (clickCount >= 38 && !passwordSolved && !showPassword) {
      setShowPassword(true);
      narrateOnce('password', "Let's see if you can guess the password...");
    }

    // STAGE 8: Lights out (44-50)
    if (clickCount >= 44 && !lightsFixed && !showLightsOut && passwordSolved) {
      setShowLightsOut(true);
      narrateOnce('lights', "Oops... who turned off the lights?");
      console.log('%c🔦 Who turned off the lights?!', 'color: #ef4444;');
    }

    // STAGE 9: Virus scan (50-58)
    if (clickCount >= 50 && !virusScanDone && !showVirusScan && lightsFixed) {
      setShowVirusScan(true);
      narrateOnce('virus', "Hold on, let me scan you for viruses...");
    }

    // STAGE 10: Fake progress (58-62)
    if (clickCount >= 58 && clickCount < 62 && !showFakeProgress && virusScanDone) {
      setShowFakeProgress(true);
      setFakeProgress(0);
    }

    // STAGE 11: BSOD (62-68)
    if (clickCount >= 62 && !bsodDismissed && !showBSOD && virusScanDone) {
      setShowBSOD(true);
      setShowFakeProgress(false);
      narrateOnce('bsod', "Oh no... that doesn't look good.");
    }

    // STAGE 12: Simon Says (68-76)
    if (clickCount >= 68 && !simonDone && !showSimonSays && bsodDismissed) {
      setShowSimonSays(true);
      narrateOnce('simon', "Time for a brain test! Try to keep up.");
    }

    // STAGE 13: Gravity flip (76-82)
    if (clickCount >= 76 && !gravityFixed && !gravityFlip && simonDone) {
      setGravityFlip(true);
      narrateOnce('gravity', "Everything's upside down? That's a feature, not a bug.");
    }

    // STAGE 14: Disco + mini game (82-90)
    if (clickCount >= 82 && clickCount < 90 && gravityFixed) {
      setDiscoMode(true);
      if (!showMiniGame && miniGameHits < 5) {
        setShowMiniGame(true);
        setMiniGameHits(0);
        narrateOnce('disco', "Fine, let's at least have some fun while you destroy my website.");
      }
    }

    // STAGE 15: Countdown troll (90-98)
    if (clickCount >= 90 && !countdownDone && !showCountdown && miniGameHits >= 5) {
      setShowCountdown(true);
      setShowMiniGame(false);
      setDiscoMode(false);
      narrateOnce('countdown', "Okay okay, I'll let you in. Just wait...");
    }

    // STAGE 16: Matrix + text scramble (98-110)
    if (clickCount >= 98 && clickCount < 110 && countdownDone) {
      setShowMatrix(true);
      setTextScramble(true);
      narrateOnce('matrix', "You're seeing the code now... you're the chosen one.");
      if (Math.random() > 0.7) {
        setScreenRotate((Math.random() - 0.5) * 4);
        setTimeout(() => setScreenRotate(0), 500);
      }
    }
    if (clickCount >= 110) {
      setShowMatrix(false);
      setTextScramble(false);
      narrateOnce('cracking', "No... NO! The barrier is cracking!");
    }

    // Cracks
    if (clickCount >= 40) {
      setShowCracks(true);
      setCrackIntensity(Math.min((clickCount - 40) / 60, 1));
    }

    // Reveal
    if (clickCount >= breakThreshold - 5) {
      setIsRevealed(true);
    }

    // Final
    if (clickCount >= breakThreshold && !showVictory) {
      narrateOnce('victory', "Fine. You win. I hope you're happy.");
      console.log('%c💥 THE BARRIER IS BROKEN!', 'color: #ef4444; font-size: 24px; font-weight: bold;');
      const newConfetti = Array.from({ length: 30 }, (_, i) => ({
        x: Math.random() * 100, y: Math.random() * 100,
        emoji: ['🎉', '🎊', '✨', '🏆', '⭐', '🍪', '🪩'][Math.floor(Math.random() * 7)],
        id: i,
      }));
      setConfettiEmojis(newConfetti);
      setCompletionTime(Math.floor((Date.now() - startTime) / 1000));
      setTimeout(() => setShowVictory(true), 1000);
    }
  }, [clickCount, cursorRestored, secretKeyPressed, popupCount, cookieAccepted, passwordSolved, lightsFixed, virusScanDone, bsodDismissed, simonDone, gravityFixed, miniGameHits, countdownDone]);

  // Running text
  useEffect(() => {
    if (!isRunningAway) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const dx = mousePosition.x - rect.width / 2;
    const dy = mousePosition.y - rect.height / 2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 300) {
      const angle = Math.atan2(dy, dx);
      setTextPosition({
        x: -Math.cos(angle) * (300 - distance) * 0.3,
        y: -Math.sin(angle) * (300 - distance) * 0.3,
      });
    }
  }, [mousePosition, isRunningAway]);

  // Fake progress
  useEffect(() => {
    if (!showFakeProgress) return;
    const interval = setInterval(() => {
      setFakeProgress(prev => prev >= 99 ? 0 : prev + Math.random() * 10);
    }, 500);
    if (clickCount >= 62) setShowFakeProgress(false);
    return () => clearInterval(interval);
  }, [showFakeProgress, clickCount]);

  // Mini game target
  useEffect(() => {
    if (!showMiniGame) return;
    const interval = setInterval(() => {
      setMiniGameTarget({ x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 });
    }, 1200);
    return () => clearInterval(interval);
  }, [showMiniGame]);

  const scrambleText = (text: string) => {
    if (!textScramble) return text;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*';
    return text.split('').map(c => c === ' ' ? ' ' : Math.random() > 0.6 ? chars[Math.floor(Math.random() * chars.length)] : c).join('');
  };

  const handleClick = useCallback(() => {
    if (isLoading || showVictory) return;
    if (cursorHidden && !cursorRestored) {
      console.log('%c🚫 Clicks disabled! Press "C"!', 'color: #ef4444;');
      playBlocked();
      return;
    }
    if ((showPassword && !passwordSolved) || (showBSOD && !bsodDismissed) || 
        (showCountdown && !countdownDone) || (showCookieConsent && !cookieAccepted) ||
        (showLightsOut && !lightsFixed) || (showVirusScan && !virusScanDone) ||
        (showSimonSays && !simonDone)) {
      playBlocked();
      return;
    }
    
    playClick();
    setClickCount(prev => prev + 1);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    if (Math.random() > 0.5) {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 300);
    }

    // Click emojis
    if (clickCount > 25) {
      const emoji = ['💥', '✨', '🔥', '⚡', '💀', '🍪', '🎯'][Math.floor(Math.random() * 7)];
      const newE = { x: mousePosition.x, y: mousePosition.y, emoji, id: Date.now() };
      setClickEmojis(prev => [...prev.slice(-10), newE]);
      setTimeout(() => setClickEmojis(prev => prev.filter(e => e.id !== newE.id)), 1000);
    }
  }, [isLoading, showVictory, cursorHidden, cursorRestored, showPassword, passwordSolved, showBSOD, bsodDismissed, showCountdown, countdownDone, showCookieConsent, cookieAccepted, showLightsOut, lightsFixed, showVirusScan, virusScanDone, showSimonSays, simonDone, clickCount, mousePosition]);

  const handlePopupClose = () => {
    setPopupCount(prev => {
      const n = prev + 1;
      if (n >= 3) { setShowPopup(false); setClickCount(c => c + 3); return 0; }
      return n;
    });
  };

  const handleMiniGameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMiniGameHits(prev => {
      const n = prev + 1;
      if (n >= 5) { setShowMiniGame(false); setDiscoMode(false); setClickCount(c => c + 5); }
      return n;
    });
    setMiniGameTarget({ x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 });
  };

  const stages = [
    { threshold: 0, label: '👆' }, { threshold: 8, label: '🍪' },
    { threshold: 14, label: '🖱️' }, { threshold: 22, label: '🏃' },
    { threshold: 28, label: '🔄' }, { threshold: 32, label: '📢' },
    { threshold: 38, label: '🔒' }, { threshold: 44, label: '🔦' },
    { threshold: 50, label: '🛡️' }, { threshold: 58, label: '📊' },
    { threshold: 62, label: '💀' }, { threshold: 68, label: '🧠' },
    { threshold: 76, label: '🌀' }, { threshold: 82, label: '🪩' },
    { threshold: 90, label: '⏰' }, { threshold: 98, label: '🟢' },
    { threshold: 110, label: '🏆' },
  ];

  if (showVictory) {
    return (
      <VictoryStats
        totalClicks={clickCount}
        timeTaken={completionTime}
        stagesCleared={stages.length}
        totalStages={stages.length}
        onContinue={() => setIsLoading(true)}
      />
    );
  }

  if (isLoading) return <LoadingScreen onComplete={() => navigate('/quiz')} />;

  const getSubtext = () => {
    if (clickCount < 3) return "Error 404 :-(";
    if (clickCount < 8) return "...or so you think.";
    if (clickCount < 14 && showCookieConsent) return "🍪 Accept the cookies first!";
    if (clickCount < 14) return "That was easy... or was it?";
    if (clickCount < 22 && cursorHidden) return "Where did your cursor go? 😈";
    if (clickCount < 22) return "Clever! But I have more tricks...";
    if (clickCount < 28) return "Catch me if you can! (press R)";
    if (clickCount < 32) return "Enjoying the inverted colors? 😏";
    if (clickCount < 38) return "Close all the popups! (or press ESC)";
    if (clickCount < 44) return "Type the password to continue...";
    if (clickCount < 50) return "🔦 It's dark! Find the light switch!";
    if (clickCount < 58) return "🛡️ Scanning for threats...";
    if (clickCount < 62) return "Loading... or is it? 🤔";
    if (clickCount < 68) return "💀 BSOD! Press B to bypass!";
    if (clickCount < 76) return "🧠 Remember the sequence!";
    if (clickCount < 82) return "🌀 Everything's upside down! Press G!";
    if (clickCount < 90) return "🪩 Disco! Click the targets!";
    if (clickCount < 98) return "⏰ Waiting for the countdown...";
    if (clickCount < 110) return "You're in the matrix now...";
    return "You're actually going to win... 🏆";
  };

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden scanlines select-none transition-all duration-300 ${
        cursorHidden ? 'cursor-none' : 'cursor-pointer'
      } ${screenInverted ? 'invert' : ''}`}
      style={{ transform: `scale(${screenZoom}) rotate(${screenRotate}deg)`, transition: 'transform 0.3s ease' }}
      onClick={handleClick}
    >
      <CrackOverlay intensity={crackIntensity} visible={showCracks} />
      <CursorBlocker visible={cursorHidden && !cursorRestored} />
      <MatrixRain visible={showMatrix} />
      <DiscoMode active={discoMode} />
      <FakeBSOD visible={showBSOD && !bsodDismissed} onDismiss={() => { setBsodDismissed(true); setClickCount(c => c + 3); playStageComplete(); }} />
      <PasswordTroll visible={showPassword && !passwordSolved} onSolved={() => { setPasswordSolved(true); setShowPassword(false); setClickCount(c => c + 5); playStageComplete(); }} />
      <FakeCookieConsent visible={showCookieConsent && !cookieAccepted} onAccept={() => { setCookieAccepted(true); setShowCookieConsent(false); setClickCount(c => c + 3); playStageComplete(); }} />
      <LightsOut visible={showLightsOut && !lightsFixed} onSolved={() => { setLightsFixed(true); setShowLightsOut(false); setClickCount(c => c + 3); playStageComplete(); }} />
      <FakeVirusScan visible={showVirusScan && !virusScanDone} onComplete={() => { setVirusScanDone(true); setShowVirusScan(false); setClickCount(c => c + 3); playStageComplete(); }} />
      <SimonSays visible={showSimonSays && !simonDone} onComplete={() => { setSimonDone(true); setShowSimonSays(false); setClickCount(c => c + 5); playStageComplete(); }} />
      <GravityFlip active={gravityFlip && !gravityFixed} />
      <CountdownTroll visible={showCountdown && !countdownDone} onComplete={() => { setCountdownDone(true); setShowCountdown(false); setClickCount(c => c + 3); playStageComplete(); }} />
      
      {showPopup && (
        <>
          <FakePopup onClose={handlePopupClose} position={{ x: 20, y: 20 }} message="Are you sure you want to continue?" />
          {popupCount >= 1 && <FakePopup onClose={handlePopupClose} position={{ x: 40, y: 40 }} message="Are you REALLY sure?" />}
          {popupCount >= 2 && <FakePopup onClose={handlePopupClose} position={{ x: 60, y: 60 }} message="Last chance to give up!" />}
        </>
      )}

      {showMiniGame && (
        <div className="fixed inset-0 z-[150] pointer-events-none">
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px]" />
          <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-10">
            <p className="text-sm text-accent font-bold">🎯 Click the targets! ({miniGameHits}/5)</p>
          </div>
          <button
            className="absolute z-10 w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl pointer-events-auto hover:scale-110 transition-transform animate-pulse"
            style={{ left: `${miniGameTarget.x}%`, top: `${miniGameTarget.y}%`, transition: 'left 0.3s, top 0.3s' }}
            onClick={handleMiniGameClick}
          >
            🎯
          </button>
        </div>
      )}
      
      <FakeNavigation onLinkClick={handleClick} isActive={isRevealed} clickCount={clickCount} />

      {showKeyHint && cursorHidden && !cursorRestored && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 text-xs text-accent animate-pulse z-50">
          <p>💡 Your cursor is gone... press the right key to get it back</p>
          <p className="text-muted-foreground mt-1 opacity-50">Maybe try the first letter of "cursor"?</p>
        </div>
      )}

      {showFakeProgress && (
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-64 z-50">
          <p className="text-sm text-center mb-2 text-muted-foreground">Loading real website...</p>
          <div className="h-2 bg-muted rounded overflow-hidden">
            <div className="h-full bg-accent transition-all duration-300" style={{ width: `${Math.min(fakeProgress, 99)}%` }} />
          </div>
          <p className="text-xs text-center mt-1 text-muted-foreground">
            {fakeProgress >= 99 ? "Just kidding! 😈" : `${Math.floor(fakeProgress)}%`}
          </p>
        </div>
      )}

      {/* Click emojis */}
      {clickEmojis.map(e => (
        <span key={e.id} className="fixed pointer-events-none text-2xl animate-float z-[60]" style={{ left: e.x, top: e.y, opacity: 0.8 }}>
          {e.emoji}
        </span>
      ))}

      {/* Victory confetti */}
      {confettiEmojis.map(e => (
        <span key={e.id} className="fixed pointer-events-none text-3xl animate-float z-[60]" style={{ left: `${e.x}%`, top: `${e.y}%` }}>
          {e.emoji}
        </span>
      ))}

      {/* Main message */}
      <div className="text-center z-10 px-4 transition-transform duration-100" style={{ transform: `translate(${textPosition.x}px, ${textPosition.y}px)` }}>
        <h1 
          className={`text-4xl md:text-6xl lg:text-7xl font-mono font-bold mb-6 transition-all duration-300 ${
            isGlitching ? 'animate-glitch' : ''} ${isShaking ? 'animate-shake' : ''} ${isRevealed ? 'animate-pulse-glow' : ''}`}
          style={{ opacity: 1 - crackIntensity * 0.3, filter: crackIntensity > 0.5 ? `blur(${crackIntensity * 2}px)` : 'none' }}
        >
          {scrambleText(messages[currentMessage])}
        </h1>

        <p className={`text-muted-foreground text-sm md:text-base transition-opacity duration-500 ${clickCount > 4 ? 'opacity-50' : 'opacity-100'}`}>
          {getSubtext()}
        </p>

        {/* Stage progress */}
        <div className="flex justify-center gap-1 mt-6 flex-wrap max-w-sm mx-auto">
          {stages.map((stage, i) => {
            const next = stages[i + 1]?.threshold || breakThreshold;
            const complete = clickCount >= next;
            const current = clickCount >= stage.threshold && clickCount < next;
            return (
              <div key={i} className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all duration-300 ${
                complete ? 'bg-accent/20 scale-90' : current ? 'bg-accent/30 animate-pulse scale-110' : 'bg-muted/50 opacity-40'
              }`}>
                {stage.label}
              </div>
            );
          })}
        </div>

        {isRevealed && (
          <button
            onClick={(e) => { e.stopPropagation(); setIsLoading(true); }}
            className="mt-8 px-6 py-3 bg-accent text-accent-foreground font-mono text-sm rounded reveal-button hover:opacity-90 transition-all"
          >
            Enter the Real Website →
          </button>
        )}
      </div>

      {clickCount > 10 && (
        <>
          <div className="absolute top-1/4 left-1/4 text-muted-foreground text-xs opacity-20 animate-float">{cursorHidden ? "press 'C'" : "404"}</div>
          <div className="absolute bottom-1/3 right-1/4 text-muted-foreground text-xs opacity-20 animate-float" style={{ animationDelay: '1s' }}>{isRunningAway ? "press 'R'" : "null"}</div>
          <div className="absolute top-1/3 right-1/3 text-muted-foreground text-xs opacity-20 animate-float" style={{ animationDelay: '2s' }}>{showPopup ? "press 'ESC'" : "undefined"}</div>
        </>
      )}

      <div className="absolute bottom-8 text-xs text-muted-foreground opacity-30">
        <p className={`transition-all duration-300 ${isGlitching ? 'animate-flicker' : ''}`}>
          {clickCount < 3 && "Nothing happens here. Trust me."}
          {clickCount >= 3 && clickCount < 10 && "Check the console for secrets..."}
          {clickCount >= 10 && "The website is fighting back!"}
        </p>
      </div>
    </div>
  );
};

export default Index;
