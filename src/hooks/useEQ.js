import { useEffect, useRef, useCallback } from 'react'

export function useEQ(getAnalyser, isPlaying) {
  const frameRef = useRef(null)
  const barsRef = useRef(new Array(8).fill(0))

  const getBarHeights = useCallback(() => {
    const analyser = getAnalyser?.()
    if (!analyser || !isPlaying) {
      // Gentle idle animation when not playing
      return barsRef.current.map(() => Math.random() * 8 + 2)
    }
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyser.getByteFrequencyData(dataArray)

    // Map 8 bands across frequency spectrum
    const bands = 8
    const sliceWidth = Math.floor(bufferLength / bands)
    return Array.from({ length: bands }, (_, i) => {
      const start = i * sliceWidth
      const slice = dataArray.slice(start, start + sliceWidth)
      const avg = slice.reduce((a, b) => a + b, 0) / slice.length
      return Math.max(2, (avg / 255) * 48)
    })
  }, [getAnalyser, isPlaying])

  return { getBarHeights }
}

// Simulated EQ for YouTube/SoundCloud (no raw PCM access)
export function useSimulatedEQ(isPlaying) {
  const heightsRef = useRef(new Array(8).fill(4))
  const targetsRef = useRef(new Array(8).fill(4))

  const getBarHeights = useCallback(() => {
    if (!isPlaying) return heightsRef.current.map(() => 3)
    targetsRef.current = targetsRef.current.map(() => Math.random() * 40 + 4)
    heightsRef.current = heightsRef.current.map((h, i) =>
      h + (targetsRef.current[i] - h) * 0.3
    )
    return heightsRef.current
  }, [isPlaying])

  return { getBarHeights }
}
