let ctx = null

export function getAudioContext() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function resumeAudioContext() {
  if (ctx && ctx.state === 'suspended') ctx.resume()
}
