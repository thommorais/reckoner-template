/**
 * Wait for a given number of milliseconds and then resolve.
 *
 * @param ms the number of milliseconds to wait
 */
const wait = async (ms: number) => {
	return new Promise(resolve => setTimeout(resolve, ms))
}

export { wait }
