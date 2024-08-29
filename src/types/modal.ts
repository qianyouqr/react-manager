
import {MutableRefObject} from 'react'
import {User} from './api'

export type IAction = 'create' | 'edit' | 'delete'

// 对话框
export interface IModalProp<T = User.UserItem> {
	mRef: MutableRefObject<{open: (type: IAction, data: T) => void } | undefined >
	update: () => void

}

export interface IDetailProp {
	mRef: MutableRefObject<{open: (orderId: string) => void} | undefined>
}

