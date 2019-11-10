import Vue from 'vue'
import store from '@/store'

// 必须包含列出的所有权限，元素才显示

export const hasPermission =
  Vue.directive('hasPermission', {
    inserted: function (el, binding, vnode) {
      const permissions = store.state.user.permissionCodes
      let value = binding.value
      let flag = true
      if (typeof (value) === 'string') {
        value = new Array(value)
      }
      for (const v of value) {
        console.info(v)
        if (!permissions.includes(v)) {
          flag = false
        }
      }
      if (!flag) {
        if (!el.parentNode) {
          el.style.display = 'none'
        } else {
          el.parentNode.removeChild(el)
        }
      }
    }
  })

// 当不包含列出的权限时，渲染该元素
export const hasNoPermission =
    Vue.directive('hasNoPermission', {
      inserted (el, binding, vnode) {
        const permissions = store.state.user.permissionCodes
        let value = binding.value
        let flag = true
        if (typeof (value) === 'string') {
          value = new Array(value)
        }
        for (const v of value) {
          if (permissions.includes(v)) {
            flag = false
          }
        }
        if (!flag) {
          if (!el.parentNode) {
            el.style.display = 'none'
          } else {
            el.parentNode.removeChild(el)
          }
        }
      }
    })

// 只要包含列出的任意一个权限，元素就会显示
export const hasAnyPermission =
    Vue.directive('hasAnyPermission', {
      inserted (el, binding, vnode) {
        const permissions = vnode.context.$store.state.user.permissionCodes
        let value = binding.value
        let flag = true
        if (typeof (value) === 'string') {
          value = new Array(value)
        }
        for (const v of value) {
          if (permissions.includes(v)) {
            flag = true
          }
        }
        if (!flag) {
          if (!el.parentNode) {
            el.style.display = 'none'
          } else {
            el.parentNode.removeChild(el)
          }
        }
      }
    })

// 必须包含列出的所有角色，元素才显示
export const hasRole =
    Vue.directive('hasRole', {
      inserted (el, binding, vnode) {
        const permissions = vnode.context.$store.state.user.roleLabels
        let value = binding.value
        let flag = true
        if (typeof (value) === 'string') {
          value = new Array(value)
        }
        for (const v of value) {
          if (!permissions.includes(v)) {
            flag = false
          }
        }
        if (!flag) {
          if (!el.parentNode) {
            el.style.display = 'none'
          } else {
            el.parentNode.removeChild(el)
          }
        }
      }
    })

// 只要包含列出的任意一个角色，元素就会显示
export const hasAnyRole =
    Vue.directive('hasAnyRole', {
      inserted (el, binding, vnode) {
        const permissions = vnode.context.$store.state.user.roleLabels
        let value = binding.value
        let flag = true
        if (typeof (value) === 'string') {
          value = new Array(value)
        }
        for (const v of value) {
          if (permissions.includes(v)) {
            flag = true
          }
        }
        if (!flag) {
          if (!el.parentNode) {
            el.style.display = 'none'
          } else {
            el.parentNode.removeChild(el)
          }
        }
      }
    })
