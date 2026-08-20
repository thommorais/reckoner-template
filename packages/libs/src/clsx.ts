import { tv } from './tv'

const clsxClasses = tv({ base: [] })

/**
 * Joins class names, resolving Tailwind conflicts: later classes win over
 * earlier ones in the same group, so `clsx('p-2', 'p-4')` yields `'p-4'`.
 * This is `tailwind-variants` merge behaviour, NOT the plain concatenation
 * the `clsx` package performs.
 */
export const clsx = (...args: (string | undefined)[]): string => clsxClasses({ class: [args] }) ?? ''
