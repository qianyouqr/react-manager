/**
 * 环境配置封装
 */
// 对应 开发、测试、生产环境下
type ENV = 'dev' | 'stg' | 'prd'
// 如果打包时，如果<html lang="en">  没有设置 data-env属性，默认时stg
const env = (document.documentElement.dataset.env as ENV) || 'stg'

const config = {
	dev: {
		baseApi: '/api',
		uploadApi: 'http://www.rqaaa.top',
		cdn: 'http://xxx.aliyun.com',
		mock: false,
    mockApi: 'https://www.fastmock.site/mock/9ccae4db1aa96b02e4bfd71975773247/api'
	},
	stg: {
    baseApi: '/api',
    uploadApi: 'http://api-driver-stg.marsview.cc',
    cdn: 'http://xxx.aliyun.com',
    mock: false,
    mockApi: 'https://www.fastmock.site/mock/9ccae4db1aa96b02e4bfd71975773247/api'
  },
  prd: {
    baseApi: '/api',
    uploadApi: 'http://api-driver.marsview.cc',
    cdn: 'http://xxx.aliyun.com',
    mock: false,
    mockApi: 'https://www.fastmock.site/mock/9ccae4db1aa96b02e4bfd71975773247/api'
  }
}

export default {
	env,
	// 设定项目工程模式
	...config['dev']
}
