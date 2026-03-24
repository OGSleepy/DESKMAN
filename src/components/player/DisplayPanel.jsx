import React, { useRef, useCallback } from 'react'
import { usePlayerStore } from '../../store/playerStore.js'
import { formatTime } from '../../lib/utils/timeFormat.js'

export function DisplayPanel({ onSeek }) {
  const { currentTrack, currentTime, duration, isPlaying } = usePlayerStore()
  const trackRef = useRef(null)

  const title = currentTrack?.title || 'NO MEDIA LOADED'
  const artist = currentTrack?.artist || ''
  const source = currentTrack?.source || null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleSeek = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const ratio = Math.max(0, Math.min(1, x / rect.width))
    onSeek?.(ratio * duration)
  }, [duration, onSeek])

  return (
    <div className="display-panel mx-4 mb-3 p-3" style={{ position: 'relative' }}>
      {/* Top row: source + status */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {source && <span className={`source-badge ${source}`}>
            {source === 'youtube' ? 'CD+YT' : source === 'direct' ? 'CD' : source.toUpperCase()}
          </span>}
          <span
            className="phosphor-muted"
            style={{ fontFamily: 'IBM Plex Mono', fontSize: '8px', letterSpacing: '0.15em' }}
          >
            P4↑↑[MAX···]
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="rounded-full transition-all duration-300"
            style={{
              width: 6, height: 6,
              background: isPlaying ? 'var(--green)' : 'var(--border)',
              boxShadow: isPlaying ? '0 0 6px var(--green)' : 'none',
            }}
          />
          <span className="phosphor-muted" style={{ fontFamily: 'IBM Plex Mono', fontSize: '8px' }}>
            {isPlaying ? 'PLAY' : 'STOP'}
          </span>
        </div>
      </div>

      {/* Track name */}
      <div className="overflow-hidden mb-1" ref={trackRef}>
        <div
          className="dot-matrix truncate"
          style={{ fontSize: '15px', letterSpacing: '0.05em', lineHeight: 1.2 }}
          title={title}
        >
          {title}
        </div>
      </div>

      {/* Artist */}
      {artist && (
        <div
          className="phosphor-muted truncate mb-2"
          style={{ fontFamily: 'IBM Plex Mono', fontSize: '10px', letterSpacing: '0.08em' }}
        >
          {artist}
        </div>
      )}

      {/* Progress bar */}
      <div className="mt-2">
        <div
          className="progress-track"
          onMouseDown={handleSeek}
          onTouchStart={handleSeek}
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '9px', color: 'var(--green-muted)' }}>
            {formatTime(currentTime)}
          </span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '9px', color: 'var(--green-muted)' }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  )
}
