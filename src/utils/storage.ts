/**
 * LocalStorage  封装
 *
*/
export default {
	/**
	 * storage存储, 封装的好处是本来  LocalStorage 不能存储对象，现在value可以传入对象了
	 * @param key {string} 参数名称
	 * @param value {any} 写入值
	 */
	set(key: string, value: any) {
		localStorage.setItem(key, JSON.stringify(value))
	},
	/**
	 * storage读取
	 * @param key {string} 参数名称
	 * @returns storage值
	 */
	get(key: string) {
		const value = localStorage.getItem(key)
		if (!value) return ''
		try {
			return JSON.parse(value)
		} catch {
			return value
		}
	},
	/**
 * 删除localStorage值
 * @param key {string} 参数名称
 */
	remove(key: string) {
		localStorage.removeItem(key)
	},
	/**
	 * 清空localStorage值
	 */
	clear() {
		localStorage.clear()
	}
}
