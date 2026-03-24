import { useEffect, useRef, useCallback } from 'react'
import { usePlayerStore } from '../store/playerStore.js'
import { getAudioContext } from '../lib/audio/audioContext.js'

export function useDirectAudio() {
  const audioRef = useRef(null)
  const sourceRef = useRef(null)
  const analyserRef = useRef(null)
  const gainNodeRef = useRef(null)
  const { setPlaying, setCurrentTime, setDuration, setCurrentTrack, activeSlotIndex, volume } = usePlayerStore()

  const setupAudioGraph = useCallback(() => {
    if (!audioRef.current) return
    const ctx = getAudioContext()
    if (sourceRef.current) return // already connected

    sourceRef.current = ctx.createMediaElementSource(audioRef.current)
    analyserRef.current = ctx.createAnalyser()
    analyserRef.current.fftSize = 256
    gainNodeRef.current = ctx.createGain()
    gainNodeRef.current.gain.value = volume

    sourceRef.current.connect(analyserRef.current)
    analyserRef.current.connect(gainNodeRef.current)
    gainNodeRef.current.connect(ctx.destination)
  }, [volume])

  const loadAudio = useCallback((url, track) => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.crossOrigin = 'anonymous'
    }
    audioRef.current.src = url
    audioRef.current.load()

    audioRef.current.onloadedmetadata = () => {
      setDuration(audioRef.current.duration)
      setCurrentTrack({ ...track, source: 'direct' }, activeSlotIndex)
      setupAudioGraph()
      audioRef.current.play().catch(console.warn)
    }
    audioRef.current.ontimeupdate = () => setCurrentTime(audioRef.current.currentTime)
    audioRef.current.onplay = () => setPlaying(true)
    audioRef.current.onpause = () => setPlaying(false)
    audioRef.current.onended = () => setPlaying(false)
  }, [setupAudioGraph, setDuration, setCurrentTrack, setCurrentTime, setPlaying, activeSlotIndex])

  useEffect(() => {
    if (gainNodeRef.current) gainNodeRef.current.gain.value = volume
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const play = () => audioRef.current?.play()
  const pause = () => audioRef.current?.pause()
  const stop = () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0 } }
  const seek = (t) => { if (audioRef.current) audioRef.current.currentTime = t }
  const setVol = (v) => { if (gainNodeRef.current) gainNodeRef.current.gain.value = v }
  const getAnalyser = () => analyserRef.current

  return { loadAudio, play, pause, stop, seek, setVolume: setVol, getAnalyser }
}
