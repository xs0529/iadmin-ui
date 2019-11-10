import Vue from 'vue'

// eslint-disable-next-line standard/object-curly-even-spacing
import { hasPermission, hasNoPermission, hasAnyPermission, hasRole, hasAnyRole } from '/src/core/directives/permission'

const Plugins = [
  hasPermission,
  hasNoPermission,
  hasAnyPermission,
  hasRole,
  hasAnyRole
]

Plugins.map((plugin) => {
  Vue.use(plugin)
})

export default Vue
