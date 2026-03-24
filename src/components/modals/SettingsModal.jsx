import React, { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore.js'
import { getRelays, setRelays } from '../../lib/nostr/relayPool.js'

export function SettingsModal() {
  const { settingsOpen, closeSettings, theme, setTheme } = usePlayerStore()
  const [relays, setLocalRelays] = useState(getRelays)
  const [newRelay, setNewRelay] = useState('')

  if (!settingsOpen) return null

  const handleSaveRelays = () => {
    setRelays(relays)
  }

  const addRelay = () => {
    if (newRelay.trim() && !relays.includes(newRelay.trim())) {
      const updated = [...relays, newRelay.trim()]
      setLocalRelays(updated)
      setRelays(updated)
      setNewRelay('')
    }
  }

  const removeRelay = (r) => {
    const updated = relays.filter(x => x !== r)
    setLocalRelays(updated)
    setRelays(updated)
  }

  const THEMES = [
    { id: 'teal', label: 'TEAL', color: '#00ffb3' },
    { id: 'void', label: 'VOID', color: '#004d3b' },
    { id: 'amber', label: 'AMBER', color: '#ffb300' },
  ]

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeSettings() }}>
      <div className="modal-sheet modal-animate" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="phosphor" style={{ fontFamily: 'VT323, monospace', fontSize: '22px', letterSpacing: '0.1em' }}>
              SETTINGS
            </div>
            <div className="phosphor-muted" style={{ fontFamily: 'IBM Plex Mono', fontSize: '9px', letterSpacing: '0.1em' }}>
              DESKMAN® CONFIGURATION
            </div>
          </div>
          <button className="transport-btn" onClick={closeSettings} style={{ width: 36, height: 36 }}>
            <X size={14} />
          </button>
        </div>

        {/* Theme */}
        <div className="mb-5">
          <div className="section-label">DISPLAY THEME</div>
          <div className="flex gap-2">
            {THEMES.map(t => (
              <button
                key={t.id}
                className={`transport-btn flex-1 ${theme === t.id ? 'active' : ''}`}
                style={{
                  height: 40, fontSize: '10px',
                  borderColor: theme === t.id ? t.color : undefined,
                  color: theme === t.id ? t.color : undefined,
                }}
                onClick={() => setTheme(t.id)}
              >
                <div className="flex flex-col items-center gap-1">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, boxShadow: `0 0 6px ${t.color}` }} />
                  <span>{t.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Nostr Relays */}
        <div className="mb-4">
          <div className="section-label">NOSTR RELAYS</div>
          <div className="flex flex-col gap-1 mb-2">
            {relays.map(r => (
              <div key={r} className="flex items-center justify-between display-panel px-3 py-2">
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '10px', color: 'var(--green-muted)' }}>
                  {r.replace('wss://', '')}
                </span>
                <button onClick={() => removeRelay(r)} style={{ color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="neon-input"
              placeholder="wss://relay.example.com"
              value={newRelay}
              onChange={(e) => setNewRelay(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addRelay()}
              style={{ flex: 1, fontSize: '11px' }}
            />
            <button className="transport-btn" onClick={addRelay} style={{ width: 44, height: 44 }}>
              <Plus size={14} />
            </button>
          </div>
        </div>

        <button
          className="transport-btn w-full active"
          style={{ height: 44, fontSize: '12px', letterSpacing: '0.1em', marginTop: 8 }}
          onClick={closeSettings}
        >
          CLOSE
        </button>
      </div>
    </div>
  )
}
