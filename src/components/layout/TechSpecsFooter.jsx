import React from 'react'

export function TechSpecsFooter() {
  return (
    <footer className="specs-footer px-4 py-4 mt-2">
      <div className="grid grid-cols-2 gap-x-6 gap-y-1" style={{ fontSize: '8px' }}>
        <div>
          <div className="phosphor-muted mb-1" style={{ fontSize: '8px', letterSpacing: '0.15em' }}>MEDIA CAPACITY</div>
          <div className="opacity-50">3-DISC ACTIVE PLAYBACK (CD / YT / DIRECT)</div>
          <div className="opacity-50">10-DISC INTERNAL RESERVE STORAGE</div>
          <div className="opacity-50">50+ CARTRIDGE SLOTS</div>
          <div className="opacity-50">UP TO 500 HOURS PLAYBACK</div>
        </div>
        <div>
          <div className="phosphor-muted mb-1" style={{ fontSize: '8px', letterSpacing: '0.15em' }}>DISPLAY</div>
          <div className="opacity-50">HIGH-RESOLUTION PANEL</div>
          <div className="opacity-50">16.7 MILLION COLORS</div>
          <div className="opacity-50">120 HZ REFRESH RATE</div>
          <div className="opacity-50">178° WIDE-ANGLE VIEWING</div>
        </div>
        <div className="mt-2">
          <div className="phosphor-muted mb-1" style={{ fontSize: '8px', letterSpacing: '0.15em' }}>FX ENGINE</div>
          <div className="opacity-50">4 DEDICATED EFFECTS: REVERB · DELAY · TAPE STOP · LOOP</div>
          <div className="opacity-50">32-BIT DSP PROCESSOR</div>
          <div className="opacity-50">MAX DELAY: 2000 MS</div>
        </div>
        <div className="mt-2">
          <div className="phosphor-muted mb-1" style={{ fontSize: '8px', letterSpacing: '0.15em' }}>BUILD & DESIGN</div>
          <div className="opacity-50">WEIGHT: 6.8 KG ··········</div>
          <div className="opacity-50">DIMENSIONS: 320 × 240 × 120 MM</div>
          <div className="opacity-50">POWER: AC 100–240V · 50/60 HZ</div>
          <div className="opacity-50">CONSUMPTION: &lt;35 W ·····</div>
        </div>
      </div>
      <div className="mt-3 pt-2 border-t flex items-center justify-between opacity-40" style={{ borderColor: 'var(--border)' }}>
        <span>DESKMAN® · SERSLEEPY · BUILD 1.0.0</span>
        <span>INTERCHANGEABLE LYRIC CASSETTES · 1-IN-3,000 NON-REPEAT CYCLE</span>
      </div>
    </footer>
  )
}
