import {request} from 'casic-common';

export default async function queryError(code) {
  return request(`/api/${code}`);
}
