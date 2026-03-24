# DESKMAN® — Web App Specification
### Version 1.0 · Built for GitHub + Cloudflare Pages

---

## 1. Vision

DESKMAN is a retro-futuristic music player web app that recreates the fictional **DESKMAN CD+MD** device as a living, interactive interface. Users can play music from YouTube playlists, SoundCloud, direct audio URLs, and Nostr Value4Value sources — all inside a beautifully faithful 3D-inspired dark-teal hardware aesthetic. The app integrates deeply with Nostr: NIP-07 login, V4V zaps per track, social "now playing" sharing, and a follow-based music feed.

---

## 2. Design Language

**Palette**
- Background: `#000000` / `#050908`
- Device body: `#0d1f1a` (dark teal)
- Display glass: `#0a1f18` with `rgba(0,255,180,0.06)` tint
- Accent green: `#00ffb3` / `#7fffcc`
- Accent orange/red (stop button): `#ff3b1f`
- Text primary: `#e8fff7`
- Text secondary: `#4a9e80`
- Scanline overlay: `rgba(0,0,0,0.15)` repeating gradient

**Typography**
- Display/Logo: `Share Tech Mono` or `VT323` — monospaced, terminal-feel
- Body/Specs: `IBM Plex Mono` — technical precision
- UI Labels: `Courier Prime` — cassette/spec readouts

**Motion** (via anime.js)
- Disc rotation: continuous `rotate(360deg)` at ~33RPM, pauses on stop
- Cassette text: horizontal marquee scroll for lyrics
- EQ bars: real-time AudioContext AnalyserNode data or simulated bounce
- Loading: dot-matrix pixel reveal animation
- Track change: brief disc "brake" deceleration then re-spin

**Effects**
- CRT scanline overlay on the display panel
- Glassmorphism on the disc dome: `backdrop-filter: blur(12px)`
- Particle field background (stars) via `@casberry/particles` or `tsParticles`
- Subtle green phosphor glow on all display text

---

## 3. Layout — Mobile First

The app is a **single scrollable vertical column** on mobile, designed to feel like the DESKMAN device is physical and centered on screen.

```
┌─────────────────────────┐
│   DESKMAN® header bar   │  ← logo + SerSleepy tag + Nostr login button
├─────────────────────────┤
│                         │
│    DISC DOME            │  ← spinning CD, album art dot-matrix, track info
│    (360° glassmorphism) │
│                         │
├─────────────────────────┤
│  DISPLAY PANEL          │  ← track name, artist, source badge (CD/MD/YT)
│  [progress bar]         │     progress bar with timestamp
│  [00:25 ————— 02:00]   │
├─────────────────────────┤
│  TRANSPORT CONTROLS     │  ← ⏮ ⏯ ⏭ + big STOP (red) + VOL [-][+]
├─────────────────────────┤
│  8-BAND EQ              │  ← visual bars animated by Web Audio API
│  ▌▌▌▌▌▌▌▌              │
├─────────────────────────┤
│  FX ENGINE              │  ← [ REVERB ] [ DELAY ] [ TAPE STOP ] [ LOOP ]
│                         │     toggle buttons, neon lit when active
├─────────────────────────┤
│  LYRIC CASSETTE         │  ← scrolling text panel (lyrics or description)
│  ▓░░░░░░░░░░░░░░░░░░▓   │
├─────────────────────────┤
│  PLAYLIST / DISC SLOTS  │  ← horizontal scroll of disc slots (10 slots)
│  [1][2][3]...[10]       │
├─────────────────────────┤
│  NOSTR PANEL            │  ← zap button, share now-playing, follow feed
│                         │
├─────────────────────────┤
│  TECH SPECS (footer)    │  ← static spec readout like the original design
└─────────────────────────┘
```

**Desktop:** Two-column layout. Left = device panels. Right = Nostr feed + playlist browser.

---

## 4. Music Sources

### 4.1 YouTube Playlists
- Input: paste a YouTube playlist URL or video URL
- Implementation: YouTube IFrame Player API (`youtube-nocookie.com`)
- The IFrame is hidden; the DESKMAN UI controls it via `postMessage` / YT API methods
- Track metadata: `getVideoData()` → title, author, thumbnail (converted to dot-matrix style)
- Playlist items: fetched via `youtube-data-api` or parsed from IFrame API's playlist methods

### 4.2 SoundCloud
- Input: paste a SoundCloud track or playlist URL
- Implementation: SoundCloud Widget API (`w.soundcloud.com/player`)
- Hidden IFrame, controlled via SC Widget SDK
- Metadata: `widget.getCurrentSound()` → title, user, artwork_url

