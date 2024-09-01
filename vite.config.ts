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
    // base: '/root/html/react-manager/dist/',  
	server: {
    host: '0.0.0.0',
    port: 8188,
    proxy: {
      '/api': 'http://127.0.0.1/lb'
    }
  },
	resolve:{
		alias:{
			'@': path.resolve(__dirname, './src')
		}
	},
  plugins: [react()],
})
