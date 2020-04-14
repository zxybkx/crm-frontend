import {request} from 'casic-common';

export async function fetch(id) {
  return request(`/gateway/api/users/${id}`, {
    method: 'GET'
  });
}

export async function getCurrentEmployeeDetail() {
  return request(`/gateway/hrservice/api/hr-employees/mine`, {
    method: 'GET'
  });
}

export async function resources() {
  return request(`/gateway/api/resources`, {
    method: 'GET'
  });
}

