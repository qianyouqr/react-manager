
// 添加或者删除 模态框组件
import { useState, useImperativeHandle, useEffect } from 'react'
import { Modal, Form, Input, Select, Upload,TreeSelect } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { IAction, IModalProp } from '@/types/modal'
import { Role, Dept } from '@/types/api'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import { message } from '@/utils/AntdGlobal'
import { User } from '@/types/api'
import api from '@/api'
import roleApi from '@/api/roleApi'
const CreateUser = (props: IModalProp) => {

	const [action, setAction] = useState<IAction>('create')
	// 对话框是否可见 状态参数
	const [visible, setVisible] = useState(false)

	const [form] = Form.useForm()
	const [img, setImg] = useState('')
	const [loading, setLoading] = useState(false)
	const [deptList, setDeptList] = useState<Dept.DeptItem[]>([])
	const [roleList, setRoleList] = useState<Role.RoleItem[]>([])
	useEffect(() => {
		getDeptList()
		getRoleList()
	}, [])

	// 获取部门列表
	const getDeptList = async () => {
		const list = await api.getDeptList()

		setDeptList(list)
	}
	// 获取角色列表(不带分页)
	const getRoleList = async () => {
		const list = await roleApi.getAllRoleList()
		console.log('getRoleList:', list);
		setRoleList(list)
	}

	// 暴露子组件open 方法  在组件顶层通过调用 useImperativeHandle 来自定义 ref 暴露出来的句柄
	useImperativeHandle(props.mRef, () => {
		return {
			open
		}
	})

	// 调用对话框显示方法
	const open = (type: IAction, data?: User.UserItem) => {
		// 设置 对话框的行为 状态参数
		setAction(type)
		// 设置对话框的显示状态
		setVisible(true)
		if (type === 'edit' && data) {
			// 对话框作为编辑行为 打开，设置对话框表单的值
			form.setFieldsValue(data)
			// 头像也放上
			setImg(data.userImg)
		}
	}

	// 对话框 提交
	const handleSubmit = async () => {

		const valid = await form.validateFields()
		if (valid) {
			const params = {
				...form.getFieldsValue(),
				userImg: img
			}
			console.log('user-create: ', params);
			// 添加用户
			if (action === 'create') {
				await api.createUser(params)
				message.success('创建成功')
			} else {
				await api.editUser(params)
				message.success('修改成功')
			}
			handleCancel()
			props.update()
		}

	}
	// 关闭对话框
	const handleCancel = () => {
		// 设置 对话框显示状态
		setVisible(false)
		// 设置头像图片数据
		setImg('')
		// 清楚对话框表单数据
		form.resetFields()
	}


	// 头像上传之前，判断图像
	const beforeUpload = (file: RcFile) => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isJpgOrPng) {
			message.error('只能上传png或jpeg格式的图片');
			return false
		}
		const isLt500K = file.size / 1024 / 1024 < 2;
		if (!isLt500K) {
			message.error('图片不能超过500K');
		}
		return isJpgOrPng && isLt500K;
	}
	// 头像上传后，
	const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
		// 图像文件还在上传当中
		if (info.file.status === 'uploading') {
			// 改变状态参数
			setLoading(true)
			return
		}
		if (info.file.status === 'done') {
			setLoading(false)
			const { code, data, msg } = info.file.response
			if (code === 0) {
				console.log(data.file);
				setImg(data.file)
			} else {
				message.error(msg)
			}
		} else if (info.file.status === 'error') {
			message.error('服务器异常，请稍后重试')
		}
	}

	return (
		<Modal
			title={action === 'create' ? '创建用户' : '编辑用户'}
			okText='确定'
			cancelText='取消'
			width={800}
			// 对话框是否可见
			open={visible}
			// 点击确定回调
			onOk={handleSubmit}
			onCancel={handleCancel}
		>
			<Form
				form={form}
				labelCol={{ span: 4 }}
				// 标签文本对齐方式
				labelAlign='right'
			>
				<Form.Item name='userId' hidden>
					<Input />
				</Form.Item>
				<Form.Item name="userName" label="用户名称"
					rules={[
						{ required: true, message: '请输入用户名称' },
						{ min: 5, max: 12, message: '用户名称最小5个字符，最大12个字符' }]}>
					<Input placeholder='请输入用户名称'></Input>
				</Form.Item>
				<Form.Item name="userEmail" label="邮箱"
					rules={[
						{ required: true, message: '请输入用户邮箱' },
						{ type: 'email', message: '请输入正确的邮箱' },
						{
							pattern: /^\w+@163.com$/,
							message: '邮箱必须以@163.com结尾'
						}]}>
					{/* 作为修改对话框时，让用户邮箱不可修改 */}
					<Input placeholder='请输入用户邮箱' disabled={action === 'edit'}></Input>
				</Form.Item>
				<Form.Item
					label='手机号'
					name='mobile'
					rules={[
						{ len: 11, message: '请输入11位手机号' },
						{ pattern: /1[1-9]\d{9}/, message: '请输入1开头的11位手机号' }
					]}
				>
					<Input type='number' placeholder='请输入手机号'></Input>
				</Form.Item>

				<Form.Item
					label='部门'
					name='deptId'
					rules={[
						{
							required: true,
							message: '请选择部门'
						}
					]}
				>
					<TreeSelect
						placeholder='请选择部门'
						allowClear
						treeDefaultExpandAll
						showCheckedStrategy={TreeSelect.SHOW_ALL}
						fieldNames={{ label: 'deptName', value: '_id' }}
						treeData={deptList}
					/>
				</Form.Item>
				<Form.Item label='岗位' name='job'>
					<Input placeholder='请输入岗位'></Input>
				</Form.Item>

				<Form.Item label='状态' name='state'>
					<Select>
						<Select.Option value={1}>在职</Select.Option>
						<Select.Option value={2}>离职</Select.Option>
						<Select.Option value={3}>试用期</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item label='系统角色' name='role'>
					<Select placeholder='请选择角色'>
						{roleList.map(item => {
							return (
								<Select.Option value={item._id} key={item._id}>
									{item.roleName}
								</Select.Option>
							)
						})}
					</Select>
				</Form.Item>
				<Form.Item label='用户头像'>
					<Upload
						// 上传列表的内建样式，支持四种基本样式
						listType='picture-circle'
						showUploadList={false}
						// 上传的地址
						action='/api/users/upload'
						// 上传文件之前的钩子，参数为上传的文件
						beforeUpload={beforeUpload}
						onChange={handleChange}
					>
						{img ? (
							<img src={img} style={{ width: '100%', borderRadius: '100%' }} />
						) : (
							<div>
								{loading ? <LoadingOutlined rev={undefined} /> : <PlusOutlined rev={undefined} />}
								<div style={{ marginTop: 5 }}>上传头像</div>
							</div>
						)}
					</Upload>
				</Form.Item>
			</Form>
		</Modal>
	)
}

export default CreateUser
