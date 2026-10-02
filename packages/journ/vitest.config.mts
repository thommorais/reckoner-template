import { defineConfig } from 'vitest/config'

// oxlint-disable-next-line import/no-default-export -- config
export default defineConfig({
	test: {
		environment: 'happy-dom',
		globals: true,
		include: ['src/**/*.test.{ts,tsx}'],
		setupFiles: ['src/test-setup.ts'],
	},
})
