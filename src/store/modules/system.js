import {
  getAll,
  add,
  remove,
  update
} from '@/api/system'
import { Msg } from '@/utils/message'
import qs from 'qs'

const actions = {
  getAll({}) {
    return new Promise((resolve, reject) => {
      getAll().then(response => {
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  remove({}, id) {
    var json = { systemId: id }
    json = qs.stringify(json)
    return new Promise((resolve, reject) => {
      remove(json).then(response => {
        if (response.code == 200) {
          Msg.success(response.message)
        } else {
          Msg.error(response.message)
        }
        Msg.success(response.data)
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  update({}, system) {
    system = qs.stringify(system)
    return new Promise((resolve, reject) => {
      update(system).then(response => {
        if (response.code == 200) {
          Msg.success(response.message)
        } else {
          Msg.error(response.message)
        }
        Msg.success(response.data)
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  add({}, system) {
    system = qs.stringify(system)
    return new Promise((resolve, reject) => {
      add(system).then(response => {
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

