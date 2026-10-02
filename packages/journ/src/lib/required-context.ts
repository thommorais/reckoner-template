import { createContext, use } from 'react'

/**
 * A context that parts must be rendered inside of. The hook throws a clear error
 * naming the owner, so a part used on its own fails loudly instead of rendering wrong.
 */
const createRequiredContext = <T>(owner: string) => {
	const Context = createContext<T | null>(null)

	const useRequired = (): T => {
		const value = use(Context)
		if (value === null) throw new Error(`Must be rendered inside ${owner}`)
		return value
	}

	return [Context, useRequired] as const
}

export { createRequiredContext }
