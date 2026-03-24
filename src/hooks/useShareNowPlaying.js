import { useCallback } from 'react'
import { usePlayerStore } from '../store/playerStore.js'
import { signEvent } from '../lib/nostr/signer.js'
import { getRelays } from '../lib/nostr/relayPool.js'

export function useShareNowPlaying() {
  const { currentTrack, isNostrLoggedIn, nostrPubkey } = usePlayerStore()

  const share = useCallback(async () => {
    if (!isNostrLoggedIn || !currentTrack) return false
    try {
      const content = `🎛️ Now playing: ${currentTrack.title}${currentTrack.artist ? ' — ' + currentTrack.artist : ''} on DESKMAN® #music #nowplaying`
      const event = {
        kind: 1,
        pubkey: nostrPubkey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['t', 'music'], ['t', 'nowplaying']],
        content,
      }
      const signed = await signEvent(event)
      const relays = getRelays()
      for (const relay of relays) {
        try {
          const ws = new WebSocket(relay)
          ws.onopen = () => {
            ws.send(JSON.stringify(['EVENT', signed]))
            setTimeout(() => ws.close(), 2000)
          }
          ws.onerror = () => ws.close()
        } catch {}
      }
      return true
    } catch (e) {
      console.error('Share failed:', e)
      return false
    }
  }, [currentTrack, isNostrLoggedIn, nostrPubkey])

  return { share }
}
