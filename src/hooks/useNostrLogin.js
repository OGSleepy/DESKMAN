import { useCallback } from 'react'
import { usePlayerStore } from '../store/playerStore.js'
import { getNip07Pubkey, hasNip07 } from '../lib/nostr/signer.js'
import { getRelays } from '../lib/nostr/relayPool.js'

export function useNostrLogin() {
  const { nostrPubkey, nostrProfile, isNostrLoggedIn, setNostrLogin, setNostrProfile, nostrLogout } = usePlayerStore()

  const login = useCallback(async () => {
    if (!hasNip07()) {
      alert('No Nostr signer found.\n\niOS: Install Nostore\nAndroid: Install Amber\nDesktop: Install Alby or nos2x')
      return false
    }
    try {
      const pubkey = await getNip07Pubkey()
      if (!pubkey) return false
      setNostrLogin(pubkey, null)
      // Fetch profile
      fetchProfile(pubkey, setNostrProfile)
      return true
    } catch (e) {
      console.error('Nostr login failed:', e)
      return false
    }
  }, [setNostrLogin, setNostrProfile])

  const logout = useCallback(() => {
    nostrLogout()
  }, [nostrLogout])

  return { login, logout, pubkey: nostrPubkey, profile: nostrProfile, isLoggedIn: isNostrLoggedIn }
}

async function fetchProfile(pubkey, setNostrProfile) {
  const relays = getRelays()
  for (const relay of relays) {
    try {
      const ws = new WebSocket(relay)
      const subId = Math.random().toString(36).slice(2)
      ws.onopen = () => {
        ws.send(JSON.stringify(['REQ', subId, { kinds: [0], authors: [pubkey], limit: 1 }]))
      }
      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data)
          if (msg[0] === 'EVENT' && msg[2]?.kind === 0) {
            const profile = JSON.parse(msg[2].content)
            setNostrProfile(profile)
            ws.close()
          }
        } catch {}
      }
      ws.onerror = () => ws.close()
      setTimeout(() => { try { ws.close() } catch {} }, 5000)
      break
    } catch {}
  }
}
