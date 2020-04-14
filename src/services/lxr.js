/**
 * Created by sam on 2019/7/5.
 */
import {stringify} from 'qs';
import {request} from 'casic-common';

export async function getLxrList(params) {
  return request(`/gateway/crmservice/api/crm-customer-lxrs?${stringify(params)}`, {
    method: 'GET',
  });
}

// export async function saveCustomer(params) {
//   return request(`/gateway/crmservice/api/crm-customers`,{
//     method: 'POST',
//     body: params,
//   })
// }

export async function addLxr(params) {
  return request(`/gateway/crmservice/api/crm-customer-lxrs`,{
    method: 'POST',
    body: params,
  })
}
// 按条件查询联系人信息条数
export async function getLxrCount(params) {
  return request(`/gateway/crmservice/api/crm-customer-lxrs/count?${stringify(params)}`,{
    method: 'GET',
  })
}

export async function modifyLxr(payload) {
  return request(`/gateway/crmservice/api/crm-customer-lxrs`, {
    method: 'PUT',
    body: payload
  });
}
// 通过ID查询联系人**
export async function getLxrListById(payload) {
  return request(`/gateway/crmservice/api/crm-customer-lxrs/${payload.id}`, {
    method: 'GET',
  });
}
// 软删除联系人信息
export async function deleteLxrSoft(payload) {
  return request(`/gateway/crmservice/api/crm-customer-lxrs/delete/${payload.id}`, {
    method: 'POST',
    body: payload
  })
}
// 物理删除联系人信息
export async function deleteLxr(payload) {
  return request(`/gateway/crmservice/api/crm-customer-lxrs/${payload.id}`, {
    method: 'DELETE'
  })
}
export async function getLxrDetails(payload) {
  return request(`/gateway/crmservice/api/crm-customer-lxrs/detail/${payload.id}`,{
    method: 'GET',
  })
}

// export async function validateKhmc(payload) {
//   return request(`/gateway/crmservice/api/crm-customers/validate?${stringify(payload)}`, {
//     method: 'GET',
//   })
// }
//
// export async function changeKhzt(payload) {
//   return request(`/gateway/crmservice/api/crm-customers/changeKhzt/${payload.id}`,{
//     method: 'POST',
//     body: payload
//   })
// }
