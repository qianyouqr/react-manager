

import { RouterProvider } from 'react-router-dom'
import { ConfigProvider, App as AntdApp, theme } from 'antd'
import router from './router'
import AntdGlobal from './utils/AntdGlobal'
import './App.less'
import './styles/theme.less'
import { useStore } from './store'
function App() {
	const isDark = useStore(state => state.isDark)
	return (
		<ConfigProvider
			theme={{
				token: {
					// Seed Token，影响范围大
					colorPrimary: '#00b96b',
				},
				algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm
			}}>
			<AntdApp>
				<AntdGlobal />
				<RouterProvider router={router} />
			</AntdApp>
		</ConfigProvider>

	)
}

export default App
