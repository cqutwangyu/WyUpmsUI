import request from '@/utils/request'

export function getAll() {
  return request({
    url: '/system/dep/getAll',
    method: 'get'
  })
}
export function add(data) {
  return request({
    url: '/system/dep/add',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/system/dep/remove',
    method: 'delete',
    data
  })
}
export function update(data) {
  return request({
    url: '/system/dep/update',
    method: 'put',
    data
  })
}
