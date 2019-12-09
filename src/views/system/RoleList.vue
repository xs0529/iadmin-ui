<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色名称">
              <a-input v-model="queryParam.roleName" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="角色标识">
              <a-input v-model="queryParam.label" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a-button style="margin-left: 8px" type="link" icon="plus" @click="handleAdd()" v-hasPermission="'SysRole:add'">新建</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)" v-hasPermission="'SysRole:update'">编辑</a>
        <a-divider type="vertical" />
        <a @click="showDrawer(record)" v-hasPermission="'SysRole:update'">授权</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确认删除？" @confirm="removeRole(record)" v-hasPermission="'SysRole:del'">
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </span>
    </s-table>

    <a-modal
      title="操作"
      style="top: 20px;"
      :width="800"
      v-model="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="id"
          v-if="!add"
        >
          <a-input placeholder="id" disabled="disabled" v-decorator="['id']"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色标识"
        >
          <a-input placeholder="请输入角色名称" :disabled="!add" v-decorator="['label', {rules: [{required: true, pattern: /^[a-zA-Z]+$/, message: '请输入角色标识，只能是英文'}]}]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色名称"
        >
          <a-input placeholder="请输入角色名称" v-decorator="['roleName', {rules: [{required: true, min: 2, message: '请输入角色名称，至少2位！'}]}]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色备注"
        >
          <a-input placeholder="请输入角色备注" v-decorator="['comments', {rules: [{required: false, min: 2}]}]"/>
        </a-form-item>

      </a-form>
    </a-modal>

    <a-drawer
      title="授权"
      placement="right"
      :closable="true"
      :width="500"
      @close="closeDrawer"
      :visible="drawerVisible"
    >
      <a-popconfirm title="确认赋予该角色所选授权？" @confirm="setRolePermission()">
        <a v-hasPermission="'SysRole:update'">确认授权</a>
        <a href="javascript:;">授权</a>
      </a-popconfirm>
      <a-tree
        :checkable="true"
        :checkStrictly="true"
        v-model="selectedKeys"
        :treeData="permissionVoTree"
      />
    </a-drawer>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import RoleModal from './modules/RoleModal'
// eslint-disable-next-line no-unused-vars
import { getRoleList, addRole, updateRole, removeRole, getPermissionVo, getPermissionByRoleId } from '@/api/manage'

export default {
  name: 'TableList',
  components: {
    STable,
    RoleModal
  },
  data () {
    return {
      // description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      visible: false,
      drawerVisible: false,
      defaultExpandAll: false,
      add: false,
      form: this.$form.createForm(this),
      mdl: {},
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: 'id',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '角色名称',
          dataIndex: 'roleName'
        },
        {
          title: '备注',
          dataIndex: 'comments',
          customRender: (text) => <title title={text} style="display: inline-block;">{text}</title>
        },
        {
          title: '角色标识',
          dataIndex: 'label'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          customRender: (text) => new Date(text).toLocaleString()
        },
        {
          title: '修改时间',
          dataIndex: 'updateTime',
          sorter: true,
          customRender: (text) => new Date(text).toLocaleString()
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getRoleList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      permissionVoTree: [],
      selectedKeys: []
    }
  },
  created () {
    for (let i = 0, len = this.columns.length; i < len; i++) {
      this.columns[i].align = 'center'
    }
    getPermissionVo().then(res => {
      this.permissionVoTree = res.data
      this.renderTreeNodes(this.permissionVoTree)
    })
  },
  methods: {
    handleEdit (record) {
      this.add = false
      setTimeout(() => {
        this.form.setFieldsValue(record)
      }, 0)
      this.visible = true
    },
    handleAdd () {
      this.add = true
      this.visible = true
    },
    handleOk () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if (this.add) {
            addRole(this.form.getFieldsValue()).then(() => {
              this.visible = false
              this.confirmLoading = false
              this.$message.success('新增成功！', 2)
              this.$refs.table.refresh(true)
              this.form.resetFields()
            }).catch((res) => {
              this.$message.error(res.message, 2)
              this.confirmLoading = false
            })
          } else {
            updateRole(this.form.getFieldsValue()).then(() => {
              this.visible = false
              this.confirmLoading = false
              this.$message.success('修改成功！', 2)
              this.$refs.table.refresh()
              this.form.resetFields()
            }).catch((res) => {
              this.$message.error(res.message, 2)
              this.confirmLoading = false
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // 删除方法
    removeRole (record) {
      removeRole(record.id).then(() => {
        this.$message.success('删除成功！', 2)
        this.$refs.table.refresh()
      }).catch((res) => {
        this.$message.error(res.message, 2)
      })
    },
    // 取消按钮操作
    handleCancel () {
      this.form.resetFields()
      this.confirmLoading = false
      this.visible = false
    },
    showDrawer (record) {
      this.mdl = record
      getPermissionByRoleId(record.id).then(res => {
        if (res.data) {
          for (const value of res.data) {
            this.selectedKeys.push(value.id)
          }
        }
      })
      this.drawerVisible = true
    },
    closeDrawer () {
      this.mdl = {}
      this.selectedKeys = []
      this.drawerVisible = false
    },
    setRolePermission () {
      this.mdl.permissionIdList = this.selectedKeys.checked
      delete this.mdl.createTime
      delete this.mdl.updateTime
      updateRole(this.mdl).then(() => {
        this.$message.success('修改成功！', 2)
      }).catch((res) => {
        this.$message.error(res.message, 2)
      })
    },
    renderTreeNodes (data) {
      data.map(item => {
        item.key = item.id
        item.title = item.name
        if (item.children) {
          this.renderTreeNodes(item.children)
        }
      })
    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>
