import { create } from 'zustand'
import { storage } from '../lib/utils/storage.js'

export const usePlayerStore = create((set, get) => ({
  // Playback
  isPlaying: false,
  currentTrack: null,
  currentTime: 0,
  duration: 0,
  volume: storage.get('volume', 0.8),

  // Playlist (10 disc slots)
  playlist: storage.get('playlist', []),
  activeSlotIndex: 0,

  // Source type
  sourceType: null, // 'youtube' | 'soundcloud' | 'direct' | 'nostr'

  // FX
  fx: { reverb: false, delay: false, tapeStop: false, loop: false },

  // EQ gains (8 bands, dB)
  eqGains: [0, 0, 0, 0, 0, 0, 0, 0],

  // Lyrics
  lyrics: [],
  currentLyricIndex: 0,

  // Nostr
  nostrPubkey: storage.get('nostrPubkey', null),
  nostrProfile: null,
  isNostrLoggedIn: false,

  // UI
  theme: storage.get('theme', 'teal'),
  settingsOpen: false,
  addTrackOpen: false,
  addToSlot: null, // which slot index to fill

  // Actions
  setPlaying: (v) => set({ isPlaying: v }),
  setCurrentTime: (t) => set({ currentTime: t }),
  setDuration: (d) => set({ duration: d }),

  setVolume: (v) => {
    storage.set('volume', v)
    set({ volume: v })
  },

  setCurrentTrack: (track, slotIndex) => set({
    currentTrack: track,
    activeSlotIndex: slotIndex ?? get().activeSlotIndex,
    currentTime: 0,
    sourceType: track?.source ?? null,
  }),

  addToPlaylist: (track, slotIndex) => {
    const playlist = [...get().playlist]
    const idx = slotIndex ?? playlist.findIndex(t => !t)
    const finalIdx = idx === -1 ? 0 : idx
    playlist[finalIdx] = track
    storage.set('playlist', playlist)
    set({ playlist })
    return finalIdx
  },

  removeFromPlaylist: (slotIndex) => {
    const playlist = [...get().playlist]
    playlist[slotIndex] = null
    storage.set('playlist', playlist)
    set({ playlist })
  },

  setActiveSlot: (idx) => set({ activeSlotIndex: idx }),

  toggleFX: (key) => set(s => ({ fx: { ...s.fx, [key]: !s.fx[key] } })),

  setEQGain: (bandIndex, gain) => set(s => {
    const eqGains = [...s.eqGains]
    eqGains[bandIndex] = gain
    return { eqGains }
  }),

  setLyrics: (lyrics) => set({ lyrics }),
  setCurrentLyricIndex: (i) => set({ currentLyricIndex: i }),

  setNostrLogin: (pubkey, profile) => {
    storage.set('nostrPubkey', pubkey)
    set({ nostrPubkey: pubkey, nostrProfile: profile, isNostrLoggedIn: !!pubkey })
  },
  setNostrProfile: (profile) => set({ nostrProfile: profile }),
  nostrLogout: () => {
    storage.remove('nostrPubkey')
    set({ nostrPubkey: null, nostrProfile: null, isNostrLoggedIn: false })
  },

  setTheme: (theme) => {
    storage.set('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
    set({ theme })
  },

  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),
  openAddTrack: (slotIndex = null) => set({ addTrackOpen: true, addToSlot: slotIndex }),
  closeAddTrack: () => set({ addTrackOpen: false, addToSlot: null }),

  nextTrack: () => {
    const { playlist, activeSlotIndex } = get()
    const filled = playlist.map((t, i) => t ? i : null).filter(i => i !== null)
    if (!filled.length) return
    const cur = filled.indexOf(activeSlotIndex)
    const next = filled[(cur + 1) % filled.length]
    return next
  },

  prevTrack: () => {
    const { playlist, activeSlotIndex } = get()
    const filled = playlist.map((t, i) => t ? i : null).filter(i => i !== null)
    if (!filled.length) return
    const cur = filled.indexOf(activeSlotIndex)
    const prev = filled[(cur - 1 + filled.length) % filled.length]
    return prev
  },
}))
