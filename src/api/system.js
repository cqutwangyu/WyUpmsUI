import request from '@/utils/request'

export function getAll() {
  return request({
    url: '/system/getAll',
    method: 'get'
  })
}
export function add(data) {
  return request({
    url: '/system/add',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/system/remove',
    method: 'delete',
    data
  })
}
export function update(data) {
  return request({
    url: '/system/update',
    method: 'put',
    data
  })
}
