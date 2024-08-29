
import React from 'react'
import { Menu } from 'antd'
import type { MenuProps } from 'antd/es/menu'
import styles from './index.module.less'
import { useStore } from '@/store'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useRouteLoaderData } from 'react-router-dom'
import { Menu as IMenu } from '@/types/api'
import * as Icons from '@ant-design/icons'

const SideMenu = () => {
	const navigate = useNavigate()
	const { collapsed, isDark } = useStore(state => ({ collapsed: state.collapsed, isDark: state.isDark }))
	const [selectedKeys, setSelectedKeys] = useState<string[]>([])
	type MenuItem = Required<MenuProps>['items'][number]
	const [menuList, setMenuList] = useState<MenuItem[]>([])
	const { pathname } = useLocation()

	/*
	useRouteLoaderData hook函数 使得渲染该菜单组件时，访问通过路由加载的异步数据
	在路由中，通过 loader 函数加载的数据会在 该组件中通过 useRouteLoaderData 获取
	*/
	const data: any = useRouteLoaderData('layout')


	function getItem(
		label: React.ReactNode,
		key?: React.Key | null,
		icon?: React.ReactNode,
		children?: MenuItem[]
	): MenuItem {
		return {
			label,
			key,
			icon,
			children
		} as MenuItem
	}
	function createIcon(name?: string) {
		if(!name) return <></>
		const customerIcons: { [key: string]: any } = Icons
		const icon = customerIcons[name]
		if (!icon) return <></>
		return React.createElement(icon)

	}
	// 递归生成菜单
	const getTreeMenu = (menuList: IMenu.MenuItem[], treeList: MenuItem[] = []) => {
		menuList.forEach((item, index) => {
			// 如果类型是菜单， 并且是启用状态
			if (item.menuType === 1 && item.menuState === 1) {
				// 如果该菜单没有子菜单 或者 他有按钮， 说明他不需要在去 递归 他的 children 子菜单数组了
				if (!item?.children?.length || item.buttons)
					return treeList.push(getItem(item.menuName, item.path || index, createIcon(item.icon)))
				// 否则就递归处理它的子菜单数组
				treeList.push(
					getItem(item.menuName, item.path || index, createIcon(item.icon), getTreeMenu(item.children || []))
				)

			}
		})
		console.log('treeList: ',treeList);
		return treeList
	}
	useEffect(() => {
		const treeMenuList = getTreeMenu(data.menuList)
		setMenuList(treeMenuList)
		setSelectedKeys([pathname])
	},[])

	// 菜单点击
	const handleClickMenu = ({ key }: { key: string }) => {
		setSelectedKeys([key])
		navigate(key)
	}
  // Logo点击
  const handleClickLogo = () => {
    navigate('/welcome')
  }
	return (
		<div className={styles.navSide}>
			<div className={styles.logo} onClick={handleClickLogo}>
				<img src="/imgs/logo.png" className={styles.img} alt="" />
				{collapsed ? '' : <span>货运管理平台</span>}
			</div>
			<Menu

				mode='inline'
				theme={isDark? 'light' : 'dark'}
				style={{
					width: collapsed ? 80 : 'auto',
					height: 'calc(100vh - 50px)'
				}}
				selectedKeys={selectedKeys}
				onClick={handleClickMenu}
				items={menuList} />
		</div>
	)

}

export default SideMenu;
