import React from 'react'
import { usePlayerStore } from '../../store/playerStore.js'

const FX_ITEMS = [
  { key: 'reverb',   label: 'REVERB',    sub: '[ ] Reverb' },
  { key: 'delay',    label: 'DELAY',     sub: '[ ] Delay' },
  { key: 'tapeStop', label: 'TAPE STOP', sub: '[ ] Tape Stop' },
  { key: 'loop',     label: 'LOOP',      sub: '[ ] Loop' },
]

export function FXEngine() {
  const { fx, toggleFX, sourceType } = usePlayerStore()
  const canUse = sourceType === 'direct'

  return (
    <div className="mx-4 mb-3">
      <div className="section-label">FX ENGINE</div>
      <div className="flex gap-2">
        {FX_ITEMS.map(({ key, label, sub }) => (
          <button
            key={key}
            className={`fx-btn ${fx[key] ? 'active' : ''}`}
            onClick={() => toggleFX(key)}
            title={canUse ? label : `${label} (direct audio only)`}
          >
            <div className="fx-dot" />
            <span style={{ fontSize: '8px', letterSpacing: '0.08em' }}>{label}</span>
            {!canUse && fx[key] && (
              <span style={{ fontSize: '6px', color: 'var(--green-muted)', opacity: 0.6 }}>SIM</span>
            )}
          </button>
        ))}
      </div>
      {!canUse && (
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '8px', color: 'var(--green-muted)', opacity: 0.5, marginTop: 4 }}>
          ∗ FUNCTIONAL FX REQUIRES DIRECT AUDIO SOURCE
        </div>
      )}
    </div>
  )
}
