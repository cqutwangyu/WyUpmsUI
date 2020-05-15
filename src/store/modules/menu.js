import {
  getAll,
  list,
  add,
  remove,
  update
} from '@/api/menu'
import { Msg } from '@/utils/message'
import qs from 'qs'

const actions = {
  list({},menuQueryForm) {
    var json = qs.stringify(menuQueryForm)
    return new Promise((resolve, reject) => {
      list(json).then(response => {
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  getAll({},sysId) {
    return new Promise((resolve, reject) => {
      getAll(sysId).then(response => {
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  remove({}, id) {
    var json = { menuId: id }
    json = qs.stringify(json)
    return new Promise((resolve, reject) => {
      remove(json).then(response => {
        if (response.code == 200) {
          Msg.success(response.message)
        } else {
          Msg.error(response.message)
        }
        Msg.success(response.data)
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  update({}, menu) {
    menu = qs.stringify(menu)
    return new Promise((resolve, reject) => {
      update(menu).then(response => {
        if (response.code == 200) {
          Msg.success(response.message)
        } else {
          Msg.error(response.message)
        }
        Msg.success(response.data)
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  add({}, menu) {
    menu = qs.stringify(menu)
    return new Promise((resolve, reject) => {
      add(menu).then(response => {
        if (response.code == 200) {
          Msg.success(response.message)
        } else {
          Msg.error(response.message)
        }
        Msg.success(response.data)
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  actions
}

