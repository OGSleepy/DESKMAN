import { useCallback, useEffect } from 'react'
import { usePlayerStore } from '../store/playerStore.js'

const YT_CONTAINER_ID = 'yt-player-container'

export function useYouTubePlayer() {
  const playerRef = { current: null }
  const { setPlaying, setCurrentTime, setDuration, setCurrentTrack, activeSlotIndex } = usePlayerStore()

  // Store player in module-level so it persists across renders
  if (!window.__deskman_yt) window.__deskman_yt = {}

  const loadYTAPI = useCallback(() => {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) { resolve(window.YT); return }
      if (window.__deskman_yt.loading) {
        window.__deskman_yt.callbacks = window.__deskman_yt.callbacks || []
        window.__deskman_yt.callbacks.push(resolve)
        return
      }
      window.__deskman_yt.loading = true
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
      window.onYouTubeIframeAPIReady = () => {
        resolve(window.YT)
        ;(window.__deskman_yt.callbacks || []).forEach(cb => cb(window.YT))
      }
    })
  }, [])

  const loadVideo = useCallback(async (videoId, playlistId) => {
    const YT = await loadYTAPI()
    const container = document.getElementById(YT_CONTAINER_ID)
    if (!container) return

    if (window.__deskman_yt.player) {
      try { window.__deskman_yt.player.destroy() } catch {}
    }

    window.__deskman_yt.player = new YT.Player(container, {
      height: '1',
      width: '1',
      videoId: playlistId ? undefined : videoId,
      playerVars: {
        autoplay: 1,
        playsinline: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        rel: 0,
        origin: window.location.origin,
        ...(playlistId ? { listType: 'playlist', list: playlistId } : {}),
      },
      events: {
        onReady: (e) => {
          e.target.playVideo()
          setDuration(e.target.getDuration() || 0)
        },
        onStateChange: (e) => {
          const YTS = window.YT.PlayerState
          if (e.data === YTS.PLAYING) {
            setPlaying(true)
            setDuration(e.target.getDuration() || 0)
            const data = e.target.getVideoData()
            setCurrentTrack({
              title: data.title || 'Unknown',
              artist: data.author || '',
              album: '',
              source: 'youtube',
              videoId: data.video_id,
              artUrl: data.video_id ? `https://img.youtube.com/vi/${data.video_id}/mqdefault.jpg` : '',
            }, usePlayerStore.getState().activeSlotIndex)
          } else if (e.data === YTS.PAUSED) {
            setPlaying(false)
          } else if (e.data === YTS.ENDED) {
            setPlaying(false)
          }
        },
        onError: (e) => {
          console.warn('YT player error:', e.data)
        },
      },
    })
  }, [loadYTAPI, setPlaying, setDuration, setCurrentTrack])

  // Poll current time
  useEffect(() => {
    const interval = setInterval(() => {
      const p = window.__deskman_yt?.player
      if (p && typeof p.getCurrentTime === 'function') {
        try {
          const t = p.getCurrentTime()
          if (!isNaN(t)) setCurrentTime(t)
          const d = p.getDuration()
          if (!isNaN(d) && d > 0) setDuration(d)
        } catch {}
      }
    }, 500)
    return () => clearInterval(interval)
  }, [setCurrentTime, setDuration])

  const play = () => { try { window.__deskman_yt?.player?.playVideo() } catch {} }
  const pause = () => { try { window.__deskman_yt?.player?.pauseVideo() } catch {} }
  const stop = () => { try { window.__deskman_yt?.player?.stopVideo(); setPlaying(false) } catch {} }
  const seek = (t) => { try { window.__deskman_yt?.player?.seekTo(t, true) } catch {} }
  const setVolume = (v) => { try { window.__deskman_yt?.player?.setVolume(v * 100) } catch {} }
  const next = () => { try { window.__deskman_yt?.player?.nextVideo() } catch {} }
  const prev = () => { try { window.__deskman_yt?.player?.previousVideo() } catch {} }

  return { ytContainerId: YT_CONTAINER_ID, loadVideo, play, pause, stop, seek, setVolume, next, prev }
}
