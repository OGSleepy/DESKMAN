export function detectSourceType(url) {
  if (!url) return 'unknown'
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube'
  if (/soundcloud\.com/.test(url)) return 'soundcloud'
  if (/\.(mp3|ogg|flac|m4a|wav)(\?|$)/i.test(url)) return 'direct'
  if (/nostr:|njump\.me|naddr|nevent/.test(url)) return 'nostr'
  return 'unknown'
}

export function extractYouTubeId(url) {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

export function extractYouTubePlaylistId(url) {
  const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

export function isYouTubePlaylist(url) {
  return /[?&]list=/.test(url)
}
