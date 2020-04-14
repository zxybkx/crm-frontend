/**
 * Created by sam on 2019/7/1.
 */
import {stringify} from 'qs';
import {request} from 'casic-common';

export async function getKhpgList(params, data) {
  return request(`/gateway/crmservice/api/crm-khpgs?${stringify({...params, ...data})}`,{
    method: 'GET',
  });
}

export async function getZhpgRules() {
  return request(`/gateway/crmservice/api/crm-zhpgs/init-by-add`, {
    method: 'GET'
  })
}

export async function saveAddZhpg(payload) {
  return request(`/gateway/crmservice/api/crm-zhpgs`, {
    method: 'POST',
    body: payload,
  })
}

export async function getZhpgData(params) {
  return request(`/gateway/crmservice/api/crm-zhpgs/init-by-update/${params.customerId}`,{
    method: 'GET'
  })
}

export async function saveModifyZhpg(params) {
  return request(`/gateway/crmservice/api/crm-zhpgs`,{
    method: 'PUT',
    body: params
  })
}

export async function getFxpgRules() {
  return request(`/gateway/crmservice/api/crm-lsfxes/init-by-add`,{
    method: 'GET'
  })
}

export async function getFxpgData(params) {
  return request(`/gateway/crmservice/api/crm-lsfxes/init-by-update/${params.id}`, {
    method: 'GET'
  })
}

export async function addFxpgSave(payload) {
  return request(`/gateway/crmservice/api/crm-lsfxes`,{
    method: 'POST',
    body: payload
  })
}

export async function editFxpgSave(params) {
  return request(`/gateway/crmservice/api/crm-lsfxes`,{
    method: 'PUT',
    body: params
  })
}

export async function getkhzzRules() {
  return request(`/gateway/crmservice/api/crm-khzzes/init-by-add`, {
    method: 'GET',
  })
}

export async function saveAddkhzz(payload) {
  return request(`/gateway/crmservice/api/crm-khzzes`, {
    method: 'POST',
    body: payload
  })
}

export async function getKhzzData(params) {
  return request(`/gateway/crmservice/api/crm-khzzes/init-by-update/${params.id}`,{
    method: 'GET'
  })
}

export async function saveEditkhzz(payload) {
  return request(`/gateway/crmservice/api/crm-khzzes`, {
    method: 'PUT',
    body: payload
  })
}

export async function getPgbType(params) {
  return request(`/gateway/crmservice/api/crm-categories/info?${stringify(params)}`, {
    method: 'GET'
  })
}

export async function getPgbList(params, data) {
  return request(`/gateway/crmservice/api/crm-templates?${stringify({...params, ...data})}`, {
    method: 'GET'
  })
}

export async function addTemplate(payload) {
  return request(`/gateway/crmservice/api/crm-templates`,{
    method: 'POST',
    body: payload
  })
}

export async function editTemplate(params) {
  return request(`/gateway/crmservice/api/crm-templates/${params.id}`, {
    method: 'GET'
  })
}

export async function editSave(payload) {
  return request(`/gateway/crmservice/api/crm-templates`,{
    method: 'PUT',
    body: payload
  })
}

export async function addSddy(payload) {
  return request(`/gateway/crmservice/api/crm-sddypgs`, {
    method: 'POST',
    body: payload
  })
}

export async function getSddy(params) {
  return request(`/gateway/crmservice/api/crm-sddypgs/${params.id}`, {
    method: 'GET'
  })
}

export async function editSddy(payload) {
  return request(`/gateway/crmservice/api/crm-sddypgs`, {
    method: 'PUT',
    body: payload
  })
}

export async function getSddyTableData(params) {
  return request(`/gateway/crmservice/api/crm-khgjs?${stringify(params)}`, {
    method: 'GET'
  })
}
