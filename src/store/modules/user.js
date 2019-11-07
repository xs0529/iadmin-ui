import Vue from 'vue'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    roleLabels: [],
    permissionCodes: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_ROLE_LABELS: (state, roleLabels) => {
      state.roleLabels = roleLabels
    },
    SET_PERMISSION_CODES: (state, permissionCodes) => {
      state.permissionCodes = permissionCodes
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.data
          Vue.ls.set(ACCESS_TOKEN, result, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.data
          result.permissionCodes = result.permissionCodes.concat('default')
          commit('SET_ROLE_LABELS', result.roleLabels)
          commit('SET_PERMISSION_CODES', result.permissionCodes)
          commit('SET_INFO', result.userInfo)
          commit('SET_NAME', { name: result.userInfo.name, welcome: welcome() })
          commit('SET_AVATAR', result.userInfo.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLE_LABELS', [])
          commit('SET_PERMISSION_CODES', [])
          Vue.ls.remove(ACCESS_TOKEN)
        })
      })
    }

  }
}

export default user
