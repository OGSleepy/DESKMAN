import { useCallback } from 'react'
import { usePlayerStore } from '../store/playerStore.js'
import { useYouTubePlayer } from './useYouTubePlayer.js'
import { useDirectAudio } from './useDirectAudio.js'
import { detectSourceType, extractYouTubeId, extractYouTubePlaylistId, isYouTubePlaylist } from '../lib/utils/urlParser.js'

export function usePlayer() {
  const store = usePlayerStore()
  const yt = useYouTubePlayer()
  const direct = useDirectAudio()

  const getCurrentSource = () => store.sourceType

  const loadTrack = useCallback(async (track, slotIndex) => {
    const sourceType = detectSourceType(track.url)

    if (sourceType === 'youtube') {
      const playlistId = isYouTubePlaylist(track.url) ? extractYouTubePlaylistId(track.url) : null
      const videoId = extractYouTubeId(track.url)
      store.setCurrentTrack({ ...track, source: 'youtube' }, slotIndex)
      store.setActiveSlot(slotIndex)
      await yt.loadVideo(videoId, playlistId)
    } else if (sourceType === 'direct') {
      store.setCurrentTrack({ ...track, source: 'direct' }, slotIndex)
      store.setActiveSlot(slotIndex)
      direct.loadAudio(track.url, track)
    }
  }, [yt, direct, store])

  const play = useCallback(() => {
    const src = getCurrentSource()
    if (src === 'youtube') yt.play()
    else if (src === 'direct') direct.play()
    store.setPlaying(true)
  }, [yt, direct, store])

  const pause = useCallback(() => {
    const src = getCurrentSource()
    if (src === 'youtube') yt.pause()
    else if (src === 'direct') direct.pause()
    store.setPlaying(false)
  }, [yt, direct, store])

  const stop = useCallback(() => {
    const src = getCurrentSource()
    if (src === 'youtube') yt.stop()
    else if (src === 'direct') direct.stop()
    store.setPlaying(false)
    store.setCurrentTime(0)
  }, [yt, direct, store])

  const seek = useCallback((t) => {
    const src = getCurrentSource()
    if (src === 'youtube') yt.seek(t)
    else if (src === 'direct') direct.seek(t)
  }, [yt, direct])

  const setVolume = useCallback((v) => {
    yt.setVolume(v)
    direct.setVolume(v)
    store.setVolume(v)
  }, [yt, direct, store])

  const next = useCallback(() => {
    const src = getCurrentSource()
    if (src === 'youtube') { yt.next(); return }
    const nextIdx = store.nextTrack()
    if (nextIdx != null) {
      const track = store.playlist[nextIdx]
      if (track) loadTrack(track, nextIdx)
    }
  }, [yt, store, loadTrack])

  const prev = useCallback(() => {
    const src = getCurrentSource()
    if (src === 'youtube') { yt.prev(); return }
    const prevIdx = store.prevTrack()
    if (prevIdx != null) {
      const track = store.playlist[prevIdx]
      if (track) loadTrack(track, prevIdx)
    }
  }, [yt, store, loadTrack])

  const togglePlay = useCallback(() => {
    if (store.isPlaying) pause()
    else play()
  }, [store.isPlaying, play, pause])

  return {
    ytContainerId: yt.ytContainerId,
    loadTrack,
    play, pause, stop, seek,
    setVolume, next, prev, togglePlay,
    getAnalyser: direct.getAnalyser,
  }
}
