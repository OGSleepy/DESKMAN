import React, { useEffect } from 'react'
import { Header } from './components/layout/Header.jsx'
import { TechSpecsFooter } from './components/layout/TechSpecsFooter.jsx'
import { DiscDome } from './components/player/DiscDome.jsx'
import { DisplayPanel } from './components/player/DisplayPanel.jsx'
import { TransportControls } from './components/player/TransportControls.jsx'
import { EQPanel } from './components/player/EQPanel.jsx'
import { FXEngine } from './components/player/FXEngine.jsx'
import { LyricCassette } from './components/player/LyricCassette.jsx'
import { DiscCarousel } from './components/player/DiscCarousel.jsx'
import { AddTrackModal } from './components/modals/AddTrackModal.jsx'
import { SettingsModal } from './components/modals/SettingsModal.jsx'
import { ParticleField } from './components/ui/ParticleField.jsx'
import { ScanlineOverlay } from './components/ui/ScanlineOverlay.jsx'
import { usePlayer } from './hooks/usePlayer.js'
import { usePlayerStore } from './store/playerStore.js'

export default function App() {
  const { theme } = usePlayerStore()
  const player = usePlayer()

  // Apply theme on mount and change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleSlotSelect = (track, slotIndex) => {
    player.loadTrack(track, slotIndex)
  }

  const handleAddTrack = (track, slotIndex) => {
    player.loadTrack(track, slotIndex)
  }

  return (
    <div style={{ position: 'relative', zIndex: 2 }}>
      {/* Background effects */}
      <ParticleField />
      <ScanlineOverlay />

      {/* Hidden YouTube player container — stays mounted in DOM at all times */}
      <div
        id={player.ytContainerId}
        style={{
          position: 'fixed', width: 1, height: 1,
          opacity: 0, pointerEvents: 'none',
          top: -9999, left: -9999, zIndex: -1,
        }}
      />

      {/* Main layout */}
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Sticky header */}
        <Header />

        {/* Device body */}
        <main
          style={{
            flex: 1,
            maxWidth: 520,
            width: '100%',
            margin: '0 auto',
            paddingBottom: 32,
          }}
        >
          <div className="deskman-device mx-3 my-4" style={{ position: 'relative' }}>
            {/* Left ruler */}
            <div className="ruler-left" />

            <div style={{ paddingLeft: 22, paddingTop: 4, paddingBottom: 8 }}>

              {/* Device top label bar */}
              <div className="flex items-center justify-between px-4 pt-3 pb-2">
                <div className="flex items-center gap-2">
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--green)',
                    boxShadow: '0 0 8px var(--green)',
                    animation: 'phosphorPulse 3s ease-in-out infinite',
                  }} />
                  <span className="phosphor-muted" style={{ fontFamily: 'IBM Plex Mono', fontSize: '8px', letterSpacing: '0.18em' }}>
                    DESKMAN · CD+MD · P4↑↑[MAX···]
                  </span>
                </div>
                <span className="phosphor-muted" style={{ fontFamily: 'IBM Plex Mono', fontSize: '8px', opacity: 0.35 }}>
                  CE ⊕ R/O
                </span>
              </div>

              {/* Disc dome */}
              <DiscDome />

              {/* Display panel */}
              <DisplayPanel onSeek={player.seek} />

              {/* Transport */}
              <TransportControls
                onPlay={player.play}
                onPause={player.pause}
                onStop={player.stop}
                onNext={player.next}
                onPrev={player.prev}
                onVolumeChange={player.setVolume}
              />

              {/* EQ */}
              <EQPanel getAnalyser={player.getAnalyser} />

              {/* FX */}
              <FXEngine />

              {/* Cassette */}
              <LyricCassette />

              {/* Disc slots */}
              <DiscCarousel onSlotSelect={handleSlotSelect} />

            </div>
          </div>
        </main>

        <TechSpecsFooter />
      </div>

      {/* Modals */}
      <AddTrackModal onAdd={handleAddTrack} />
      <SettingsModal />
    </div>
  )
}
