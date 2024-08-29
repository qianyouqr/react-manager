import { useState } from 'react'
import { Descriptions, DescriptionsProps, Card, Button } from 'antd';

import styles from './index.module.less'
import { useEffect } from 'react';
import { useStore } from '@/store';
import { Dashboard } from '@/types/api'
import { formatMoney, formatNum, formatState } from '@/utils';
import api from '@/api'
import { useCharts } from '@/hook/useCharts';
export default function DashBoard() {
	/**
	 * 如果写成： const {userInfo} = useStore()
	 * 也能用，但是useStore 管理的其它状态发生变化时，会导致这个页面刷新
	 *
	*/
	// 用户信息
	const userInfo = useStore(state => state.userInfo)
	// react 的状态管理
	const [report, setReport] = useState<Dashboard.ReportData>()
	useEffect(() => {
		//自定义hook 不用写了
		// const lineChartDom = document.getElementById('lineChart')
		// const chartInstance = echarts.init(lineChartDom as HTMLElement)
		getReportData()
	}, [])
	const getReportData = async () => {
		const data = await api.getReportData()
		setReport(data)
	}

	const items: DescriptionsProps['items'] = [
		{
			key: '1',
			label: '用户ID',
			children: userInfo.userId,
		},
		{
			key: '2',
			label: '邮箱',
			children: userInfo.userEmail,
		},
		{
			key: '3',
			label: '状态',
			children: formatState(userInfo.state),
		},
		{
			key: '4',
			label: '手机号mark',
			children: userInfo.mobile,
		},
		{
			key: '5',
			label: '岗位',
			children: userInfo.job,
		},
		{
			key: '6',
			label: '部门',
			children: userInfo.deptName,
		},
	];

	// 图表
	// 初始化折线图
	const [lineRef, lineChart] = useCharts()
	// 初始化饼图
	const [pieRef1, pieChart1] = useCharts()
	const [pieRef2, pieChart2] = useCharts()
	// // 初始化雷达图
	const [radarRef, radarChart] = useCharts()
	useEffect(() => {
		console.log('获取图表数据');
		renderLineChart()
		renderPieChart1()
		renderPieChart2()
		renderRadarChart()
	}, [lineChart, pieChart1, pieChart2, radarChart])


	//加载折线图数据
	const renderLineChart = async () => {
		// 折线图不存在，不请求数据
		if (!lineChart) return
		const data = await api.getLineData()
		// echarts 图表渲染内容
		lineChart?.setOption({
			// title: {
			//   text: '订单和流水走势图'
			// },
			// 鼠标浮动提示
			tooltip: {
				trigger: 'axis'
			},
			// 图表题注
			legend: {
				data: ['订单', '流水']
			},
			// 调整图表位置, 像素，也可以是百分比
			grid: {
				left: 50,
				right: 50,
				bottom: 20
			},
			// x轴 标签
			xAxis: {
				data: data.label
			},
			// y轴 标签  根据图表数据值 ，自动生成
			yAxis: {
				type: 'value'
			},
			// 图表数据值  折线图：数组中每个对象表示 一条线
			series: [
				{
					name: '订单',
					type: 'line',
					data: data.order
				},
				{
					name: '流水',
					type: 'line',
					data: data.money
				}
			]
		})
	}

	// 加载饼图 数据 司机城市分布
	const renderPieChart1 = async () => {
		if (!pieChart1) return
		const data = await api.getPieCityData()
		console.log('renderPieChart1: data: ', data);
		pieChart1?.setOption({
			title: {
				text: '司机城市分布',
				left: 'center'
			},
			tooltip: {
				trigger: 'item'
			},
			legend: {
				orient: 'vertical',
				left: 'left'
			},
			series: [
				{
					name: '城市分布',
					type: 'pie',
					radius: '50%',
					data
				}
			]
		})
	}

	// 加载饼图 数据 司机年龄分布
	const renderPieChart2 = async () => {
		if (!pieChart2) return
		const data = await api.getPieAgeData()
		console.log('renderPieChart2: data: ', data);

		pieChart2?.setOption({
			title: {
				text: '司机年龄分布',
				left: 'center'
			},
			tooltip: {
				trigger: 'item'
			},
			legend: {
				orient: 'vertical',
				left: 'left'
			},
			series: [
				{
					name: '年龄分布',
					type: 'pie',
					radius: [50, 180],
					roseType: 'area',
					data
				}
			]
		})
	}
	// 加载雷达图 数据
	const renderRadarChart = async () => {
		if (!radarChart) return
		const data = await api.getRadarData()
		radarChart?.setOption({
			tooltip: {},
			legend: {
				data: ['司机模型诊断']
			},
			radar: {
				indicator: data.indicator
			},
			series: [{
				name: '模型诊断aaa',
				type: "radar",
				data: data.data
			}]
		})
	}
	// 刷新饼图 （刷新按钮）
	const handleRefresh = () => {
		renderPieChart1()
		renderPieChart2()
	}

	return (
		<div className={styles.dashboard}>
			<div className={styles.userInfo}>
				<img
					src={userInfo.userImg}
					className={styles.userImg} />
				<Descriptions title={`欢迎 ${userInfo.userName}`} items={items}>

					<Descriptions.Item label='用户ID'>{userInfo.userId}</Descriptions.Item>
					<Descriptions.Item label='邮箱'>{userInfo.userEmail}</Descriptions.Item>
					<Descriptions.Item label='状态'>{formatState(userInfo.state)}</Descriptions.Item>
					<Descriptions.Item label='手机号'>{userInfo.mobile}</Descriptions.Item>
					<Descriptions.Item label='岗位'>{userInfo.job}</Descriptions.Item>
					<Descriptions.Item label='部门'>{userInfo.deptName}</Descriptions.Item>
				</Descriptions>
			</div>
			{/* 工作台-  汇总数据*/}
			<div className={styles.report}>
				<div className={styles.card}>
					<div className='title'>司机数量</div>
					<div className={styles.data}>{formatNum(report?.driverCount)}个</div>
				</div>
				<div className={styles.card}>
					<div className='title'>总流水</div>
					<div className={styles.data}>{formatMoney(report?.totalMoney)}元</div>
				</div>
				<div className={styles.card}>
					<div className='title'>总订单</div>
					<div className={styles.data}>{formatNum(report?.orderCount)}单</div>
				</div>
				<div className={styles.card}>
					<div className='title'>开通城市</div>
					<div className={styles.data}>{formatNum(report?.cityNum)}座</div>
				</div>
			</div>


			{/* 工作台-折线图 */}
			<div className={styles.chart}>
				<Card title='订单和流水走势图' extra={<Button type='primary' onClick={renderLineChart}>刷新</Button>}>
					<div ref={lineRef} className={styles.itemChart}></div>
				</Card>
			</div>

			<div className={styles.chart}>
				<Card title='司机分布' extra={<Button type='primary' onClick={handleRefresh}>刷新</Button>}>
					<div className={styles.pieChart}>
						<div ref={pieRef1} className={styles.itemPie}></div>
						<div ref={pieRef2} className={styles.itemPie}></div>
					</div>
				</Card>
			</div>

			<div className={styles.chart}>
				<Card title='模型诊断' extra={<Button type='primary' onClick={renderRadarChart}>刷新</Button>}>
					<div ref={radarRef} className={styles.itemChart}></div>
				</Card>
			</div>
		</div>
	)
}
