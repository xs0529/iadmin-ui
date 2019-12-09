<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="权限名称">
              <a-input v-model="queryParam.permissionName" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a-button style="margin-left: 8px" type="link" icon="plus" @click="handleAdd()" v-hasPermission="'SysPermission:add'">新建</a-button>
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
      :showPagination="false"
      :scroll="{ x: '150%'}"
    >
      <span slot="type" slot-scope="text">
        <a-tag :color="text===1 ? 'green' : 'blue'" v-text="text===1 ? '前端菜单' : '后端接口'"></a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)" v-hasPermission="'SysPermission:update'">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确认删除？" @confirm="removeRole(record)">
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
          label="权限名称"
        >
          <a-input placeholder="请输入权限名称" v-decorator="['permissionName', {rules: [{required: true, message: '权限名称不能为空'}]}]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="授权标识"
        >
          <a-input placeholder="请输入授权标识" :disabled="!add" v-decorator="['permissionCode', {rules: [{required: true, message: '授权标识！'}]}]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="父级菜单"
        >
          <a-tree-select
            :treeData="permissionSelectTree"
            placeholder="请选择父级菜单"
            treeDefaultExpandAll
            v-decorator="['pid', {rules: [{required: true, message: '请选择父级菜单'}]}]"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="权限类型"
        >
          <a-radio-group v-decorator="['type', {rules: [{required: true, message: '请选择权限类型'}]}]">
            <a-radio :value="1">前端菜单</a-radio>
            <a-radio :value="2">后端接口</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="url"
        >
          <a-input placeholder="请输入url，新增修改后端接口时填入" v-decorator="['url']"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="请求方式"
        >
          <a-input placeholder="请输入请求方式，新增修改后端接口时填入" v-decorator="['requestWay']"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="组件地址"
        >
          <a-input placeholder="请输入组件地址，新增修改前端菜单时填入" v-decorator="['componentUrl']"/>
        </a-form-item>
        <a-divider />

      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
// eslint-disable-next-line no-unused-vars
import { removeLoginLog, getPermissionListTreeVO, addPermission, updatePermission } from '@/api/manage'

export default {
  name: 'TableList',
  components: {
    STable
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
      time: [],
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
          title: '权限名称',
          dataIndex: 'permissionName'
        },
        {
          title: '授权标识',
          dataIndex: 'permissionCode'
        },
        {
          title: '权限类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: 'url',
          dataIndex: 'url'
        },
        {
          title: '请求方式',
          dataIndex: 'requestWay'
        },
        {
          title: '组件地址',
          dataIndex: 'componentUrl'
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
          scopedSlots: { customRender: 'action' },
          fixed: 'right'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getPermissionListTreeVO(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      permissionSelectTree: [],
      selectedKeys: []
    }
  },
  created () {
    for (let i = 0, len = this.columns.length; i < len; i++) {
      this.columns[i].align = 'center'
    }
    getPermissionListTreeVO({ type: 1 }).then(res => {
      const p = {}
      p.id = 0
      p.permissionName = '顶级菜单'
      p.children = res.data.records
      this.permissionSelectTree = [p]
      this.renderTreeNodes(this.permissionSelectTree)
    })
  },
  methods: {
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    async handleEdit (record) {
      console.log(record.pid)
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
            addPermission(this.form.getFieldsValue()).then(() => {
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
            updatePermission(this.form.getFieldsValue()).then(() => {
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
    // 取消按钮操作
    handleCancel () {
      this.form.resetFields()
      this.confirmLoading = false
      this.visible = false
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // 删除方法
    removeRole (record) {
      removeLoginLog(record.id).then(() => {
        this.$message.success('删除成功！', 2)
        this.$refs.table.refresh()
      }).catch((res) => {
        this.$message.error(res.message, 2)
      })
    },
    renderTreeNodes (data) {
      data.map(item => {
        item.key = item.id
        item.value = item.id
        item.title = item.permissionName
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
