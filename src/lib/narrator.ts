type SubtitleListener = (text: string, visible: boolean) => void;

let listeners: SubtitleListener[] = [];
let speechQueue: { text: string; onEnd?: () => void }[] = [];
let isSpeaking = false;
let audioCache: Map<string, string> = new Map(); // text -> blobURL

const notifyListeners = (text: string, visible: boolean) => {
  listeners.forEach(fn => fn(text, visible));
};

const fetchTTSAudio = async (text: string): Promise<string | null> => {
  // Check cache first
  if (audioCache.has(text)) return audioCache.get(text)!;

  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      console.warn('TTS request failed, falling back to browser speech:', response.status);
      return null;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    audioCache.set(text, url);
    return url;
  } catch (err) {
    console.warn('TTS fetch error, falling back to browser speech:', err);
    return null;
  }
};

// Browser speech fallback
let selectedVoice: SpeechSynthesisVoice | null = null;

const pickVoice = () => {
  if (selectedVoice) return selectedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  
  const preferred = ['Google UK English Male', 'Daniel', 'Microsoft David', 'Google US English', 'Alex', 'Fred'];
  for (const name of preferred) {
    const v = voices.find(v => v.name.includes(name));
    if (v) { selectedVoice = v; return v; }
  }
  const english = voices.find(v => v.lang.startsWith('en'));
  if (english) { selectedVoice = english; return english; }
  selectedVoice = voices[0];
  return voices[0];
};

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => pickVoice();
  if (window.speechSynthesis.getVoices().length > 0) pickVoice();
}

const playWithBrowserSpeech = (text: string, onDone: () => void) => {
  if (!window.speechSynthesis) {
    const duration = Math.max(1500, text.length * 60);
    setTimeout(onDone, duration);
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  utterance.rate = 0.95;
  utterance.pitch = 0.9;
  utterance.volume = 0.8;
  utterance.onend = () => onDone();
  utterance.onerror = () => onDone();
  window.speechSynthesis.speak(utterance);
};

let currentAudio: HTMLAudioElement | null = null;

const processQueue = async () => {
  if (isSpeaking || speechQueue.length === 0) return;
  
  const item = speechQueue.shift()!;
  isSpeaking = true;
  notifyListeners(item.text, true);

  // Try ElevenLabs first
  const audioUrl = await fetchTTSAudio(item.text);

  if (audioUrl) {
    const audio = new Audio(audioUrl);
    currentAudio = audio;
    audio.onended = () => {
      currentAudio = null;
      isSpeaking = false;
      setTimeout(() => {
        notifyListeners('', false);
        item.onEnd?.();
        processQueue();
      }, 400);
    };
    audio.onerror = () => {
      currentAudio = null;
      // Fallback to browser speech
      playWithBrowserSpeech(item.text, () => {
        isSpeaking = false;
        setTimeout(() => {
          notifyListeners('', false);
          item.onEnd?.();
          processQueue();
        }, 400);
      });
    };
    audio.play().catch(() => {
      // Autoplay blocked — fallback
      currentAudio = null;
      playWithBrowserSpeech(item.text, () => {
        isSpeaking = false;
        setTimeout(() => {
          notifyListeners('', false);
          item.onEnd?.();
          processQueue();
        }, 400);
      });
    });
  } else {
    // Fallback to browser speech
    playWithBrowserSpeech(item.text, () => {
      isSpeaking = false;
      setTimeout(() => {
        notifyListeners('', false);
        item.onEnd?.();
        processQueue();
      }, 400);
    });
  }
};

export const narrate = (text: string, onEnd?: () => void) => {
  speechQueue.push({ text, onEnd });
  processQueue();
};

export const narrateNow = (text: string, onEnd?: () => void) => {
  speechQueue = [];
  isSpeaking = false;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  narrate(text, onEnd);
};

export const subscribeSubtitles = (fn: SubtitleListener) => {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
};

export const stopNarration = () => {
  speechQueue = [];
  isSpeaking = false;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  notifyListeners('', false);
};

// Random click reactions
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