### 4.3 Direct Audio URLs / MP3s
- Input: paste any direct `.mp3`, `.ogg`, `.flac`, `.m4a` URL
- Implementation: HTML5 `<audio>` element controlled via JS
- Web Audio API `AnalyserNode` connected for real EQ visualization
- Metadata: ID3 tags via `jsmediatags` library if available, else filename parse

### 4.4 Nostr Value4Value (NWC / Lightning)
- Nostr tracks are discovered via kind:31337 (music events) or kind:1 with audio URLs embedded
- Zap per-track via Nostr Wallet Connect (NWC) or WebLN
- Source badge shows `[V4V]` on the display panel

---

## 5. Nostr Integration

### 5.1 Login — NIP-07
```
applesauce-signers → NIP07Signer
```
- "Login" button in header triggers `window.nostr.getPublicKey()`
- Compatible with: Alby extension, nos2x, Nostore (iOS), Amber (Android)
- Pubkey stored in React state + localStorage for persistence
- Profile loaded via applesauce-core `EventStore` + relay pool

### 5.2 Value4Value Zapping
- Per-track zap button (⚡) appears in transport controls when logged in
- Flow:
  1. Lookup track artist's Nostr pubkey (via NIP-05 or embedded in kind:31337)
  2. Fetch LNURL from profile kind:0
  3. Create zap request (kind:9734) signed with NIP07Signer
  4. Pay via `window.webln.sendPayment()` (WebLN) OR NWC string (user-provided in settings)
- Default zap amount: configurable (default 21 sats)
- Zap confirmation: brief lightning bolt animation on the disc

### 5.3 "Now Playing" Share (kind:1)
- Share button (📡) in transport controls
- Publishes kind:1 note: `"🎛️ Now playing: {title} — {artist} on DESKMAN® {url} #music #nowplaying"`
- Uses applesauce-relay `RelayPool` to publish to user's write relays (NIP-65)
- Optional: attach `imeta` tag with audio URL (NIP-94 style)

### 5.4 Follow-Based Music Feed
- Panel at bottom shows kind:1 notes from follows that contain audio URLs or #music tag
- Loaded via nostrify `NPool` subscribing to user's follows list (kind:3)
- Tap a note in the feed → loads that audio into DESKMAN player
- Displayed as mini disc-slot cards with author avatar + track title

### 5.5 Relay Configuration
```javascript
// Default relays
const DEFAULT_RELAYS = [
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://nostr.wine",
];
```
User can override in Settings panel.

---

## 6. Core Features

### 6.1 Disc Dome
- Large circular element (80vw max, 360px desktop)
- Spins at ~0.3RPM (slow, dramatic) while playing
- Center: dot-matrix pixel art rendition of album art (canvas, 64×64 dithered)
- Ring: concentric circles like vinyl grooves (CSS `border-radius` layers)
- Pauses + decelerates on pause/stop (CSS `animation-play-state` + easing)

### 6.2 Display Panel
- CRT-style dark panel with green phosphor text
- Shows: `TRACK NAME`, `ARTIST`, `ALBUM`, `SOURCE [CD/MD/YT/SC/V4V]`
- Progress: custom scrubber bar — click to seek
- Time: `[00:25 ————————— 02:00]` monospace readout
- Refresh rate: 120Hz simulated (smooth progress updates via `requestAnimationFrame`)

### 6.3 8-Band EQ
- Bands: 60Hz, 230Hz, 910Hz, 3.6kHz, 14kHz + 3 user-tunable
- **Functional** when source is direct audio URL (Web Audio API AnalyserNode)
- **Simulated** (animated) for YouTube/SoundCloud (no raw PCM access)
- Visual: vertical bars with `#00ffb3` glow, neon lit
- Interactive: tap/drag bars to adjust gain (direct audio only)

### 6.4 FX Engine (Web Audio API — direct audio only)
| Button | Effect | Implementation |
|--------|--------|----------------|
| REVERB | ConvolverNode with impulse response | IR from freeverb.js |
| DELAY | DelayNode + feedback loop | Max 2000ms |
| TAPE STOP | Pitch-down + slowdown simulation | AudioBufferSourceNode playbackRate ramp |
| LOOP | Loop 1–32 bar region | AudioContext loop points |

For YouTube/SoundCloud: buttons glow as visual-only mode, no audio effect.

