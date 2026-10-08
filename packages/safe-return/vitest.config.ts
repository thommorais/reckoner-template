import { defineConfig } from 'vitest/config'

const config = defineConfig({
	test: {
		include: ['src/**/*.test.ts'],
		environment: 'node',
	},
})

export default config
