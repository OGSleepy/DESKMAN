import { DEFAULT_RELAYS } from '../../constants/relays.js'
import { storage } from '../utils/storage.js'

export function getRelays() {
  return storage.get('relays', DEFAULT_RELAYS)
}

export function setRelays(relays) {
  storage.set('relays', relays)
}
