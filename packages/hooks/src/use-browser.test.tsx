import { cleanup, renderHook } from '@testing-library/react'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it } from 'vitest'
import { getBrowserVersion, useBrowser } from './use-browser'

const originalUserAgent = navigator.userAgent

const setUserAgent = (value: string) => {
	Object.defineProperty(navigator, 'userAgent', { configurable: true, value })
}

const agents = {
	chrome:
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
	firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
	safari:
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
	edge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582',
	opera:
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 OPR/96.0.0.0',
	ie: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)',
	other: 'SomeCrawler/1.0',
}

afterEach(() => {
	cleanup()
	setUserAgent(originalUserAgent)
})

describe('useBrowser', () => {
	it.each(['chrome', 'firefox', 'safari', 'edge', 'opera', 'ie', 'other'] as const)('detects %s', name => {
		setUserAgent(agents[name])

		const { result } = renderHook(() => useBrowser())

		expect(result.current).toBe(name)
	})

	it('does not detect android chrome as safari', () => {
		setUserAgent(
			'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
		)

		const { result } = renderHook(() => useBrowser())

		expect(result.current).toBe('chrome')
	})

	it('returns undetermined from the server snapshot', () => {
		setUserAgent(agents.chrome)

		const Probe = () => createElement('span', null, useBrowser())

		expect(renderToString(createElement(Probe))).toContain('undetermined')
	})

	it('keeps a stable value across rerenders', () => {
		setUserAgent(agents.firefox)

		const { result, rerender } = renderHook(() => useBrowser())
		rerender()

		expect(result.current).toBe('firefox')
	})
})

describe('getBrowserVersion', () => {
	it('reads the chrome major version', () => {
		setUserAgent(agents.chrome)

		expect(getBrowserVersion()).toBe('120')
	})

	it('reads the firefox major version', () => {
		setUserAgent(agents.firefox)

		expect(getBrowserVersion()).toBe('121')
	})

	it('reads the safari major version', () => {
		setUserAgent(agents.safari)

		expect(getBrowserVersion()).toBe('17')
	})

	it('reads the legacy edge major version', () => {
		setUserAgent(agents.edge)

		expect(getBrowserVersion()).toBe('18')
	})

	it('reads the opera major version', () => {
		setUserAgent(agents.opera)

		expect(getBrowserVersion()).toBe('96')
	})

	it('reads the msie major version', () => {
		setUserAgent(agents.ie)

		expect(getBrowserVersion()).toBe('10')
	})

	it('returns null for an unknown agent', () => {
		setUserAgent(agents.other)

		expect(getBrowserVersion()).toBeNull()
	})
})
