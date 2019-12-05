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
            <a-range-picker @change="onChange" v-model="time"/>
          </a-col>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => {queryParam = {}, time = []}">重置</a-button>
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
        <a-popconfirm title="确认删除？" @confirm="removeRole(record)">
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
// eslint-disable-next-line no-unused-vars
import { removeLoginLog, getLoginLogList } from '@/api/manage'

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
          title: '用户名',
          dataIndex: 'username'
        },
        {
          title: '登录地址',
          dataIndex: 'address'
        },
        {
          title: '登录ip',
          dataIndex: 'ip'
        },
        {
          title: '操作系统',
          dataIndex: 'system'
        },
        {
          title: '登录浏览器',
          dataIndex: 'browser'
        },
        {
          title: '登录时间',
          dataIndex: 'loginTime',
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
        return getLoginLogList(Object.assign(parameter, this.queryParam))
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
  },
  methods: {
    handleEdit (record) {
      this.add = false
      setTimeout(() => {
        this.form.setFieldsValue(record)
      }, 0)
      this.visible = true
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
      removeLoginLog(record.id).then(() => {
        this.$message.success('删除成功！', 2)
        this.$refs.table.refresh()
      }).catch((res) => {
        this.$message.error(res.message, 2)
      })
    }
  },
  watch: {
    'time': function () {
      this.queryParam.beginTime = this.time[0].format('YYYY-MM-DD')
      this.queryParam.endTime = this.time[1].format('YYYY-MM-DD')
    }
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

<style>
  .ant-table-tbody > tr > td {
    max-width: 110px;
    border-bottom: 0;
    text-align: center !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
