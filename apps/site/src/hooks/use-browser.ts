import { useIsomorphicEffect } from '_/hooks/use-isomorphic-effect'
import { useState } from 'react'

type Browser = 'undetermined' | 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'ie' | 'other'

const isChrome = (userAgent: string): boolean => {
	const chromePattern = /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9]+)/i
	return chromePattern.test(userAgent)
}

const isFirefox = (userAgent: string): boolean => {
	const firefoxPattern = /Firefox\/([0-9]+)/i
	return firefoxPattern.test(userAgent)
}

const isSafari = (userAgent: string): boolean => {
	const safariPattern = /^((?!chrome|android).)*safari/i
	return safariPattern.test(userAgent)
}

const isEdge = (userAgent: string): boolean => {
	const edgePattern = /Edge\/([0-9]+)/i
	return edgePattern.test(userAgent)
}

const isOpera = (userAgent: string): boolean => {
	const operaPattern = /(OPR|Opera)\/([0-9]+)/i
	return operaPattern.test(userAgent)
}

const isIE = (userAgent: string): boolean => {
	const iePattern = /MSIE|Trident/i
	return iePattern.test(userAgent)
}

const getBrowser = (): Browser => {
	if (typeof window === 'undefined') {
		return 'undetermined'
	}

	const { userAgent } = window.navigator

	// Order matters here - some browsers include strings from others
	// For example, Chrome includes Safari in its UA string
	if (isEdge(userAgent)) {
		return 'edge'
	}

	if (isChrome(userAgent)) {
		return 'chrome'
	}

	if (isFirefox(userAgent)) {
		return 'firefox'
	}

	if (isSafari(userAgent)) {
		return 'safari'
	}

	if (isOpera(userAgent)) {
		return 'opera'
	}

	if (isIE(userAgent)) {
		return 'ie'
	}

	return 'other'
}

interface UseBrowserOptions {
	getValueInEffect: boolean
}

const useBrowser = (options: UseBrowserOptions = { getValueInEffect: true }): Browser => {
	const [value, setValue] = useState<Browser>(options.getValueInEffect ? 'undetermined' : getBrowser())

	useIsomorphicEffect(() => {
		if (options.getValueInEffect) {
			setValue(getBrowser())
		}
	}, [])

	return value
}

const getBrowserVersion = (): string | null => {
	if (typeof window === 'undefined') {
		return null
	}

	const { userAgent } = window.navigator

	// Extract version numbers using regex
	const match = userAgent.match(/(chrome|firefox|safari|opera|edge|msie|trident(?=\/))\/?\s*(\d+)/i)

	if (!match) {
		return null
	}

	return match[2] || null
}

export { useBrowser, getBrowserVersion }

export type { Browser }
