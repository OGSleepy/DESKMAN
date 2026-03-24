export async function getNip07Pubkey() {
  if (typeof window === 'undefined' || !window.nostr) return null
  try {
    return await window.nostr.getPublicKey()
  } catch (e) {
    console.warn('NIP-07 error:', e)
    return null
  }
}

export async function signEvent(event) {
  if (!window.nostr) throw new Error('No NIP-07 signer found')
  return await window.nostr.signEvent(event)
}

export const hasNip07 = () => typeof window !== 'undefined' && !!window.nostr
export const hasWebLN = () => typeof window !== 'undefined' && !!window.webln
