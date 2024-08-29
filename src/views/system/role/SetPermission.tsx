import { Menu, Role } from '@/types/api'
import { IAction, IModalProp } from '@/types/modal'
import { Modal, Form, Tree } from 'antd'
import { useEffect, useImperativeHandle, useState } from 'react'
import api from '@/api/index'
import roleAPi from '@/api/roleApi'
import { message } from '@/utils/AntdGlobal'
export default function SetPermission(props: IModalProp<Role.RoleItem>) {
  const [visible, setVisible] = useState(false)
  const [menuList, setMenuList] = useState<Menu.MenuItem[]>([])
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [roleInfo, setRoleInfo] = useState<Role.RoleItem>()
  const [permission, setPermission] = useState<Role.Permission>()

  useEffect(() => {
    getMenuList()
  }, [])

  const getMenuList = async () => {
    const menuList = await api.getMenuList()
    setMenuList(menuList)
		console.log('menuList: ', menuList);
  }

  // 暴露组件方法
  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })
  const open = (type: IAction, data?: Role.RoleItem) => {
    setVisible(true)
    setRoleInfo(data)
		console.log('data:',data);
    setCheckedKeys(data?.permissionList.checkedKeys || [])
		console.log('checkedKeys: ', checkedKeys)
  }

  const onCheck = (checkedKeysValue: any, item: any) => {
    setCheckedKeys(checkedKeysValue)

    const checkedKeys: string[] = []
    const parentKeys: string[] = []
    item.checkedNodes.map((node: Menu.MenuItem) => {
      if (node.menuType === 2) {
        checkedKeys.push(node._id)
      } else {
        parentKeys.push(node._id)
      }
    })
    setPermission({
      _id: roleInfo?._id || '',
      permissionList: {
        checkedKeys,
        halfCheckedKeys: parentKeys.concat(item.halfCheckedKeys)
      }
    })
  }

  const handleOk = async () => {
    if (permission) {
      await roleAPi.updatePermission(permission)
      message.success('权限设置成功')
      handleCancel()
      props.update()
    }
  }

  // 取消
  const handleCancel = () => {
    setVisible(false)
    setPermission(undefined)
  }

  return (
    <Modal
      title='设置权限'
      width={600}
      open={visible}
      okText='确定'
      cancelText='取消'
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form labelAlign='right' labelCol={{ span: 4 }}>
        <Form.Item label='角色名称'>{roleInfo?.roleName}</Form.Item>
        <Form.Item label='权限'>
          <Tree
					// 节点前添加 Checkbox 复选框
            checkable
						// 默认展开所有树节点
            defaultExpandAll
						// 自定义节点 title、key、children 的字段
            fieldNames={{
              title: 'menuName',
              key: '_id',
              children: 'children'
            }}
						// 点击复选框触发
            onCheck={onCheck}
            checkedKeys={checkedKeys}
						// treeNodes 数据，如果设置则不需要手动构造 TreeNode 节点（key 在整个树范围内唯一）
            treeData={menuList}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
