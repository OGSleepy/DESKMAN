import React, { useState } from 'react'
import { X } from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore.js'
import { detectSourceType } from '../../lib/utils/urlParser.js'

export function AddTrackModal({ onAdd }) {
  const { addTrackOpen, addToSlot, closeAddTrack, addToPlaylist } = usePlayerStore()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  if (!addTrackOpen) return null

  const sourceType = url ? detectSourceType(url) : null

  const handleAdd = () => {
    if (!url.trim()) { setError('Please enter a URL'); return }
    if (sourceType === 'unknown') { setError('Unsupported URL. Try YouTube, or a direct .mp3 URL'); return }

    const track = {
      url: url.trim(),
      title: title.trim() || 'Unknown Track',
      artist: '',
      source: sourceType,
    }

    const slotIndex = addToPlaylist(track, addToSlot)
    onAdd?.(track, slotIndex)
    setUrl('')
    setTitle('')
    setError('')
    closeAddTrack()
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') closeAddTrack()
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeAddTrack() }}>
      <div className="modal-sheet modal-animate">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="phosphor" style={{ fontFamily: 'VT323, monospace', fontSize: '22px', letterSpacing: '0.1em' }}>
              ADD MEDIA
            </div>
            <div className="phosphor-muted" style={{ fontFamily: 'IBM Plex Mono', fontSize: '9px', letterSpacing: '0.1em' }}>
              {addToSlot !== null ? `SLOT ${addToSlot + 1}` : 'NEW SLOT'} · INSERT CARTRIDGE
            </div>
          </div>
          <button className="transport-btn" onClick={closeAddTrack} style={{ width: 36, height: 36 }}>
            <X size={14} />
          </button>
        </div>

        {/* URL input */}
        <div className="mb-3">
          <label className="section-label mb-2">SOURCE URL</label>
          <input
            className="neon-input"
            type="url"
            inputMode="url"
            placeholder="youtube.com/watch?v=... or direct .mp3"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError('') }}
            onKeyDown={handleKey}
            autoFocus
          />
          {sourceType && sourceType !== 'unknown' && (
            <div className="mt-1 flex items-center gap-1">
              <span className={`source-badge ${sourceType}`}>{sourceType.toUpperCase()}</span>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '9px', color: 'var(--green-muted)' }}>
                DETECTED
              </span>
            </div>
          )}
          {error && (
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '10px', color: 'var(--red)', marginTop: 4 }}>
              ∗ {error}
            </div>
          )}
        </div>

        {/* Optional title */}
        <div className="mb-4">
          <label className="section-label mb-2">TITLE (OPTIONAL)</label>
          <input
            className="neon-input"
            type="text"
            placeholder="Track title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>

        {/* Supported formats */}
        <div className="mb-4" style={{ fontFamily: 'IBM Plex Mono', fontSize: '8px', color: 'var(--green-muted)', opacity: 0.6, lineHeight: 1.8 }}>
          SUPPORTED: YOUTUBE VIDEO · YOUTUBE PLAYLIST · DIRECT MP3/OGG/FLAC/M4A
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            className="transport-btn flex-1"
            style={{ height: 44, fontSize: '12px', letterSpacing: '0.1em' }}
            onClick={closeAddTrack}
          >
            CANCEL
          </button>
          <button
            className={`transport-btn flex-1 ${url && sourceType !== 'unknown' ? 'active' : ''}`}
            style={{ height: 44, fontSize: '12px', letterSpacing: '0.1em' }}
            onClick={handleAdd}
          >
            LOAD DISC
          </button>
        </div>
      </div>
    </div>
  )
}
