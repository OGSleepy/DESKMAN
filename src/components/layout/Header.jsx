import React from 'react'
import { Settings } from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore.js'
import { useNostrLogin } from '../../hooks/useNostrLogin.js'

export function Header() {
  const { openSettings } = usePlayerStore()
  const { login, logout, isLoggedIn, profile, pubkey } = useNostrLogin()
  const shortPubkey = pubkey ? pubkey.slice(0, 8) + '…' : ''
  const displayName = profile?.name || profile?.display_name || shortPubkey

  return (
    <header className="header-bar">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="phosphor leading-none" style={{ fontFamily: 'VT323, monospace', fontSize: '28px', letterSpacing: '0.05em' }}>
            DESKMAN<span style={{ fontSize: '14px', opacity: 0.7 }}>®</span>
          </span>
          <span className="phosphor-muted" style={{ fontFamily: 'IBM Plex Mono', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            SerSleepy · CD+MD · P4
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isLoggedIn ? (
          <button onClick={logout} className="transport-btn px-3" style={{ fontSize: '10px', minWidth: 'auto', borderColor: 'rgba(168,85,247,0.4)', color: '#a855f7' }}>
            <span className="mr-1">⚡</span>
            <span className="hidden sm:inline">{displayName}</span>
            <span className="sm:hidden">NOSTR</span>
          </button>
        ) : (
          <button onClick={login} className="transport-btn px-3" style={{ fontSize: '10px', minWidth: 'auto', borderColor: 'rgba(168,85,247,0.35)', color: '#a855f7' }}>
            NOSTR LOGIN
          </button>
        )}
        <button onClick={openSettings} className="transport-btn" style={{ width: '44px', height: '44px' }} aria-label="Settings">
          <Settings size={14} />
        </button>
      </div>
    </header>
  )
}
