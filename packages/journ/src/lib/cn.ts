import { tv } from './tv'

const cnClasses = tv({ base: [] })

type ClassValue = string | null | undefined | false | ClassValue[]

/** Joins class names; later Tailwind utilities win over earlier ones in the same group. */
const cn = (...args: ClassValue[]): string => cnClasses({ class: [args] }) ?? ''

export { cn }
export type { ClassValue }
