

/**
 * 给axios 模块扩展属性
*/

import axios from 'axios'
declare module 'axios' {
	interface AxiosRequestConfig {
		showLoading?: boolean
		showError?: boolean
	}
}
