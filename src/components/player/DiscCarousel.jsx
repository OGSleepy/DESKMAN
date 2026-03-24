import React from 'react'
import { Plus, Disc } from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore.js'

export function DiscCarousel({ onSlotSelect }) {
  const { playlist, activeSlotIndex, openAddTrack, removeFromPlaylist } = usePlayerStore()

  // Ensure 10 slots always rendered
  const slots = Array.from({ length: 10 }, (_, i) => playlist[i] || null)

  return (
    <div className="mx-4 mb-3">
      <div className="section-label">DISC SLOTS</div>
      <div className="horizontal-scroll">
        {slots.map((track, i) => (
          <div
            key={i}
            className={`disc-slot ${i === activeSlotIndex && track ? 'active' : ''} ${!track ? 'empty' : ''}`}
            onClick={() => {
              if (track) onSlotSelect?.(track, i)
              else openAddTrack(i)
            }}
          >
            {/* Slot number */}
            <span
              style={{
                position: 'absolute', top: 5, left: 7,
                fontFamily: 'IBM Plex Mono', fontSize: '9px',
                color: 'var(--green-muted)',
              }}
            >
              {i + 1}
            </span>

            {track ? (
              <>
                {/* Mini disc */}
                <div
                  className="rounded-full flex items-center justify-center mb-1"
                  style={{
                    width: 36, height: 36,
                    background: 'radial-gradient(circle at 35% 30%, #1a4035, #061810)',
                    border: `1px solid ${i === activeSlotIndex ? 'var(--green)' : 'var(--border)'}`,
                    boxShadow: i === activeSlotIndex ? '0 0 10px rgba(0,255,179,0.3)' : 'none',
                  }}
                >
                  <div
                    className="rounded-full"
                    style={{
                      width: 8, height: 8,
                      background: i === activeSlotIndex ? 'var(--green)' : 'var(--border)',
                      boxShadow: i === activeSlotIndex ? '0 0 4px var(--green)' : 'none',
                    }}
                  />
                </div>

                {/* Title */}
                <div
                  style={{
                    fontFamily: 'IBM Plex Mono', fontSize: '7px',
                    color: i === activeSlotIndex ? 'var(--green)' : 'var(--text-secondary)',
                    textAlign: 'center', padding: '0 4px',
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', maxWidth: '100%',
                    letterSpacing: '0.04em',
                  }}
                  title={track.title}
                >
                  {(track.title || 'TRACK').slice(0, 9)}
                </div>

                {/* Source badge */}
                <span
                  className={`source-badge ${track.source || 'direct'}`}
                  style={{ position: 'absolute', top: 4, right: 4, fontSize: '6px', padding: '1px 3px' }}
                >
                  {track.source === 'youtube' ? 'YT' : 'CD'}
                </span>

                {/* Remove on long press - we use a small x */}
                <button
                  style={{
                    position: 'absolute', bottom: 3, right: 3,
                    width: 14, height: 14, borderRadius: '50%',
                    background: 'rgba(255,59,31,0.2)', border: '1px solid rgba(255,59,31,0.3)',
                    color: 'var(--red)', fontSize: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={(e) => { e.stopPropagation(); removeFromPlaylist(i) }}
                  aria-label="Remove track"
                >
                  ×
                </button>
              </>
            ) : (
              <>
                <Plus size={18} color="var(--green-muted)" style={{ opacity: 0.5 }} />
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '7px', color: 'var(--green-muted)', opacity: 0.5, marginTop: 3 }}>
                  ADD
                </span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
