import { vi } from 'vitest'

class ResizeObserverStub {
	observe = vi.fn()
	unobserve = vi.fn()
	disconnect = vi.fn()
}

globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver
window.HTMLElement.prototype.scrollIntoView = vi.fn()
window.HTMLElement.prototype.hasPointerCapture = vi.fn(() => false)
window.HTMLElement.prototype.releasePointerCapture = vi.fn()
