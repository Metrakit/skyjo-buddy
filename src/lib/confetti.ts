import confetti from '@hiseb/confetti'

export function celebrate() {
  if (typeof window === 'undefined') return

  const w = window.innerWidth
  const h = window.innerHeight

  confetti({ position: { x: w / 2, y: h / 3 }, count: 160, size: 1.2, velocity: 260, fade: true })

  setTimeout(() => {
    confetti({ position: { x: w * 0.15, y: h * 0.85 }, count: 90, size: 1, velocity: 320, fade: true })
    confetti({ position: { x: w * 0.85, y: h * 0.85 }, count: 90, size: 1, velocity: 320, fade: true })
  }, 250)

  setTimeout(() => {
    confetti({ position: { x: w / 2, y: h * 0.5 }, count: 120, size: 1.1, velocity: 240, fade: true })
  }, 600)
}
