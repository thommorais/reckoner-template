import { defineConfig } from '@vite-pwa/assets-generator/config'

// Run `pnpm generate-pwa-assets` after changing the source SVG.
// oxlint-disable-next-line import/no-default-export -- assets generator config
export default defineConfig({
	headLinkOptions: { preset: '2023' },
	preset: {
		transparent: {
			sizes: [64, 192, 512],
			favicons: [[48, 'favicon.ico']],
		},
		maskable: {
			sizes: [512],
			padding: 0,
		},
		apple: {
			sizes: [180],
			padding: 0,
		},
	},
	images: ['public/icons/icon.svg'],
})
