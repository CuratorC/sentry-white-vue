import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/projects',
    method: 'get',
    params
  })
}

export function getListOnOriginal(original_id) {
  return request({
    url: `/originals/` + original_id,
    method: 'get'
  })
}

export function show(id) {
  return request({
    url: `/projects/` + id,
    method: 'get',
    params: {}
  })
}

export function store(formData, original_id) {
  return request({
    url: `/projects`,
    method: 'post',
    data: {
      original_id: original_id,
      name: formData.name,
      substitute_name: formData.substitute_name,
      responsible_people_id: formData.responsible_people_id
    }
  })
}

export function update(formData, original_id) {
  return request({
    url: `/projects/` + formData.id,
    method: 'put',
    data: {
      original_id: original_id,
      name: formData.name,
      substitute_name: formData.substitute_name,
      responsible_people_id: formData.responsible_people_id
    }
  })
}

export function destroy(id) {
  return request({
    url: `/projects/` + id,
    method: 'delete'
  })
}

