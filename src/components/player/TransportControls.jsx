import React, { useState } from 'react'
import { SkipBack, SkipForward, Square, Volume1, Volume2 } from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore.js'
import { useShareNowPlaying } from '../../hooks/useShareNowPlaying.js'

export function TransportControls({ onPlay, onPause, onStop, onNext, onPrev, onVolumeChange }) {
  const { isPlaying, volume, isNostrLoggedIn, currentTrack } = usePlayerStore()
  const { share } = useShareNowPlaying()
  const [shareFlash, setShareFlash] = useState(false)

  const handleShare = async () => {
    const ok = await share()
    if (ok) {
      setShareFlash(true)
      setTimeout(() => setShareFlash(false), 1200)
    }
  }

  const handleVol = (delta) => {
    const newVol = Math.max(0, Math.min(1, volume + delta))
    onVolumeChange?.(newVol)
  }

  return (
    <div className="px-4 mb-3">
      {/* Volume row */}
      <div className="flex items-center justify-between mb-3">
        <span className="section-label mb-0">TRANSPORT</span>
        <div className="flex items-center gap-2">
          <Volume1 size={10} color="var(--green-muted)" />
          <button
            className="transport-btn"
            style={{ minWidth: 32, height: 28, fontSize: '11px' }}
            onClick={() => handleVol(-0.1)}
          >
            −
          </button>
          <div
            className="flex items-center rounded overflow-hidden"
            style={{ width: 60, height: 4, background: 'rgba(0,255,179,0.1)', borderRadius: 2 }}
          >
            <div
              style={{
                height: '100%',
                width: `${volume * 100}%`,
                background: 'linear-gradient(90deg, var(--green-muted), var(--green))',
                borderRadius: 2,
                transition: 'width 0.1s',
                boxShadow: '0 0 6px rgba(0,255,179,0.4)',
              }}
            />
          </div>
          <button
            className="transport-btn"
            style={{ minWidth: 32, height: 28, fontSize: '11px' }}
            onClick={() => handleVol(0.1)}
          >
            +
          </button>
          <Volume2 size={10} color="var(--green-muted)" />
        </div>
      </div>

      {/* Main transport row */}
      <div className="flex items-center justify-center gap-3">
        {/* Prev */}
        <button className="transport-btn" onClick={onPrev} aria-label="Previous">
          <SkipBack size={16} />
        </button>

        {/* Play/Pause — large */}
        <button
          className="play-btn-large"
          onClick={isPlaying ? onPause : onPlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            // Pause icon
            <div className="flex gap-1">
              <div style={{ width: 3, height: 16, background: 'var(--green)', borderRadius: 1 }} />
              <div style={{ width: 3, height: 16, background: 'var(--green)', borderRadius: 1 }} />
            </div>
          ) : (
            // Play icon
            <div style={{
              width: 0, height: 0,
              borderTop: '9px solid transparent',
              borderBottom: '9px solid transparent',
              borderLeft: '15px solid var(--green)',
              marginLeft: 3,
            }} />
          )}
        </button>

        {/* Stop — red */}
        <button className="transport-btn stop-btn" onClick={onStop} aria-label="Stop">
          <Square size={14} fill="var(--red)" />
        </button>

        {/* Next */}
        <button className="transport-btn" onClick={onNext} aria-label="Next">
          <SkipForward size={16} />
        </button>

        {/* Share to Nostr */}
        {isNostrLoggedIn && currentTrack && (
          <button
            className={`transport-btn ${shareFlash ? 'active' : ''}`}
            onClick={handleShare}
            aria-label="Share to Nostr"
            style={{ borderColor: shareFlash ? '#a855f7' : undefined, color: shareFlash ? '#a855f7' : undefined, fontSize: '14px' }}
          >
            📡
          </button>
        )}
      </div>
    </div>
  )
}
