


import { useRef, useState } from 'react'
import { Button, Form, Input, Select, Space, Table, Modal, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { User } from '@/types/api';
import { formatDate } from '@/utils';
import { IAction } from '@/types/modal'
import { useAntdTable } from 'ahooks';
import api from '@/api'
import CreateUser from './CreateUser';
import AuthButton from '@/components/AuthButton';
import SearchForm from '@/components/SearchForm'
export default function UserList() {


	const [form] = Form.useForm()
	const [userIds, setUserIds] = useState<number[]>([])
	const userRef = useRef<{
		open: (type: IAction, data?: User.UserItem) => void
	}>()
// search.submit
	const getTableData = (
		{ current, pageSize }: { current: number; pageSize: number },
		formData: User.SearchParams
	) => {
		return api.getUserList({
			...formData,
			pageNum: current,
			pageSize: pageSize
		})
			.then(data => {
				return {
					total: data.page.total,
					list: data.list
				}
			})
	}
	// ahooks:useAntdTable 接收 form 实例后，会返回 search 对象，用来处理表单相关事件
	const { tableProps, search } = useAntdTable(getTableData, {
		form,
		defaultPageSize: 10
	})


	// 编辑用户
	const handleEdit = (record: User.UserItem) => {
		userRef.current?.open('edit', record)
	}
	// 删除用户
	const handleDel = (userId: number) => {
		Modal.confirm({
			title: '删除确认',
			content: <span>确认删除该用户吗?</span>,
			onOk: () => {
				handleUserDelSubmit([userId])
			}
		})
	}
	// 批量删除用户
	const handlePatchConfirm = () => {
		if (userIds.length === 0) {
			message.error('请选择要删除的用户')
			return
		}
		Modal.confirm({
			title: '删除确认',
			content: <span>确认删除该批用户吗？</span>,
			onOk: () => {
				handleUserDelSubmit(userIds)
			}
		})
	}
	//单个删除和多个删除的统一接口

	const handleUserDelSubmit = async (ids: number[]) => {
		try {
			await api.delUser({
				userIds: ids
			})
			message.success('删除成功')
			setUserIds([])
			search.reset()
		} catch (error) {

		}
	}


	// 表格列名
	const columns: ColumnsType<User.UserItem> = [
		{
			title: '用户ID',
			dataIndex: 'userId',
			key: 'userId'
		},
		{
			title: '用户名称',
			dataIndex: 'userName',
			key: 'userName'
		},
		{
			title: '用户邮箱',
			dataIndex: 'userEmail',
			key: 'userEmail'
		},
		{
			title: '用户角色',
			dataIndex: 'role',
			key: 'role',
			// 数字和对应值的映射
			render(role: string) {
				return {
					"mdnZLuEF88U": '超级管理员',
					"w5FhTq20NWc": '管理员',
					"MMlhJwgzGTa": '体验管理员',
					"cDMWTTafblb": '游客'
				}[role]
			}
		},
		{
			title: '用户状态',
			dataIndex: 'state',
			key: 'state',
			render(state: number) {
				return {
					1: '在职',
					2: '离职',
					3: '试用期'
				}[state]
			}
		},
		{
			title: '注册时间',
			dataIndex: 'createTime',
			key: 'createTime',
			render(createTime: string) {
				return formatDate(createTime)
			}
		},
		{
			title: '最后登录时间',
			dataIndex: 'lastLoginTime',
			key: 'lastLoginTime'
		},
		{
			title: '操作',
			key: 'userId',
			render(record: User.UserItem) {
				return (
					<Space>
						<Button type='text' onClick={() => handleEdit(record)}>编辑</Button>
						<AuthButton auth='user@delete' type='text' danger onClick={() => handleDel(record.userId)}>删除</AuthButton>
						{/* <Button type='text' danger onClick={() => handleDel(record.userId)}>删除</Button> */}
					</Space>
				)
			}
		},
	]

	// 创建用户（新增用户）
	const handleCreate = () => {
		userRef.current?.open('create')
	}
	return (
		<div className='user-list'>
			<SearchForm form={form} initialValues={{ state: 0 }} submit={search.submit} reset={search.reset}>
				<Form.Item label="用户ID" name="userId">
					<Input placeholder='请输入用户ID' />
				</Form.Item>
				<Form.Item label="用户名称" name='userName'>
					<Input placeholder="请输入用户名称" />
				</Form.Item>
				<Form.Item label="状态" name='state'>
					<Select style={{width:120}}>
						<Select.Option value={0}>所有</Select.Option>
						<Select.Option value={1}>在职</Select.Option>
						<Select.Option value={2}>试用期</Select.Option>
						<Select.Option value={3}>离职</Select.Option>
					</Select>
				</Form.Item>
			</SearchForm>
			<div className='base-table'>
				<div className='header-wrapper'>
					<div className='title'>用户列表</div>
					<div className='action'>
						<AuthButton auth='user@create' type='primary' onClick={handleCreate}>新增</AuthButton>
						<AuthButton auth='user@delete' type='primary' danger onClick={handlePatchConfirm}>批量删除</AuthButton>
						{/* <Button type='primary' onClick={handleCreate}>新增</Button>
						<Button type='primary' danger onClick={handlePatchConfirm}>批量删除</Button> */}
					</div>
				</div>
				<Table
					bordered
					rowKey='userId'
					rowSelection={{
						type: 'checkbox',
						selectedRowKeys: userIds,
						onChange: (selectedRowKeys: React.Key[]) => {
							setUserIds(selectedRowKeys as number[])
						}
					}}
					columns={columns}
					{...tableProps}
				>
				</Table>
			</div>
			{/* 添加、修改模态框 */}
			<CreateUser
				mRef={userRef}
				update={() => {
					search.reset()
				}}
			/>
		</div>
	)
}
