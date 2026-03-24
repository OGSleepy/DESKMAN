import React, { useEffect, useRef, useState } from 'react'
import { usePlayerStore } from '../../store/playerStore.js'
import { EQ_BANDS } from '../../constants/eqBands.js'
import { useSimulatedEQ } from '../../hooks/useEQ.js'

export function EQPanel({ getAnalyser }) {
  const { isPlaying, sourceType } = usePlayerStore()
  const [heights, setHeights] = useState(new Array(8).fill(4))
  const frameRef = useRef(null)
  const { getBarHeights: getSimulated } = useSimulatedEQ(isPlaying)

  useEffect(() => {
    const animate = () => {
      let newHeights
      const analyser = getAnalyser?.()

      if (analyser && sourceType === 'direct' && isPlaying) {
        // Real audio data
        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyser.getByteFrequencyData(dataArray)
        const sliceWidth = Math.floor(bufferLength / 8)
        newHeights = Array.from({ length: 8 }, (_, i) => {
          const start = i * sliceWidth
          const slice = dataArray.slice(start, start + sliceWidth)
          const avg = slice.reduce((a, b) => a + b, 0) / slice.length
          return Math.max(2, (avg / 255) * 48)
        })
      } else {
        // Simulated
        newHeights = getSimulated()
      }

      setHeights(newHeights)
      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [isPlaying, sourceType, getAnalyser, getSimulated])

  return (
    <div className="mx-4 mb-3">
      <div className="section-label">8-BAND EQ</div>
      <div
        className="display-panel p-3"
        style={{ position: 'relative' }}
      >
        {/* Freq labels */}
        <div className="flex gap-1 mb-1" style={{ paddingLeft: 4 }}>
          {EQ_BANDS.map((band, i) => (
            <div
              key={i}
              className="flex-1 text-center"
              style={{ fontFamily: 'IBM Plex Mono', fontSize: '7px', color: 'var(--green-muted)', letterSpacing: '0.02em' }}
            >
              {band.label}
            </div>
          ))}
        </div>

        {/* EQ bars */}
        <div className="eq-container">
          {heights.map((h, i) => (
            <div
              key={i}
              className="eq-bar"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>

        {/* Gain labels (bottom) */}
        <div
          className="mt-1 text-right"
          style={{ fontFamily: 'IBM Plex Mono', fontSize: '7px', color: 'var(--green-muted)', opacity: 0.5 }}
        >
          8-BAND EQUALIZER · FINE-TUNED FREQUENCY CONTROL
        </div>
      </div>
    </div>
  )
}
