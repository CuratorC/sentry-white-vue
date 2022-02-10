import request from '@/utils/request'

export function show(id) {
  return request({
    url: `/robots/` + id,
    method: 'get',
    params: {}
  })
}

export function store(formData, project_id) {
  return request({
    url: `/robots`,
    method: 'post',
    data: {
      project_id: project_id,
      name: formData.name,
      access_token: formData.access_token
    }
  })
}

export function update(formData, project_id) {
  return request({
    url: `/robots/${formData.id}`,
    method: 'put',
    data: {
      project_id: project_id,
      name: formData.name,
      access_token: formData.access_token
    }
  })
}
