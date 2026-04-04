

## Plan: Add Narrator Voice & Subtitles System

### What We're Building
A narrator that speaks to the user throughout the experience with playful, taunting commentary — plus on-screen subtitles that display what's being said. Similar to "There Is No Game" style narration where the voice reacts to clicks, stage transitions, and user actions.

### Approach
Use the browser's built-in `SpeechSynthesis` API (free, no setup needed). Create a narrator utility and a subtitle overlay component.

### Technical Details

**1. Create `src/lib/narrator.ts`** — Voice + subtitle engine
- Wraps `window.speechSynthesis` with a queue system (so lines don't overlap)
- Exposes `narrate(text, callback?)` function
- Fires a custom event or uses a shared state callback so the subtitle component can display current text
- Picks a deep/dramatic voice from available browser voices
- Manages a subtitle state via a simple pub/sub pattern

**2. Create `src/components/SubtitleOverlay.tsx`** — Bottom-of-screen subtitle bar
- Subscribes to narrator events
- Shows current spoken text with a typing/fade animation
- Positioned at bottom center, semi-transparent background
- Auto-hides after speech ends

**3. Update `src/pages/Index.tsx`** — Add narration triggers throughout
- **On load**: "Hello there... This is awkward. You see, there's supposed to be a website here. But... sorry to disappoint you."
- **First clicks (1-3)**: "Wait... are you clicking? Why are you clicking?"
- **Clicks 4-7**: "Seriously, stop that. There's nothing here!"
- **Cookie stage**: "Oh great, now I have to show you the cookie popup. Company policy."
- **Cursor stolen**: "Ha! Good luck clicking without a cursor!"
- **Cursor restored**: "What?! How did you get that back?!"
- **Text running**: "Run, text, RUN! Don't let them catch you!"
- **Popup stage**: "Popups! Everyone's favorite! You're welcome."
- **Password wall**: "Let's see if you can guess the password..."
- **Lights out**: "Oops... who turned off the lights?"
- **Virus scan**: "Hold on, let me scan you for viruses..."
- **BSOD**: "Oh no... that doesn't look good."
- **Simon Says**: "Time for a brain test! Try to keep up."
- **Gravity flip**: "Everything's upside down? That's a feature, not a bug."
- **Disco mode**: "Fine, let's at least have some fun while you destroy my website."
- **Countdown**: "Okay okay, I'll let you in. Just wait..."
- **Matrix rain**: "You're seeing the code now... you're the chosen one."
- **Near end**: "No... NO! The barrier is cracking!"
- **Victory**: "Fine. You win. I hope you're happy."
- **Reactive click lines** (random from pool): "Ow!", "Stop that!", "That tickles!", "Why?!", "I felt that one!"

**4. Wire subtitle overlay into Index.tsx** — Render `<SubtitleOverlay />` as a fixed overlay

### Files Changed
- **New**: `src/lib/narrator.ts`
- **New**: `src/components/SubtitleOverlay.tsx`
- **Modified**: `src/pages/Index.tsx` — import narrator, add narration calls at stage transitions and on clicks

