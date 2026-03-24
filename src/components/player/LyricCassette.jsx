import React, { useEffect, useState } from 'react'
import { usePlayerStore } from '../../store/playerStore.js'

export function LyricCassette() {
  const { currentTrack, isPlaying } = usePlayerStore()
  const [text, setText] = useState('INSERT MEDIA TO BEGIN PLAYBACK · DESKMAN® · SERSLEEPY · CD+MD · P4↑↑[MAX]')

  useEffect(() => {
    if (currentTrack?.title) {
      setText(`${currentTrack.title}${currentTrack.artist ? ' · ' + currentTrack.artist : ''} · NOW PLAYING ON DESKMAN® · `)
    }
  }, [currentTrack])

  return (
    <div className="mx-4 mb-3">
      <div className="section-label">LYRIC CASSETTE</div>
      <div className="cassette-panel" style={{ height: 44, position: 'relative' }}>
        {/* CRT scanline on cassette too */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)',
            pointerEvents: 'none', zIndex: 5,
          }}
        />

        {/* Reels */}
        <div className="absolute flex items-center" style={{ left: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 3 }}>
          <div
            className="cassette-reel"
            style={{ animation: isPlaying ? 'discSpin 1.2s linear infinite' : 'none' }}
          />
        </div>
        <div className="absolute flex items-center" style={{ right: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 3 }}>
          <div
            className="cassette-reel"
            style={{ animation: isPlaying ? 'discSpin 1.8s linear infinite reverse' : 'none' }}
          />
        </div>

        {/* Scrolling text */}
        <div
          className="absolute inset-0 flex items-center overflow-hidden"
          style={{ padding: '0 32px', zIndex: 2 }}
        >
          <div
            className={isPlaying ? 'cassette-scrolling' : ''}
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
              fontFamily: 'VT323, monospace',
              fontSize: '16px',
              color: 'var(--green)',
              textShadow: '0 0 4px var(--green)',
              letterSpacing: '0.08em',
            }}
          >
            {/* Duplicate for seamless loop */}
            {text}{text}
          </div>
        </div>
      </div>
    </div>
  )
}
