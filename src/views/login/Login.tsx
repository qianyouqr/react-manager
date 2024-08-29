

import {useState} from 'react'
// import request from '@/utils/request'
import { Button, Form, Input, message } from 'antd'
// import './index.less'
import styles from './index.module.less'
import { Login } from '@/types/api'
import api from '@/api/index'
import storage from '@/utils/storage'
export default function LoginFC() {
	const [loading, setLoading] = useState(false)
	// 登录按钮点击
	const onFinish = async (values: Login.params)=> {
		console.log(values);

		// const updateToken = useStore(state=>state => state.updateToken)
		setLoading(true)
		const data = await api.login(values)
		setLoading(false)
		//登录成功 ，data就是token， 返回的是data.data
		storage.set('token', data)
		message.success('登录成功')
		const params = new URLSearchParams(location.search)
		location.href = params.get('callback') || '/welcome'
	}
	return (
		<div className={styles.login}>
			<div className={styles.loginWrapper}>
				<div className={styles.title}>系统登录</div>
				<Form
					name="basic"
					initialValues={{ remember: true, username:"admin0", password:"123456" }}
					onFinish={onFinish}
					autoComplete="off"

				>
					<Form.Item
						name="username"
						rules={[{ required: true, message: 'Please input your username!' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name="password"
						rules={[{ required: true, message: 'Please input your password!' }]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item >
						<Button type="primary" htmlType="submit" block loading={loading}>
							登录
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	)
}
