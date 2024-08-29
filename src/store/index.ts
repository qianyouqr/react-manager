
// import resso from 'resso'

import { create } from 'zustand'
import {User} from '@/types/api'
import storage from '@/utils/storage'
// const store = resso({
// 	token: '',
// 	userInfo: {
// 		userEmail: '',
// 		userName: ''
// 	},
// 	updateUserInfo(userInfo: UserActivation.UserItem) {
// 		store.userInfo = userInfo
// 	}
// })
// export default store


export const useStore = create<{
	token: string
	userInfo: User.UserItem
	// 侧边栏 折叠状态
	collapsed: boolean
	isDark: boolean
	updateToken: (token: string) => void
	updateUserInfo: (userInfo: User.UserItem) => void
	updateCollapsed: () => void
	updateTheme: (isDark: boolean) => void
}>((set) => ({
	token: '',
	userInfo: {
		_id: '',
    userId: 0,
    userName: '',
    userEmail: '',
    deptId: '',
    state: 0,
    mobile: '',
    job: '',
    role: '',
    roleList: '',
    createId: 0,
    deptName: '',
    userImg: ''
	},
	collapsed: false,
	isDark: storage.get('isDark') || false,
	updateToken: token => set({ token }),
	updateTheme: isDark => set({ isDark }),
	updateUserInfo: (userInfo: User.UserItem) => set({ userInfo }),
	updateCollapsed: ()=> set(state => {
		return {
			collapsed: !state.collapsed
		}
	})
}))