### 6.5 Lyric Cassette
- Horizontal scrolling cassette-tape panel
- Content priority:
  1. Synced lyrics from Nostr kind:1775 (if available)
  2. YouTube chapter markers / description
  3. SoundCloud track description
  4. User-pasted lyrics in Settings
- Scrolls automatically to match playback position
- Font: `VT323` or `Share Tech Mono`, teal on near-black

### 6.6 Playlist / Disc Carousel
- 10 disc slots shown as horizontal scroll
- Each slot: numbered (1–10), shows mini album art + track title truncated
- Active slot: glows green, shows spinning animation
- Add track/playlist: tap `[+]` slot → modal to paste URL
- Drag to reorder

---

## 7. Settings Panel
- Accessible via gear icon (⚙) in header
- Options:
  - Nostr relay list (add/remove)
  - NWC connection string (for zaps without WebLN)
  - Default zap amount
  - EQ preset save/load
  - FX defaults
  - Theme: TEAL (default) / VOID (pure black) / AMBER (orange CRT)

---

## 8. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS + custom CSS variables |
| Animations | anime.js v3 |
| Particles | tsParticles (lightweight, mobile-friendly) |
| Audio | Web Audio API (native) |
| YouTube | YouTube IFrame Player API |
| SoundCloud | SoundCloud Widget API |
| Nostr State | applesauce-core (EventStore + RxJS) |
| Nostr Relays | applesauce-relay (RelayPool) |
| Nostr Signers | applesauce-signers (NIP07Signer) |
| Nostr Types | nostrify (schemas, types, NPool) |
| Zaps | WebLN + nostr-zap (NIP-57) |
| ID3 Tags | jsmediatags |
| Icons | Lucide React |
| Hosting | Cloudflare Pages (static) |

---

## 9. File & Folder Structure

```
deskman/
│
├── public/
│   ├── favicon.ico
│   ├── og-image.png              ← social preview (DESKMAN device render)
│   └── impulse-response.wav      ← reverb IR for Web Audio FX
│
├── src/
│   ├── main.jsx                  ← React entry point
│   ├── App.jsx                   ← root layout, router (none needed — SPA)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx        ← DESKMAN logo + Nostr login button
│   │   │   └── TechSpecsFooter.jsx ← static spec readout
│   │   │
│   │   ├── player/
│   │   │   ├── DiscDome.jsx      ← spinning disc + album art canvas
│   │   │   ├── DisplayPanel.jsx  ← track info + progress bar
│   │   │   ├── TransportControls.jsx ← ⏮ ⏯ ⏭ STOP VOL + ZAP + SHARE
│   │   │   ├── EQPanel.jsx       ← 8-band equalizer visual + functional
│   │   │   ├── FXEngine.jsx      ← REVERB DELAY TAPE STOP LOOP buttons
│   │   │   ├── LyricCassette.jsx ← scrolling lyric tape panel
│   │   │   └── DiscCarousel.jsx  ← 10-slot horizontal playlist browser
│   │   │
│   │   ├── nostr/
│   │   │   ├── NostrLoginButton.jsx  ← NIP-07 login/logout
│   │   │   ├── ZapButton.jsx         ← ⚡ per-track zap
│   │   │   ├── ShareNowPlaying.jsx   ← 📡 publish kind:1
│   │   │   └── MusicFeed.jsx         ← follow-based audio note feed
│   │   │
│   │   ├── modals/
│   │   │   ├── AddTrackModal.jsx  ← paste YouTube/SC/MP3/Nostr URL
│   │   │   └── SettingsModal.jsx  ← relays, NWC, zap amount, themes
│   │   │
│   │   └── ui/
│   │       ├── ParticleField.jsx  ← tsParticles star background
│   │       ├── ScanlineOverlay.jsx ← CRT scanline CSS effect
│   │       ├── DotMatrixArt.jsx   ← canvas album art dithering
│   │       └── GlowButton.jsx     ← reusable neon button component
│   │
│   ├── hooks/
│   │   ├── usePlayer.js           ← unified player state (source-agnostic)
│   │   ├── useYouTubePlayer.js    ← YT IFrame API integration
│   │   ├── useSoundCloud.js       ← SC Widget API integration
│   │   ├── useDirectAudio.js      ← HTML5 audio + Web Audio API
│   │   ├── useWebAudioFX.js       ← reverb/delay/loop/tape stop nodes
│   │   ├── useEQ.js               ← AnalyserNode → EQ bar data
│   │   ├── useNostr.js            ← applesauce EventStore + relay pool
│   │   ├── useNostrLogin.js       ← NIP-07 signer + pubkey state
│   │   ├── useZap.js              ← WebLN / NWC zap flow
│   │   └── useLyrics.js           ← lyric source resolution + sync
│   │
│   ├── lib/
│   │   ├── nostr/
│   │   │   ├── relayPool.js       ← applesauce-relay RelayPool singleton
│   │   │   ├── eventStore.js      ← applesauce-core EventStore singleton
│   │   │   ├── signer.js          ← NIP07Signer factory
│   │   │   └── zapRequest.js      ← NIP-57 zap request builder
│   │   │
│   │   ├── audio/
│   │   │   ├── audioContext.js    ← singleton AudioContext
│   │   │   ├── fxNodes.js         ← reverb/delay/tape/loop node setup
│   │   │   └── dotMatrix.js       ← album art → 64×64 dithered canvas
│   │   │
│   │   └── utils/
│   │       ├── urlParser.js       ← detect YouTube/SC/MP3/Nostr from URL
│   │       ├── timeFormat.js      ← seconds → MM:SS
│   │       └── storage.js         ← localStorage helpers
│   │
│   ├── store/
│   │   └── playerStore.js         ← Zustand store (player + playlist state)
│   │
│   ├── styles/
│   │   ├── index.css              ← Tailwind base + CSS custom properties
│   │   ├── deskman.css            ← device-specific styles, CRT effects
│   │   ├── animations.css         ← keyframes (disc spin, cassette scroll)
│   │   └── themes.css             ← TEAL / VOID / AMBER theme vars
│   │
│   └── constants/
│       ├── relays.js              ← default relay list
│       └── eqBands.js             ← EQ frequency band definitions
│
├── index.html                     ← Vite HTML template
├── vite.config.js                 ← Vite config (base: '/')
├── tailwind.config.js             ← Tailwind config + custom font/color
├── postcss.config.js
├── package.json
├── .gitignore
├── README.md                      ← setup + deploy instructions
└── _redirects                     ← Cloudflare Pages SPA fallback (/* /index.html 200)
```

