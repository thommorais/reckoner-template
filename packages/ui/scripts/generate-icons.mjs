import path from 'node:path'
import glob from 'fast-glob'
import fs from 'fs-extra'

import { lucideIconList } from '../src/icon/icon-list.mjs'

const cwd = process.cwd()
const inputDir = path.join(cwd, './packages/ui', 'node_modules', 'lucide-static', 'icons')
const tempDir = path.join(cwd, 'svg-icons')

const copyIcons = async () => {
	fs.ensureDirSync(tempDir)

	const svgIcons = glob.sync('**/*.svg', {
		cwd: inputDir,
	})

	for (const icon of svgIcons) {
		if (lucideIconList.has(icon.replace('.svg', ''))) {
			const destinationFile = path.join(tempDir, icon)
			const file = path.join(inputDir, icon)
			try {
				fs.copyFileSync(file, destinationFile)
				console.log(`Copied icon: ${icon}`)
			} catch (err) {
				console.log(`Error copying file: ${icon}`, err)
			}
		}
	}
}

const removeTempDir = async () => {
	await fs.remove(tempDir)
}

export { copyIcons, removeTempDir }
