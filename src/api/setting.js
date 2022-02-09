import request from '@/utils/request'

export function get(params) {
  return request({
    url: '/local_storages',
    method: 'get',
    params
  })
}

export function set(data) {
  return request({
    url: '/local_storages',
    method: 'put',
    data
  })
}