---

## 10. package.json — Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "animejs": "^3.2.2",
    "tsparticles": "^2.12.0",
    "@tsparticles/react": "^2.12.0",
    "applesauce-core": "latest",
    "applesauce-relay": "latest",
    "applesauce-signers": "latest",
    "applesauce-common": "latest",
    "applesauce-react": "latest",
    "nostrify": "latest",
    "nostr-tools": "^2.7.0",
    "zustand": "^4.5.0",
    "rxjs": "^7.8.0",
    "jsmediatags": "^3.9.7",
    "lucide-react": "^0.383.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

---

## 11. Cloudflare Pages Deployment

### Build Settings (in Cloudflare dashboard)
| Setting | Value |
|---------|-------|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 20 |

### `_redirects` file (in `/public/`)
```
/* /index.html 200
```
This ensures React Router / deep links work on refresh.

### `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})
```

---

## 12. GitHub Repository Structure

### Recommended Repo Name
`deskman` or `deskman-player`

### Branch Strategy
- `main` → production (auto-deploys to Cloudflare Pages)
- `dev` → active development
- Feature branches: `feature/nostr-feed`, `feature/fx-engine`, etc.

### `.gitignore`
```
node_modules/
dist/
.env
.env.local
*.local
.DS_Store
```

### `README.md` Contents
```markdown
# DESKMAN®
> The ultimate fusion of design and sound. A retro-futuristic web music player 
> with Nostr Value4Value integration.

## Features
- YouTube, SoundCloud, direct audio playback
- Nostr NIP-07 login (Alby, nos2x, Amber)
- Value4Value zaps per track (WebLN + NWC)
- "Now Playing" Nostr social sharing
- Follow-based music discovery feed
- 8-Band EQ + FX Engine (Web Audio API)
- Lyric cassette display
- Mobile-first design

## Tech Stack
React + Vite · Tailwind CSS · anime.js · applesauce · nostrify

## Local Development
npm install
npm run dev

