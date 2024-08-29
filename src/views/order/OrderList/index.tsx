
import { Form, Table, Button, Input, Select, Space, Modal } from 'antd'
import { useRef } from 'react'
import { useAntdTable } from 'ahooks'
import { ColumnsType } from 'antd/es/table'
import { Order } from '@/types/api'
import { formatDate, formatMoney } from '@/utils'
import api from '@/api/orderApi'
import CreateOrder from './components/CreateOrder'
import OrderDetail from './components/OrderDetail'
import { message } from '@/utils/AntdGlobal'
import OrderMarker from './components/OrderMarker'
import OrderRoute from './components/OrderRoute'
import AuthButton from '@/components/AuthButton'
import SearchForm from '@/components/SearchForm'
export default function OrderList() {
	const [form] = Form.useForm()
	const orderRef = useRef<{ open: () => void }>()
	const detailRef = useRef<{ open: (orderId: string) => void }>()
	const markerRef = useRef<{ open: (orderId: string) => void }>()
	const routeRef = useRef<{ open: (orderId: string) => void }>()
	const getTableData = ({ current, pageSize }: { current: number; pageSize: number }, formData: Order.SearchParams) => {
		return api
			.getOrderList({
				...formData,
				pageNum: current,
				pageSize: pageSize
			})
			.then(data => {
				console.log('data-orderlist:', data);
				return {
					total: data.page.total,
					list: data.list
				}
			})
	}

	const { tableProps, search } = useAntdTable(getTableData, {
		form,
		defaultParams: [{ current: 1, pageSize: 10 }, { state: 1 }]
	})

	// 添加订单
	const handleCreate = () => {
		orderRef.current?.open()
	}
	// 订单详情
	const handleDetail = (orderId: string) => {
		detailRef.current?.open(orderId)
	}
	// 地图打点
	const handleMarker = (orderId: string) => {
		markerRef.current?.open(orderId)
	}

	// 行驶轨迹
	const handleRoute = (orderId: string) => {
		routeRef.current?.open(orderId)
	}
	// 删除确认
	const handleDel = (_id: string) => {
		Modal.confirm({
			title: '确认',
			content: <span>确认删除订单吗？</span>,
			onOk: async () => {
				await api.delOrder(_id)
				message.success('删除成功')
				// 删除成功后重新查询订单列表
				search.submit()
			}
		})
	}
	// 文件导出
	const handleExport = () => {
		api.exportData(form.getFieldsValue())
	}
	const columns: ColumnsType<Order.OrderItem> = [
		{
			title: '订单编号',
			dataIndex: 'orderId',
			key: 'orderId'
		},
		{
			title: '城市',
			dataIndex: 'cityName',
			key: 'cityName',
			width: 80
		},
		{
			title: '下单地址',
			dataIndex: 'startAddress',
			key: 'startAddress',
			width: 160,
			render(_, record) {
				return (
					<div>
						<p>开始地址：{record.startAddress}</p>
						<p>结束地址：{record.endAddress}</p>
					</div>
				)
			}
		},
		{
			title: '下单时间',
			dataIndex: 'createTime',
			key: 'createTime',
			width: 120,
			render(createTime) {
				return formatDate(createTime)
			}
		},
		{
			title: '订单价格',
			dataIndex: 'orderAmount',
			key: 'orderAmount',
			render(orderAmount) {
				return formatMoney(orderAmount)
			}
		},
		{
			title: '订单状态',
			dataIndex: 'state',
			key: 'state',
			render(state) {
				if (state === 1) return '进行中'
				if (state === 2) return '已完成'
				if (state === 3) return '超时'
				if (state === 4) return '取消'
			}
		},
		{
			title: '用户名称',
			dataIndex: 'userName',
			key: 'userName'
		},
		{
			title: '司机名称',
			dataIndex: 'driverName',
			key: 'driverName'
		},
		{
			title: '操作',
			key: 'action',
			render(_, record) {
				return (
					<Space>
						<AuthButton auth='order@detail' type='text' onClick={() => handleDetail(record.orderId)}>详情</AuthButton>
						<AuthButton auth='order@point' type='text' onClick={() => handleMarker(record.orderId)}>打点</AuthButton>
						<AuthButton auth='order@route' type='text' onClick={() => handleRoute(record.orderId)}>轨迹</AuthButton>
						<AuthButton auth='order@delete' type='text' danger onClick={() => handleDel(record._id)}>删除</AuthButton>

						{/* <Button type='text' onClick={() => handleDetail(record.orderId)}>
							详情
						</Button>
						<Button type='text' onClick={() => handleMarker(record.orderId)}>
							打点
						</Button>
						<Button type='text' onClick={() => handleRoute(record.orderId)}>
							轨迹
						</Button>
						<Button type='text' danger onClick={() => handleDel(record._id)}>
							删除
						</Button> */}
					</Space>
				)
			}
		}
	]
	return (
		<div className='OrderList'>
			<SearchForm form={form} initialValues={{ state: 0 }} submit={search.submit} reset={search.reset}>
				<Form.Item name='orderId' label='订单ID'>
					<Input placeholder='请输入用户ID' />
				</Form.Item>
				<Form.Item name='userName' label='用户名称'>
					<Input placeholder='请输入用户名称' />
				</Form.Item>
				<Form.Item label='订单状态' name='state'>
					<Select style={{ width: 120 }}>
						<Select.Option value={0}>全部</Select.Option>
						<Select.Option value={1}>进行中</Select.Option>
						<Select.Option value={2}>已完成</Select.Option>
						<Select.Option value={3}>超时</Select.Option>
						<Select.Option value={4}>取消</Select.Option>
					</Select>
				</Form.Item>
			</SearchForm>
			<div className='base-table'>
				<div className='header-wrapper'>
					<div className='title'>用户列表</div>
					<div className='action'>
						<AuthButton auth='order@create' type='primary' onClick={handleCreate}>新增</AuthButton>

						{/* <Button type='primary' onClick={handleCreate}>
							新增
						</Button> */}
						<Button type='primary' onClick={handleExport}>
							导出
						</Button>
					</div>
				</div>
				<Table bordered rowKey='_id' columns={columns} {...tableProps} />
			</div>
			{/* 创建订单组件 */}
			<CreateOrder mRef={orderRef} update={search.submit} />
			{/* 订单详情 */}
			<OrderDetail mRef={detailRef} />
			{/* 地图打点 */}
			<OrderMarker mRef={markerRef} />
			{/* 行驶轨迹 */}
			<OrderRoute mRef={routeRef} />
		</div>
	)
}
