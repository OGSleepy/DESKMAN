import React, { useCallback } from 'react'
import Particles from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

export function ParticleField() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <Particles
      id="deskman-particles"
      init={particlesInit}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      options={{
        background: { color: { value: 'transparent' } },
        fpsLimit: 30,
        particles: {
          number: { value: 35, density: { enable: true, area: 800 } },
          color: { value: '#00ffb3' },
          opacity: { value: { min: 0.05, max: 0.25 }, animation: { enable: true, speed: 0.5, minimumValue: 0.03 } },
          size: { value: { min: 0.5, max: 1.5 } },
          move: { enable: true, speed: 0.2, direction: 'none', outModes: { default: 'out' } },
          links: { enable: false },
        },
        detectRetina: true,
        interactivity: { events: { onHover: { enable: false }, onClick: { enable: false } } },
      }}
    />
  )
}
