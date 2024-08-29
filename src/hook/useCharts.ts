import * as echarts from 'echarts'
import { RefObject, useEffect, useRef, useState } from 'react'

/**
 * 自定义hook，封装 echarts 实例化
 * */
export const useCharts = ():[RefObject<HTMLDivElement>, echarts.EChartsType | undefined]=>{
	const chartRef = useRef<HTMLDivElement>(null)
	const [chartInstance, setChartInstance] = useState<echarts.ECharts>()
	// 保证页面渲染完成后 执行
	useEffect(()=>{
		// 通过 useRef 获取dom对象
		const chart = echarts.init(chartRef.current as HTMLElement)
		setChartInstance(chart)
	}, [])
	return [chartRef, chartInstance]
}
