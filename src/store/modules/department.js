import {
  getAll,
  add,
  remove,
  update
} from '@/api/department'
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
    var json = { depId: id }
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
  update({}, dep) {
    dep = qs.stringify(dep)
    return new Promise((resolve, reject) => {
      update(dep).then(response => {
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
  add({}, dep) {
    dep = qs.stringify(dep)
    return new Promise((resolve, reject) => {
      add(dep).then(response => {
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

