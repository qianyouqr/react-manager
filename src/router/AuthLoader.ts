

import api from '@/api'
import { Menu } from '@/types/api'
import { getMenuPath } from '@/utils'

export interface IAuthLoader {
  buttonList: string[]
  menuList: Menu.MenuItem[]
  menuPathList: string[]
}
export default async function IAuthLoader(){
	const data = await api.getPermissionList()
	console.log('IAuthLoader-data:',data)
	const menuPathList = getMenuPath(data.menuList)
	return {
		buttonList: data.buttonList,
		menuList: data.menuList,
		menuPathList
	}
}
