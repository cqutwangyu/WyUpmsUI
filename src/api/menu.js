import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/system/menu/list',
    method: 'post',
    data
  })
}
export function add(data) {
  return request({
    url: '/system/menu/add',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/system/menu/remove',
    method: 'delete',
    data
  })
}
export function update(data) {
  return request({
    url: '/system/menu/update',
    method: 'put',
    data
  })
}
