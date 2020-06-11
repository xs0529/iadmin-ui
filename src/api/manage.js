import { axios } from '@/utils/request'
import qs from 'qs'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree',
  loginLog: '/sysLoginLog',
  sysLog: '/sysLog'
}

export default api

export function getUserList (parameter) {
  return axios({
    url: api.user + '/page',
    method: 'get',
    params: parameter
  })
}

export function addUser (parameter) {
  return axios({
    url: api.user + '/add',
    method: 'post',
    params: parameter,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

export function updateUser (parameter) {
  return axios({
    url: api.user + '/update',
    method: 'post',
    params: parameter,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

export function removeUser (parameter) {
  return axios({
    url: api.user + '/remove/' + parameter,
    method: 'post'
  })
}

export function getRoleList (parameter) {
  return axios({
    url: api.role + '/page',
    method: 'get',
    params: parameter
  })
}

export function removeLoginLog (parameter) {
  return axios({
    url: api.loginLog + '/remove/' + parameter,
    method: 'post'
  })
}

export function getLoginLogList (parameter) {
  return axios({
    url: api.loginLog + '/page',
    method: 'get',
    params: parameter
  })
}

export function removeSysLog (parameter) {
  return axios({
    url: api.sysLog + '/remove/' + parameter,
    method: 'post'
  })
}

export function getSysLogList (parameter) {
  return axios({
    url: api.sysLog + '/page',
    method: 'get',
    params: parameter
  })
}

export function getRoleByUser (parameter) {
  return axios({
    url: api.role + '/getByUser/' + parameter,
    method: 'get'
  })
}

export function getPermissionVo () {
  return axios({
    url: api.permission + '/tree',
    method: 'get'
  })
}

export function getPermissionListTreeVO (parameter) {
  return axios({
    url: api.permission + '/treePage',
    method: 'get',
    params: parameter
  })
}

export function getPermissionByRoleId (parameter) {
  return axios({
    url: api.permission + '/getByRoleId?id=' + parameter,
    method: 'get'
  })
}

export function addPermission (parameter) {
  return axios({
    url: api.permission + '/add',
    method: 'post',
    params: parameter

  })
}

export function updatePermission (parameter) {
  return axios({
    url: api.permission + '/update',
    method: 'post',
    params: parameter

  })
}

export function addRole (parameter) {
  return axios({
    url: api.role + '/add',
    method: 'post',
    params: parameter

  })
}

export function updateRole (parameter) {
  return axios({
    url: api.role + '/update',
    method: 'post',
    params: parameter,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

export function removeRole (parameter) {
  return axios({
    url: api.role + '/remove/' + parameter,
    method: 'post'
  })
}

export function getServiceList (parameter) {
  return axios({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return axios({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return axios({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}
