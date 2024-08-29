import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vitejs.dev/config/
/**
 *
 * 代理配置：
 * 当请求url= http://localhost:8188/api/users/login
 * 从浏览器上看，请求的是
*/
export default defineConfig({
	server: {
    host: 'localhost',
    port: 8188,
    proxy: {
      '/api': 'http://www.rqaaa.top/lb'
    }
  },
	resolve:{
		alias:{
			'@': path.resolve(__dirname, './src')
		}
	},
  plugins: [react()],
})
