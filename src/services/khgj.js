/**
 * Created by sam on 2019/7/1.
 */
import {stringify} from 'qs';
import {request} from 'casic-common';
import _ from 'lodash';

export async function getKhgjList(params, data) {
  return request(`/gateway/crmservice/api/crm-khgjs/condition?${stringify({...params})}`, {
    method: 'POST',
    body: data
  })
}

/**
 * TODO: 后续这段代码需要整理到 customer 中
 * 并且 需要单独提供接口
 * @param params
 * @returns {Promise.<Object>}
 */
export async function getCustomersList() {
  return request(`/gateway/crmservice/api/crm-customers/dropDownList`, {
    method: 'GET'
  })
}

export async function saveAddRcgj(payload) {
  return request(`/gateway/crmservice/api/crm-khgjs`, {
    method: 'POST',
    body: payload
  })
}

export async function getRcgjData(params) {
  return request(`/gateway/crmservice/api/crm-khgjs/detail/${params.khgjId}`, {
    method: 'GET'
  })
}

export async function saveEditRcgj(payload) {
  return request(`/gateway/crmservice/api/crm-khgjs`, {
    method: 'PUT',
    body: payload
  })
}

export async function getKhgjType(params) {
  return request(`/gateway/crmservice/api/crm-categories/info?${stringify(params)}`, {
    method: 'GET'
  })
}

/**
 * (实地调查记录)基本信息
 * @param payload
 * @returns {Promise.<Object>}
 */
export async function addSddcJbxx(params) {
  return request(`/gateway/crmservice/api/crm-sddcs`, {
    method: 'POST',
    body: params,
  })
}

export async function getSsddcInfo(params) {
  return request(`/gateway/crmservice/api/crm-sddcs/${params.id}`, {
    method: 'GET',
  })
}

//公司产品查询
export async function getComProduct(params) {
  return request(`/gateway/crmservice/api/crm-sddc-gscps?${stringify(params)}`, {
    method: 'GET'
  })
}

//公司产品批量新增
export async function addComProduct({productData, sddcId}) {
  return request(`/gateway/crmservice/api/crm-sddc-gscps/batch?sddcId=${sddcId}`, {
    method: 'POST',
    body: productData
  })
}

//公司产品批量更新
export async function editProduct({productData, sddcId}) {
  return request(`/gateway/crmservice/api/crm-sddc-gscps/batch?sddcId=${sddcId}`, {
    method: 'PUT',
    body: productData
  })
}

//公司生产及财务新增
export async function addGscw({fields, sddcId}) {
  return request(`/gateway/crmservice/api/crm-sddc-sccws?sddcId=${sddcId}`, {
    method: 'POST',
    body: fields
  })
}

//公司生产及财务查询
export async function getGscwData(params) {
  return request(`/gateway/crmservice/api/crm-sddc-sccws?${stringify(params)}`, {
    method: 'GET'
  })
}

//公司生产及财务更新
export async function editGscw({payload, sddcId}) {
  return request(`/gateway/crmservice/api/crm-sddc-sccws?sddcId=${sddcId}`, {
    method: 'PUT',
    body: payload
  })
}

//企业供应商查询
export async function getGysList(params) {
  return request(`/gateway/crmservice/api/crm-sddc-qygys?${stringify(params)}`, {
    method: 'GET'
  })
}

//企业供应商批量新增
export async function addGys({gysData, sddcId}) {
  return request(`/gateway/crmservice/api/crm-sddc-qygys/batch?sddcId=${sddcId}`, {
    method: 'POST',
    body: gysData
  })
}

//企业供应商批量更新
export async function editGys({gysData, sddcId}) {
  return request(`/gateway/crmservice/api/crm-sddc-qygys/batch?sddcId=${sddcId}`, {
    method: 'PUT',
    body: gysData
  })
}

export async function getSddcData(params) {
  return request(`/gateway/crmservice/api/crm-khgjs/detail/${params.id}`, {
    method: 'GET'
  })
}

export async function saveSddcOntherModal(payload) {
  return request(`/gateway/crmservice/api/crm-sddcs/attached`, {
    method: 'POST',
    body: payload
  })
}

