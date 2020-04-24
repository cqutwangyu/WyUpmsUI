import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import system from './modules/system'
import menu from './modules/menu'
import department from './modules/department'
import role from './modules/role'
import allocation from './modules/allocation'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    system,
    menu,
    department,
    role,
    allocation
  },
  getters
})

export default store
