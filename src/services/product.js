import {stringify} from 'qs';
import {request} from 'casic-common';

export async function addProduct(payload) {
  return request(`/gateway/crmservice/api/crm-products`, {
    method: 'POST',
    body: payload,
  })
}

export async function checkProduct(params) {
  return request(`/gateway/crmservice/api/crm-products/${params.id}`, {
    method: 'GET'
  })
}

export async function editProduct(params) {
  return request(`/gateway/crmservice/api/crm-products`, {
    method: 'PUT',
    body: params
  })
}

export async function getDataList(params) {
  return request(`/gateway/crmservice/api/crm-products?${stringify(params)}&sort=zt,asc&sort=dwmc,asc`, {
    method: 'GET'
  })
}

export async function deployData() {
  return request(`/gateway/crmservice/api/crm-categories/findall-item`, {
    method: 'GET'
  })
}

export async function deleteData(payload) {
  return request(`/gateway/crmservice/api/crm-products/logic/batch`, {
    method: 'PUT',
    body: payload
  })
}

export async function getPinYin(params) {
  return request(`/gateway/utilservice/api/pinyin/words/${params.text}`, {
    method: 'GET'
  })
}
