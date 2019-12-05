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
      :scroll="{ x: '150%'}"
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
import { removeSysLog, getSysLogList } from '@/api/manage'

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
          title: 'ip',
          dataIndex: 'requestIp'
        },
        {
          title: '地址',
          align: 'center',
          dataIndex: 'address',
          customRender: (text) => <title title={text} style="display: inline-block;">{text}</title>
        },
        {
          title: '操作方法',
          dataIndex: 'method',
          customRender: (text) => <title title={text} style="display: inline-block;">{text}</title>
        },
        {
          title: '参数',
          dataIndex: 'params',
          customRender: (text) => <title title={text} style="display: inline-block;">{text}</title>
        },
        {
          title: '用时',
          dataIndex: 'time'
        },
        {
          title: '日志级别',
          dataIndex: 'logLevel'
        },
        {
          title: '说明',
          dataIndex: 'description'
        },
        {
          title: '错误详情',
          dataIndex: 'exceptionDetail'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
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
        return getSysLogList(Object.assign(parameter, this.queryParam))
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
      removeSysLog(record.id).then(() => {
        this.$message.success('删除成功！', 2)
        this.$refs.table.refresh()
      }).catch((res) => {
        this.$message.error(res.message, 2)
      })
    },
    showTitle (text) {
      return '      <div :title="record.address" :style="{maxWidth: \'600px\',whiteSpace: \'nowrap\',textOverflow: \'ellipsis\',overflow: \'hidden\', wordWrap: \'break-word\', wordBreak: \'break-all\' }" slot="titleShow" slot-scope="text, record">\n' +
        text +
        '      </div>'
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
