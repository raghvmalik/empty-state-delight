// Web Audio API sound effects - no external libraries needed
let audioCtx: AudioContext | null = null;

const getCtx = () => {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
};

const playTone = (freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) => {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
};

export const playClick = () => {
  playTone(800 + Math.random() * 400, 0.08, 'square', 0.08);
};

export const playStageComplete = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  [523, 659, 784].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.12);
    gain.gain.setValueAtTime(0.15, now + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.12);
    osc.stop(now + i * 0.12 + 0.3);
  });
};

export const playError = () => {
  playTone(200, 0.3, 'sawtooth', 0.1);
};

export const playVictory = () => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const melody = [523, 587, 659, 784, 880, 1047];
  melody.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.15);
    gain.gain.setValueAtTime(0.2, now + i * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.15);
    osc.stop(now + i * 0.15 + 0.4);
  });
};

export const playBlocked = () => {
  playTone(150, 0.15, 'square', 0.06);
};
