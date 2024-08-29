
import React from 'react'
import { createBrowserRouter, Navigate} from 'react-router-dom'

import LoginFC from '@/views/login/Login'

import Layout from '@/layout'
import Welcome from '@/views/welcome'
import AuthLoader from './AuthLoader'
import Error403 from '@/views/403'
import Error404 from '@/views/404'
import { lazyLoad } from './LazyLoad'
export const router = [
	{
		path: '/',
		element: <Navigate to='/welcome'/>
	},
	{
		path:'/login',
		element: <LoginFC />
	},
	{
		id: 'layout',
		element: <Layout />,
		loader: AuthLoader,
		children: [
			//子路由
			{
				path: '/welcome',
				element: <Welcome />
			},
			{
				path: '/dashboard',
				element: lazyLoad(React.lazy(()=> import('@/views/dashboard'))),
				// 不需要 权限验证
				meta: {
					auth: false
				}
			},
			{
				path: '/userList',
				element: lazyLoad(React.lazy(()=> import('@/views/system/user'))),
			},
			{
				path: '/deptList',
				element: lazyLoad(React.lazy(()=> import('@/views/system/dept'))),
			},
			{
				path: '/menuList',
				element: lazyLoad(React.lazy(()=> import('@/views/system/menu'))),
			},
			{
				path: '/roleList',
				element: lazyLoad(React.lazy(()=> import('@/views/system/role'))),
			},
			{
				path: '/orderList',
				element:lazyLoad(React.lazy(()=> import('@/views/order/OrderList'))),
			},
			{
				path: '/driverList',
				element: lazyLoad(React.lazy(() => import('@/views/order/DriverList')))
			},
		]
	},
	{
    path: '*',
    element: <Navigate to='/404' />
  },
  {
    path: '/404',
    element: <Error404 />
  },
  {
    path: '/403',
    element: <Error403 />
  }
]

export default createBrowserRouter(router)
