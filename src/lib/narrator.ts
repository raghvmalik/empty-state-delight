type SubtitleListener = (text: string, visible: boolean) => void;

let listeners: SubtitleListener[] = [];
let speechQueue: { text: string; onEnd?: () => void }[] = [];
let isSpeaking = false;
let selectedVoice: SpeechSynthesisVoice | null = null;

const pickVoice = () => {
  if (selectedVoice) return selectedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Log all available voices for debugging
  console.log('🎙️ Available voices:', voices.map(v => `${v.name} (${v.lang})`));

  // Priority: natural-sounding English voices across browsers
  const preferred = [
    // Chrome/Edge high-quality voices
    'Microsoft Guy Online',
    'Microsoft Ryan Online', 
    'Microsoft Mark Online',
    'Microsoft David Desktop',
    'Google UK English Male',
    // macOS / Safari voices
    'Aaron',
    'Daniel',
    'Oliver',
    'Ralph',
    'Tom',
    // Firefox / other
    'English (America)+Male',
    'Microsoft David',
    'Microsoft Mark',
    'Alex',
    'Fred',
  ];

  for (const name of preferred) {
    const v = voices.find(v => v.name.includes(name));
    if (v) {
      console.log('🎙️ Selected voice:', v.name);
      selectedVoice = v;
      return v;
    }
  }

  // Fallback: any male-sounding English voice, then any English voice
  const english = voices.filter(v => v.lang.startsWith('en'));
  const male = english.find(v => /male|guy|david|mark|daniel|tom|ralph|aaron|james/i.test(v.name));
  if (male) { console.log('🎙️ Selected voice (fallback male):', male.name); selectedVoice = male; return male; }
  if (english.length > 0) { console.log('🎙️ Selected voice (fallback en):', english[0].name); selectedVoice = english[0]; return english[0]; }

  selectedVoice = voices[0];
  return voices[0];
};

// Load voices
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => pickVoice();
  if (window.speechSynthesis.getVoices().length > 0) pickVoice();
}

const notifyListeners = (text: string, visible: boolean) => {
  listeners.forEach(fn => fn(text, visible));
};

const processQueue = () => {
  if (isSpeaking || speechQueue.length === 0) return;

  const item = speechQueue.shift()!;
  isSpeaking = true;
  notifyListeners(item.text, true);

  if (!window.speechSynthesis) {
    const duration = Math.max(1500, item.text.length * 60);
    setTimeout(() => {
      isSpeaking = false;
      notifyListeners('', false);
      item.onEnd?.();
      processQueue();
    }, duration);
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(item.text);
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  utterance.rate = 0.92;
  utterance.pitch = 0.85;
  utterance.volume = 1.0;

  utterance.onend = () => {
    isSpeaking = false;
    setTimeout(() => {
      notifyListeners('', false);
      item.onEnd?.();
      processQueue();
    }, 400);
  };

  utterance.onerror = () => {
    isSpeaking = false;
    notifyListeners('', false);
    item.onEnd?.();
    processQueue();
  };

  window.speechSynthesis.speak(utterance);
};

export const narrate = (text: string, onEnd?: () => void) => {
  speechQueue.push({ text, onEnd });
  processQueue();
};

export const narrateNow = (text: string, onEnd?: () => void) => {
  speechQueue = [];
  isSpeaking = false;
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  narrate(text, onEnd);
};

export const subscribeSubtitles = (fn: SubtitleListener) => {
  listeners.push(fn);
  return () => { listeners = listeners.filter(l => l !== fn); };
};

export const stopNarration = () => {
  speechQueue = [];
  isSpeaking = false;
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  notifyListeners('', false);
};

const clickReactions = [
  "Ow!", "Stop that!", "That tickles!", "Why?!", "I felt that one!",
  "Ouch!", "Quit it!", "Hey!", "Not again!", "Do you mind?!",
  "Rude!", "That's my screen!",
];

let lastClickReaction = -1;

export const narrateClickReaction = () => {
  let idx: number;
  do {
    idx = Math.floor(Math.random() * clickReactions.length);
  } while (idx === lastClickReaction);
  lastClickReaction = idx;
  narrateNow(clickReactions[idx]);
};
