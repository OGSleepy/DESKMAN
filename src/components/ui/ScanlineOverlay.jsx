import React from 'react'

export function ScanlineOverlay() {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 4px)',
      }}
    />
  )
}
