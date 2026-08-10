/**
 * One source of truth for timing and easing. Components never invent their own
 * durations: if a value is missing here, it gets added here.
 */

export const DUR = {
  fast: 0.4,
  base: 0.7,
  slow: 1.1,
  reveal: 1.3,
} as const

export const EASE = {
  out: 'power3.out', // default for entrances
  inOut: 'power2.inOut', // paired / reversible moves
  expo: 'expo.out', // dramatic reveals, line masks, rules drawing
  soft: 'power1.out', // micro-interactions
  spring: 'elastic.out(1, 0.45)', // magnetic release
} as const

export const STAGGER = {
  tight: 0.045,
  base: 0.09,
  loose: 0.15,
} as const
