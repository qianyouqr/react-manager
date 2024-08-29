import React, { useEffect } from 'react';
import { Layout, Watermark } from 'antd';

const { Sider } = Layout;

import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter';
import SideMenu from '@/components/Menu'
import { Navigate, Outlet, useLocation, useRouteLoaderData } from 'react-router-dom';

import styles from './index.module.less'
import { useStore } from '@/store';
import api from '@/api';
import { IAuthLoader } from '@/router/AuthLoader';
import { router } from '@/router'
import { searchRoute } from '@/utils'
import TabsFC from '@/components/Tabs';

const App: React.FC = () => {
	const { collapsed, userInfo, updateUserInfo } = useStore()
	// 获取当前页面的路径
	const { pathname } = useLocation()
	useEffect(() => {
		getUserInfo()
	}, [])
	const getUserInfo = async () => {
		const data = await api.getUserInfo()
		console.log('getUserInfo: ', data);
		updateUserInfo(data)
	}
	const data = useRouteLoaderData('layout') as IAuthLoader
	const route = searchRoute(pathname, router)
	if (route && route.meta?.auth === false) {
		//继续执行
	} else {
		// 不需要判断权限的 页面
		const staticPath = ['/welcome', '/403', '/404']
		if (!data.menuPathList.includes(pathname) && !staticPath.includes(pathname)) {
			return <Navigate to="/403"></Navigate>
		}
	}

	return (
		<Watermark content='rqaaa'>
			{userInfo._id? (
				<Layout>
				<Sider collapsed={collapsed}>
					<SideMenu />
				</Sider>
				<Layout>
					<NavHeader />
					<TabsFC />
					<div className={styles.content}>
						<div className={styles.wrapper}>
							<Outlet></Outlet>
						</div>
						<NavFooter />
					</div>

				</Layout>
			</Layout>
			) : null}
		</Watermark >
	)
}

export default App;
