import {stringify} from 'qs';
import {request} from 'casic-common';

export async function getMapData() {
  return request(`/gateway/crmservice/api/crm-customers/statistics/regionDistributed`, {
    method: 'GET',
  });
}

export async function getCustomerNumber(params) {
  return request(`/gateway/crmservice/api/crm-customers/statistics/growthRate?${stringify(params)}`, {
    method: 'GET'
  })
}

export async function getBusinessSpread() {
  return request(`/gateway/crmservice/api/crm-businesses/status/total`, {
    method: 'GET'
  })
}

export async function getProductZb() {
  return request(`/gateway/crmservice/api/crm-products/type/total`, {
    method: 'GET'
  })
}

export async function getOrganization() {
  return request(`/gateway/crmservice/api/crm-products/unit/total`, {
    method: 'GET'
  })
}

export async function getBusinessNumber(params) {
  return request(`/gateway/crmservice/api/crm-businesses/statistics/growthRate?${stringify(params)}`, {
    method: 'GET'
  })
}