## Deploy
Push to main → Cloudflare Pages auto-deploys.
```

---

## 13. Mobile-Specific Considerations

Since the app is **mobile-primary**, every component must account for:

- **Touch targets**: All buttons minimum 44×44px (Apple HIG standard)
- **No hover-only states**: All hover effects also triggered on `:active`
- **Disc dome**: Max `80vw` width, centered, never overflows
- **EQ panel**: Touch-drag on bars to adjust gain (use `touchmove` + `pointermove`)
- **Horizontal carousels** (disc slots, music feed): `-webkit-overflow-scrolling: touch`, snap scrolling
- **Keyboard**: Input fields (URL paste) trigger native keyboard — ensure `viewport` meta has `initial-scale=1` so layout doesn't shift
- **Audio autoplay**: iOS requires a user gesture before audio plays — the play button IS that gesture, no workaround needed
- **YouTube IFrame on iOS**: Must be `playsinline` attribute to prevent fullscreen hijack
- **WebLN / NIP-07 on mobile**: 
  - Alby Go app handles WebLN on mobile Safari
  - Amber handles NIP-07 on Android via intent URLs
  - Nostore handles NIP-07 on iOS Safari
  - Show a "Connect wallet" helper modal explaining options if `window.nostr` is undefined
- **tsParticles**: Use `lite` bundle on mobile, reduce particle count to ≤40 for performance
- **anime.js disc spin**: Use `transform: rotate()` only (GPU composited), never `top/left` animation

---

## 14. State Management (Zustand)

```javascript
// src/store/playerStore.js
{
  // Playback
  isPlaying: false,
  currentTrack: null,         // { title, artist, album, duration, source, url, artUrl }
  currentTime: 0,
  duration: 0,
  volume: 0.8,

  // Playlist (10 disc slots)
  playlist: [],               // array of track objects, max 10
  activeSlotIndex: 0,

  // Source type
  sourceType: null,           // 'youtube' | 'soundcloud' | 'direct' | 'nostr'

  // FX
  fx: {
    reverb: false,
    delay: false,
    tapeStop: false,
    loop: false,
  },

  // EQ
  eqGains: [0, 0, 0, 0, 0, 0, 0, 0], // 8 bands, dB values

  // Lyrics
  lyrics: [],                 // [{ time: 0, text: "..." }, ...]
  currentLyricIndex: 0,

  // Nostr
  nostrPubkey: null,
  nostrProfile: null,
  isNostrLoggedIn: false,

  // UI
  theme: 'teal',              // 'teal' | 'void' | 'amber'
  settingsOpen: false,
  addTrackOpen: false,
}
```

---

## 15. Key Implementation Notes

### URL Detection Logic (`src/lib/utils/urlParser.js`)
```javascript
export function detectSourceType(url) {
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/soundcloud\.com/.test(url)) return 'soundcloud';
  if (/\.(mp3|ogg|flac|m4a|wav)(\?|$)/i.test(url)) return 'direct';
  if (/nostr:|njump\.me|naddr|nevent/.test(url)) return 'nostr';
  return 'unknown';
}
```

### Disc Spin Animation (`src/styles/animations.css`)
```css
@keyframes discSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.disc-spinning {
  animation: discSpin 4s linear infinite;
}

.disc-decelerating {
  animation: discSpin 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-duration: 1.5s;
}
```

### CRT Scanline Effect (`src/styles/deskman.css`)
```css
.crt-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15) 0px,
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 10;
}
```

### Phosphor Glow Text
```css
.phosphor-text {
  color: #00ffb3;
  text-shadow:
    0 0 4px #00ffb3,
    0 0 10px rgba(0, 255, 179, 0.4),
    0 0 20px rgba(0, 255, 179, 0.2);
}
```

---

## 16. V1 Scope vs Future Roadmap

### V1 (Launch)
- [x] YouTube playlist playback
- [x] Direct audio URL playback
- [x] Disc dome with spin animation
- [x] Display panel with progress
- [x] Transport controls
- [x] Simulated EQ visualization
- [x] FX buttons (visual, direct-audio functional)
- [x] Lyric cassette (description text)
- [x] 10-slot disc carousel
- [x] Nostr NIP-07 login
- [x] "Now Playing" kind:1 share
- [x] Particle field background
- [x] Mobile-first responsive layout
- [x] Cloudflare Pages deploy

### V2 (Post-launch)
- [ ] SoundCloud playback
- [ ] V4V zaps per track (WebLN + NWC)
- [ ] Follow-based Nostr music feed
- [ ] Functional Web Audio EQ (drag bars)
- [ ] Synced lyrics from Nostr kind:1775
- [ ] Dot-matrix album art canvas renderer
- [ ] AMBER + VOID themes
- [ ] PWA / installable on mobile home screen
- [ ] Offline playlist caching (Service Worker)
- [ ] NIP-96 / Blossom audio file upload