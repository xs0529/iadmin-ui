<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="用户名">
              <a-input v-model="queryParam.username" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="姓名">
              <a-input v-model="queryParam.trueName" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="昵称">
                <a-input v-model="queryParam.nickName" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状   态">
                <a-select placeholder="请选择" default-value="" v-model="queryParam.state">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">正常</a-select-option>
                  <a-select-option value="0">禁用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select placeholder="请选择" default-value="" v-model="queryParam.sex">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="男">男</a-select-option>
                  <a-select-option value="女">女</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a-button style="margin-left: 8px" type="link" icon="plus" @click="handleAdd()">新建</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      rowKey="id"
      :data="loadData"
      :showPagination="true"
    >
      <span slot="state" slot-scope="text">
        <a-tag :color="text===1 ? 'green' : 'volcano'" v-text="text===1 ? '正常' : '禁用'"></a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">详情</a>
            </a-menu-item>
            <a-menu-item>
                  <a-popconfirm title="确认禁用？" @confirm="disableUser(record)">
                <a-icon slot="icon" type="question-circle-o" style="color: red" />
                 <a href="javascript:;">禁用</a>
                </a-popconfirm>
            </a-menu-item>
            <a-menu-item>
              <a-popconfirm title="确认删除？" @confirm="removeUser(record)">
                <a-icon slot="icon" type="question-circle-o" style="color: red" />
                 <a href="javascript:;">删除</a>
                </a-popconfirm>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
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
          label="用户名"
        >
          <a-input placeholder="请输入用户名" :disabled="!add" v-decorator="['username', {rules: [{required: true, min: 6, message: '用户名至少为6位！'}]}]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="昵称"
        >
          <a-input placeholder="请输入昵称" v-decorator="['nickName', {rules: [{required: true, min: 1, message: '请输入昵称！'}]}]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="真实姓名"
        >
          <a-input placeholder="请输入真实姓名" v-decorator="['trueName', {rules: [{required: true, min: 2, message: '请输入真实姓名,至少两位！'}]}]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="性别"
        >
          <a-radio-group v-decorator="['sex', {rules: [{required: true, message: '请选择性别'}]}]">
            <a-radio :value="'男'">男</a-radio>
            <a-radio :value="'女'">女</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态"
        >
          <a-radio-group v-decorator="['state', {rules: [{required: true, message: '请选择状态'}]}]">
            <a-radio :value="1">正常</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-divider />

      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
// eslint-disable-next-line no-unused-vars
import { getRoleList, getServiceList, getUserList, addUser, updateUser, removeUser } from '@/api/manage'

export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    return {
      // description: '列表使用场景：后台管理中的用户管理。',
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
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
          title: '用户名',
          dataIndex: 'username'
        },
        {
          title: '昵称',
          dataIndex: 'nickName'
        },
        {
          title: '真实姓名',
          dataIndex: 'trueName'
        },
        {
          title: '性别',
          dataIndex: 'sex'
        },
        {
          title: '状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          customRender: (text) => new Date(text).toLocaleString()
        }, {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getUserList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    getServiceList().then(res => {
      console.log('getServiceList.call()', res)
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
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    handleOk () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if (this.add) {
            addUser(this.form.getFieldsValue()).then(() => {
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
            updateUser(this.form.getFieldsValue()).then(() => {
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
    disableUser (record) {
      record.createTime = null
      record.updateTime = null
      record.state = 0
      updateUser(record).then(() => {
        this.$message.success('禁用成功！', 2)
        this.$refs.table.refresh()
      }).catch((res) => {
        this.$message.error(res.message, 2)
      })
    },
    removeUser (record) {
      removeUser(record.id).then(() => {
        this.$message.success('删除成功！', 2)
        this.$refs.table.refresh()
      }).catch((res) => {
        this.$message.error(res.message, 2)
      })
    },
    handleCancel () {
      this.form.resetFields()
      this.confirmLoading = false
      this.visible = false
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
