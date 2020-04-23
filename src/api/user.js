import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/getInfo',
    method: 'get'
  })
}

export function getAll() {
  return request({
    url: '/user/getAll',
    method: 'get'
  })
}

export function remove(data) {
  return request({
    url: '/user/remove',
    method: 'delete',
    data
  })
}

export function update(data) {
  return request({
    url: '/user/update',
    method: 'put',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
