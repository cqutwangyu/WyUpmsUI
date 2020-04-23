import request from '@/utils/request'

export function getAll() {
  return request({
    url: '/system/role/getAll',
    method: 'get'
  })
}
export function add(data) {
  return request({
    url: '/system/role/add',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/system/role/remove',
    method: 'delete',
    data
  })
}
export function update(data) {
  return request({
    url: '/system/role/update',
    method: 'put',
    data
  })
}
