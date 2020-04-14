import { stringify } from 'qs';
import { request } from 'casic-common';

export async function getDataLIst(params) {
  return request(`/gateway/crmservice/api/crm-contracts?${stringify(params)}`, {
    method: 'GET',
  });
}
