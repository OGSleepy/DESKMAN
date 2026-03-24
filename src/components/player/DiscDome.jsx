import React, { useEffect, useRef } from 'react'
import { usePlayerStore } from '../../store/playerStore.js'

export function DiscDome() {
  const { isPlaying, currentTrack } = usePlayerStore()
  const spinnerRef = useRef(null)
  const angleRef = useRef(0)
  const lastTimeRef = useRef(null)
  const frameRef = useRef(null)
  const speedRef = useRef(0)
  const targetSpeedRef = useRef(0)

  useEffect(() => {
    targetSpeedRef.current = isPlaying ? 0.8 : 0 // degrees per ms
  }, [isPlaying])

  useEffect(() => {
    const animate = (time) => {
      if (lastTimeRef.current !== null) {
        const delta = time - lastTimeRef.current
        // Smooth speed interpolation (spin up / spin down)
        speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.04
        angleRef.current = (angleRef.current + speedRef.current * delta) % 360
        if (spinnerRef.current) {
          spinnerRef.current.style.transform = `rotate(${angleRef.current}deg)`
        }
      }
      lastTimeRef.current = time
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  const title = currentTrack?.title || 'NO DISC'
  const artist = currentTrack?.artist || 'INSERT MEDIA'

  return (
    <div className="disc-dome-wrapper px-4 py-6">
      <div
        className="disc-dome relative"
        style={{ width: 'min(72vw, 300px)', height: 'min(72vw, 300px)' }}
      >
        {/* Grooves */}
        <div className="disc-grooves" />

        {/* Spinning layer */}
        <div
          ref={spinnerRef}
          className="absolute inset-0 rounded-full"
          style={{ willChange: 'transform' }}
        >
          {/* Spiral arm line */}
          <div
            className="absolute"
            style={{
              top: '50%', left: '50%',
              width: '42%', height: '1px',
              background: 'linear-gradient(90deg, rgba(0,255,179,0.15), transparent)',
              transformOrigin: '0 0',
            }}
          />
        </div>

        {/* Center label — doesn't spin */}
        <div
          className="absolute rounded-full flex flex-col items-center justify-center text-center"
          style={{
            inset: '22%',
            background: 'radial-gradient(circle, #0a2018 0%, #061410 100%)',
            border: '1px solid rgba(0,255,179,0.12)',
            zIndex: 2,
            padding: '8px',
          }}
        >
          {/* Center dot */}
          <div
            className="absolute rounded-full"
            style={{ width: 8, height: 8, background: 'var(--green)', boxShadow: '0 0 8px var(--green)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 3 }}
          />

          {/* Track info — dot matrix style */}
          <div style={{ position: 'absolute', bottom: '18%', left: 0, right: 0, padding: '0 6px' }}>
            <div className="dot-matrix truncate" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
              {title.slice(0, 18)}
            </div>
            <div className="phosphor-muted truncate" style={{ fontFamily: 'IBM Plex Mono', fontSize: '8px', marginTop: 2 }}>
              {artist.slice(0, 16)}
            </div>
          </div>
        </div>

        {/* Dome cap glass reflection */}
        <div className="disc-dome-cap" />

        {/* Outer ring glow when playing */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-700"
          style={{
            boxShadow: isPlaying
              ? '0 0 30px rgba(0,255,179,0.12), inset 0 0 20px rgba(0,255,179,0.04)'
              : 'none',
          }}
        />

        {/* Source badge */}
        {currentTrack && (
          <div
            className="absolute"
            style={{ bottom: -12, right: 8 }}
          >
            <span className={`source-badge ${currentTrack.source || 'direct'}`}>
              {currentTrack.source === 'youtube' ? 'YT' : currentTrack.source === 'direct' ? 'CD' : (currentTrack.source || 'CD').toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
