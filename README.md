# DESKMAN®
> The ultimate fusion of design and sound.

A retro-futuristic web music player with Nostr integration, built by SerSleepy.

## Features
- YouTube playlist + video playback
- Direct audio URL playback (MP3, OGG, FLAC, M4A)
- Nostr NIP-07 login (Alby, nos2x, Amber, Nostore)
- "Now Playing" Nostr social sharing (kind:1)
- 8-Band EQ visualizer (real + simulated)
- FX Engine: Reverb · Delay · Tape Stop · Loop
- Lyric cassette display
- 10-slot disc carousel
- TEAL / VOID / AMBER themes
- Mobile-first, PWA-ready

## Tech Stack
React 18 · Vite · Tailwind CSS · anime.js · applesauce · nostr-tools · Zustand

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Cloudflare Pages

1. Push to GitHub
2. Connect repo in Cloudflare Pages dashboard
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Set `NODE_VERSION = 20` in environment variables

Every push to `main` auto-deploys.

## Nostr Signers (mobile)
- **iOS**: [Nostore](https://apps.apple.com/app/nostore/id1666553677)
- **Android**: [Amber](https://github.com/greenart7c3/Amber)
- **Desktop**: [Alby](https://getalby.com) or [nos2x](https://github.com/fiatjaf/nos2x)

## License
MIT · SerSleepy · DESKMAN®
