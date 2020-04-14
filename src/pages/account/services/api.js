import { stringify } from 'qs';
import {request} from 'casic-common';

export async function changePassword(data) {
  return request(`/gateway/api/account/change-password`, {
    method: 'PUT',
    body: data
  });
}
