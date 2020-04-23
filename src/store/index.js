import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import system from './modules/system'
import department from './modules/department'
import role from './modules/role'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    system,
    department,
    role
  },
  getters
})

export default store
