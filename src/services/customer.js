/**
 * Created by sam on 2019/7/1.
 */
import {stringify} from 'qs';
import {request} from 'casic-common';

export async function getCustomersList(param, data) {
  return request(`/gateway/crmservice/api/crm-customers?${stringify({...param, ...data})}`, {
    method: 'GET',
  });
}

export async function saveAddCustomer(params) {
  return request(`/gateway/crmservice/api/crm-customers`, {
    method: 'POST',
    body: params,
  })
}

export async function saveEditCustomer(params) {
  return request(`/gateway/crmservice/api/crm-customers`, {
    method: 'PUT',
    body: params,
  })
}

export async function addCustomerGdxx(params) {
  return request(`/gateway/crmservice/api/crm-customer-gdxxes`, {
    method: 'POST',
    body: params,
  })
}

export async function getCustomerGdxx(params) {
  return request(`/gateway/crmservice/api/crm-customer-gdxxes?${stringify(params)}`, {
    method: 'GET',
  })
}

export async function editCustomerGdxx(payload) {
  return request(`/gateway/crmservice/api/crm-customer-gdxxes`, {
    method: 'PUT',
    body: payload
  });
}

export async function deleteCustomerGd(payload) {
  return request(`/gateway/crmservice/api/crm-customer-gdxxes/delete/${payload.id}`, {
    method: 'POST',
    body: payload
  })
}

export async function editCustomer(payload) {
  return request(`/gateway/crmservice/api/crm-customers/detail/${payload.id}`, {
    method: 'GET',
  })
}

export async function validateKhmc(payload) {
  return request(`/gateway/crmservice/api/crm-customers/validate?${stringify(payload)}`, {
    method: 'GET',
  })
}

export async function changeKhzt(payload) {
  return request(`/gateway/crmservice/api/crm-customers/changeKhzt?${stringify((payload))}`, {
    method: 'PUT',
    body: payload
  })
}

export async function getOptions() {
  return request(`/gateway/crmservice/api/crm-customers/getComboBox`, {
    method: 'GET'
  })
}

export async function getAreaOptions(params) {
  return request(`/gateway/utilservice/api/administrative-division/next-level?${stringify(params)}`, {
    method: 'GET'
  })
}

export async function detailInfo(params) {
  return request(`/gateway/crmservice/api/crm-customers/info/${params.id}`,{
    method: 'GET'
  })
}

export async function getKhzzOptions(params) {
  return request(`/gateway/crmservice/api/crm-categories/info?${stringify(params)}`, {
    method: 'GET'
  })
}

export async function getKhxxFromName(params) {
  return request(`/gateway/utilservice/api/enterprise-chinese/name/${params.name}`, {
    method: 'GET'
  })
}

export async function getKhbm(params) {
  return request(`/gateway/masterdataservice/api/master/getConsumerCode?${stringify(params)}`,{
    method: 'GET'
  })
}

export async function getKhlbOptions(params) {
  return request(`/gateway/crmservice/api/crm-khlbs?${stringify(params)}`,{
    method: 'GET'
  })
}

// 根据层级path获取对应的数据
export async function getInitialValue(params) {
  return request(`/gateway/crmservice/api/crm-khlbs/tree?${stringify(params)}`,{
    method: 'GET'
  })
}
