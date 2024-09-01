

import axios, { AxiosError } from 'axios'
import { message } from './AntdGlobal'
// import {showLoading, hideLoading } from './loading'
import storage from './storage'
import env from '@/config'
import { Result } from '@/types/api'
import { showLoading, hideLoading } from './loading'


// 创建实例
const instance = axios.create({
	// 下面的请求拦截器 设置了，多余
	// baseURL: import.meta.env.VITE_BASE_API,
    baseURL: '/lb',
	timeout: 8000,
	timeoutErrorMessage: '请求超时，请稍后',
	withCredentials: true
})

// 请求拦截器
instance.interceptors.request.use(
	config => {
		if (config.showLoading) showLoading()
		const token = storage.get('token')
		// 浏览器发送请求时有 token， 在请求头上加如token
		if (token) {
			config.headers.Authorization = token
		}
		if (env.mock) {
			config.baseURL = env.mockApi
		} else {
			config.baseURL = env.baseApi
		}
		return {
			...config
		}
	},
	(error: AxiosError) => {
		return Promise.reject(error)
	}
)
// 响应拦截器
instance.interceptors.response.use(
	response => {
		const data: Result = response.data
		hideLoading()
		if (response.config.responseType === 'blob') return response
		if (data.code === 500001) {
			message.error(data.msg)
			storage.remove('token')
			// 重回 登录页面 之前的页面
			location.href = '/login?callback=' + encodeURIComponent(location.href)
		} else if (data.code != 0) {
			if (response.config.showError === false) {
				return Promise.resolve(data)
			} else {
				message.error(data.msg)
				return Promise.reject(data)
			}
		}
		return data.data
	},
	error => {
		hideLoading()
		message.error(error.message)
		return Promise.reject(error.message)
	}

)
interface IConfig {
	showLoading?: boolean
	showError?: boolean
}
export default {
	get<T>(url: string, params?: object, options: IConfig = { showLoading: true, showError: true }): Promise<T> {
		console.log('url: ', url);
		return instance.get(url, { params, ...options })
	},
	post<T>(url: string, params?: object, options: IConfig = { showLoading: true, showError: true }): Promise<T> {
		console.log('url: ', url);
		return instance.post(url, params, options)
	},
	downloadFile(url: string, data: any, fileName = 'fileName.xlsx') {
		// 使用 axios 发起请求，指定 responseType 为 'blob'
		instance({
			url,
			data,
			method: 'post',
			responseType: 'blob'
		})
			.then(response => {
				// 创建一个 Blob 对象来保存文件数据
				const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

				// 创建一个指向 Blob 的 URL
				const url = window.URL.createObjectURL(blob);

				// 创建一个隐藏的 <a> 标签用于触发下载
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', fileName);  // 设置文件名
				document.body.appendChild(link);
				link.click();  // 模拟点击
				document.body.removeChild(link);  // 点击完成后移除链接

				// 释放 URL 对象
				window.URL.revokeObjectURL(url);
			})
	}
}
