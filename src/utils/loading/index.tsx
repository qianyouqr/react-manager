import './loading.less'
// 多个请求 仅显示一个loading
// 控制显示loading的个数
let count = 0

export const showLoading = ()=>{
	if(count === 0) {
		const loading = document.getElementById('loading')
		loading?.style.setProperty('display', 'flex')
	}
	count++
}

export const hideLoading = ()=>{
	count--
	if(count === 0) {
		const loading = document.getElementById('loading')
		loading?.style.setProperty('display', 'none')
	}
}
