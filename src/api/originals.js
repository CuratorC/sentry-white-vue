import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/originals',
    method: 'get',
    params
  })
}

export function show(id) {
  return request({
    url: `/originals/` + id,
    method: 'get',
    params: {}
  })
}

export function store(formData) {
  return request({
    url: `/originals`,
    method: 'post',
    data: {
      name: formData.name,
      account_name: formData.account_name,
      password: formData.password
    }
  })
}

export function update(formData) {
  return request({
    url: `/originals/` + formData.id,
    method: 'put',
    data: {
      name: formData.name,
      account_name: formData.account_name,
      password: formData.password
    }
  })
}

export function destroy(id) {
  return request({
    url: `/originals/` + id,
    method: 'delete'
  })
}

