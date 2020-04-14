import {stringify} from 'qs';
import {request} from 'casic-common';

export async function getCustomersList() {
  return request(`/gateway/crmservice/api/crm-customers/dropDownList`, {
    method: 'GET'
  })
}

export async function getDataList(params) {
  return request(`/gateway/crmservice/api/crm-businesses?${stringify(params)}&sort=jsrq,desc`, {
    method: 'GET'
  })
}

export async function addBusiness(payload) {
  return request(`/gateway/crmservice/api/crm-businesses`, {
    method: 'POST',
    body: payload
  })
}

export async function getBusinessData(params) {
  return request(`/gateway/crmservice/api/crm-businesses/${params}`, {
    method: 'GET'
  })
}

export async function categories(params) {
  return request(`/gateway/crmservice/api/crm-categories/info?${stringify(params)}`, {
    method: 'GET'
  })
}

export async function getProdcutOption(params) {
  return request(`/gateway/crmservice/api/crm-products?${stringify(params)}`, {
    method: 'GET'
  })
}

export async function saveBasicInfo(payload) {
  return request(`/gateway/crmservice/api/crm-businesses`, {
    method: 'PUT',
    body: payload
  })
}

export async function addBusinessProduct(payload) {
  return request(`/gateway/crmservice/api/crm-business-products`, {
    method: 'POST',
    body: payload
  })
}

export async function editBusinessProduct(payload) {
  return request(`/gateway/crmservice/api/crm-business-products`, {
    method: 'PUT',
    body: payload
  })
}

export async function deleteProduct(payload) {
  return request(`/gateway/crmservice/api/crm-business-products/logic/${payload.id}`, {
    method: 'PUT'
  })
}

export async function addBusinessGjjl(payload) {
  return request(`/gateway/crmservice/api/crm-business-follows`, {
    method: 'POST',
    body: payload
  })
}

export async function editBusinessGjjl(payload) {
  return request(`/gateway/crmservice/api/crm-business-follows`, {
    method: 'PUT',
    body: payload
  })
}

export async function deleteGjjl(params) {
  return request(`/gateway/crmservice/api/crm-business-follows/logic/${params.id}`, {
    method: 'PUT'
  })
}

export async function getPinYin(params) {
  return request(`/gateway/utilservice/api/pinyin/words/${params.text}`, {
    method: 'GET'
  })
}
