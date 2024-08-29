
/**
 * 接口类型定义
 *
*/
export interface Result<T = any> {
	code: number
	data: T
	msg: string
}
// 带分页 数据请求响应结果
export interface ResultData<T=any>{
	list: T[]
	page: {
		pageNum: number
		pageSize: number
		total: number | 0
	}
}
// 分页请求参数
export interface PageParams {
	pageNum: number
	pageSize?: number
}

export namespace Login {
	export interface params {
		userName: string
		userPwd: string
	}
}

// 用户信息
export namespace User {
	export interface UserItem {
		_id: string
		userId: number
    userName: string
    userEmail: string
    deptId: string
    state: number
    mobile: string
    job: string
    role: string
    roleList: string
    createId: number
    deptName: string
    userImg: string
	}
	// 请求 用户列表 数据
	export interface Params extends PageParams {
		useId?: number
		userName?: string
		state?: number
	}
	// 用户查询 请求参数
	export interface SearchParams {
		userId?: number
		userName?: string
		state?: number
	}
	// 添加用户post请求 参数
	export interface CreateParams {
		userName: string
		userEmail: string
		mobile?:	number
		deptId: string
		job?: string
		state?: number
		role?: string
		userImg: string
	}
	// 用户编辑 请求参数
	export interface EditParams extends CreateParams {
		userId: number
	}
}

// 工作台统计数据
export namespace Dashboard {
	export interface ReportData {
		driverCount: number
    totalMoney: number
    orderCount: number
    cityNum: number
	}
	// 折线图数据模型
	export interface LineData {
		label: string[]
		order: number[]
		money: number[]
	}
	// 饼图数据模型
	export interface PieData {
		value: number
		name: string
	}
	// 雷达图数据模型
	export interface RadarData {
		indicator: Array<{ name: string; max:number}>
		data: {
			name:string
			value:number
		}
	}
}

// 部门管理
export namespace Dept {
	export interface Params {
		deptName?: string
	}
	// 创建部门 提交参数
	export interface CreateParams {
		// 部门名称
		deptName: string
		// 上级部门的_id
		parentId?: string
		// 负责人
		userName: string
	}
	// 编辑部门 提交参数
	export interface EditParams extends CreateParams {
		_id: string
	}
	// 删除部门提交参数
	export interface DelParams {
		_id: string
	}
	// 部门列表项
	export interface DeptItem {
		// 部门id
		_id: string
		// 创建时间
		createTime: string
		// 更新时间
		updateTime: string
		// 部门名称
		deptName: string
		// 上级部门id
		parentId: string
		// 创建用户名称
		userName: string
		// 子部门
		children: DeptItem[]
	}
}

export namespace Menu {
  export interface Params {
    menuName: string
    menuState: number
  }
  // 菜单创建
  export interface CreateParams {
    menuName: string // 菜单名称
    icon?: string // 菜单图标
    menuType: number // 1: 菜单 2：按钮 3：页面
    menuState: number // 1：正常 2：停用
    menuCode?: string // 按钮权限标识
    parentId?: string // 父级菜单ID
    path?: string // 菜单路径
    component?: string // 组件名称
  }
  export interface MenuItem extends CreateParams {
    _id: string
    createTime: string
    buttons?: MenuItem[]
    children?: MenuItem[]
  }
  export interface EditParams extends CreateParams {
    _id?: string
  }

  export interface DelParams {
    _id: string
  }
}


/*--------角色------*/
export namespace Role {
  export interface Params extends PageParams {
    roleName?: string
  }
  export interface CreateParams {
    roleName: string
    remark?: string
  }
  export interface RoleItem extends CreateParams {
    _id: string
    permissionList: {
      checkedKeys: string[]
      halfCheckedKeys: string[]
    }
    updateTime: string
    createTime: string
  }
  export interface EditParams extends CreateParams {
    _id: string
  }
  export interface Permission {
    _id: string
    permissionList: {
      checkedKeys: string[]
      halfCheckedKeys: string[]
    }
  }
}



/*--------订单------*/
export namespace Order {
	export enum IState {
		doing = 1,
    done = 2,
    timeout = 3,
    cance = 4
	}
	export interface CreateParams {
    cityName: string
    userName: string
    mobile: string
    startAddress: string //下单开始地址
    endAddress: string //下单结束地址
    orderAmount: number //订单金额
    userPayAmount: number //支付金额
    driverAmount: number //支付金额
    // 1: 微信 2：支付宝
    payType: number //支付方式
    driverName: string //司机名称
    vehicleName: string //订单车型
    // 1: 进行中 2：已完成 3：超时 4：取消
    state: IState // 订单状态
    // 用车时间
    useTime: string
    // 订单结束时间
    endTime: string
  }
	export interface OrderItem extends CreateParams {
    _id: string
    orderId: string //订单ID
    route: Array<{ lng: string; lat: string }> //行驶轨迹
    createTime: string //创建时间
    remark: string //备注
  }
	export interface SearchParams {
    orderId?: string
    userName?: string
    state?: IState
  }
	export interface Params extends PageParams {
    orderId?: string
    userName?: string
    state?: IState
  }
	export interface DictItem {
    id: string
    name: string
  }
	export interface OrderRoute {
    orderId: string //订单ID
    route: Array<{ lng: string; lat: string }>
  }
	export interface DriverParams {
    driverName?: string
    accountStatus?: number
  }
	export enum DriverStatus {
    auth = 0, // 待认证
    normal = 1, //正常
    temp = 2, // 暂时拉黑
    always = 3, // 永久拉黑
    stop = 4 //停止推送
  }
  export interface DriverItem {
    driverName: string // 司机名称
    driverId: number // 司机ID
    driverPhone: string // 司机手机号
    cityName: string // 城市名称
    grade: boolean // 会员等级
    driverLevel: number // 司机等级
    accountStatus: DriverStatus // 司机状态
    carNo: string // 车牌号
    vehicleBrand: string // 车辆品牌
    vehicleName: string // 车辆名称
    onlineTime: number // 昨日在线时长
    driverAmount: number // 昨日司机流水
    rating: number // 司机评分
    driverScore: number // 司机行为分
    pushOrderCount: number // 昨日推单数
    orderCompleteCount: number // 昨日完单数
    createTime: string // 创建时间
  }
}
