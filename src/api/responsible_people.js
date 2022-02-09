import request from '@/utils/request'

export function index(params) {
  return request({
    url: '/responsible_people',
    method: 'get',
    params
  })
}

export function show(id) {
  return request({
    url: `/responsible_people/` + id,
    method: 'get',
    params: {}
  })
}

export function store(formData) {
  return request({
    url: `/responsible_people`,
    method: 'post',
    data: {
      name: formData.name,
      phone: formData.phone
    }
  })
}

export function update(formData) {
  return request({
    url: `/responsible_people/` + formData.id,
    method: 'put',
    data: {
      name: formData.name,
      phone: formData.phone
    }
  })
}

export function destroy(id) {
  return request({
    url: `/responsible_people/` + id,
    method: 'delete'
  })
}

