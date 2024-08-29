

import { Switch, Dropdown, MenuProps } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import styles from './index.module.less'
import { useStore } from '@/store'
import storage from '@/utils/storage'
import { useEffect } from 'react'
import BreadCrumb from './BreadCrumb'


const NavHeader = () => {

	const { collapsed, userInfo, updateCollapsed, isDark, updateTheme } = useStore()

  useEffect(() => {
    handleSwitch(isDark)
  }, [])
	const items: MenuProps['items'] = [
		{
			key: 'eamil',
			label: '邮箱：' + userInfo.userEmail
		},
		{
			key: 'logout',
			label: '退出'
		}
	]
	//控制侧边菜单图标的关闭和展开
	const toggleCollapsed = () => {
		updateCollapsed()
	}

	//退出登录  要求：退出登录前是哪个页面，重新登录后 必须进入哪个页面
	const onClick: MenuProps['onClick'] = ({ key })=>{
		// 点击菜单项 传入菜单项的key， 比较key值判断是哪个菜单项
		if(key === 'logout') {
			storage.remove('token')
			location.href = '/login?callback=' + encodeURIComponent(location.href)
		}
	}
	// 主题切换
	const handleSwitch = (isDark: boolean) => {
		if(isDark) {
			document.documentElement.dataset.theme = 'dark'
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.dataset.theme = 'light'
			document.documentElement.classList.remove('dark')
		}
		storage.set('isDark', isDark)
		updateTheme(isDark)
	}
	return (
		<div className={styles.navHeader}>
			<div className={styles.left}>
				<div onClick={toggleCollapsed} style={{ color: "#000", marginRight: '20px' }}>
					{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
				</div>
				<BreadCrumb />
			</div>
			<div className='right'>
				<Switch
					checkedChildren='暗黑'
					unCheckedChildren='默认'
					style={{marginRight: "10"}}
					onClick={handleSwitch}
				/>
				<Dropdown menu={{ items, onClick }} trigger={['click']}>
					<span className={styles.nickName} style={{ marginLeft: '20px' }}>{userInfo.userName}</span>

				</Dropdown>
			</div>
		</div>
	)
}

export default NavHeader
