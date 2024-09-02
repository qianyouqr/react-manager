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
    //构建后的项目中，所有资源的 URL 都会以 /react-manager/ 开头
    // base: '/usr/share/nginx/html/',
	server: {
    host: '127.0.0.1',
    port: 8190,
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
