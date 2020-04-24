import request from '@/utils/request'

export function getAll() {
  return request({
    url: '/system/permission/getAll',
    method: 'get'
  })
}
export function add(data) {
  return request({
    url: '/system/permission/add',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/system/permission/remove',
    method: 'delete',
    data
  })
}
export function update(data) {
  return request({
    url: '/system/permission/update',
    method: 'put',
    data
  })
}
