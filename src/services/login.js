import { stringify } from 'qs';
import {request} from 'casic-common';
import qs from "querystring";

export async function getAllOrganizations(params) {
  return request(`/gateway/api/organizations/tree?${qs.stringify(params)}`, {
    method: 'GET',
  });
}

export async function pk() {
  return request('/gateway/api/pk', {
    method: 'GET',
  });
}

export async function fakeAccountLogin(params) {
  return request('/gateway/api/authenticate', {
    method: 'POST',
    body: params,
  });
}

export async function fakeMobileLogin(params) {
  return request('/gateway/api/login/mobile', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(payload) {
  return request('/gateway/api/register', {
    method: 'POST',
    body: { ...payload },
  });
}

export async function sendCaptcha(payload) {
  return request('/gateway/sms/api/msg-auth-code/generate', {
    method: 'POST',
    body: { ...payload },
  });
}

export async function fakeLogout() {
  return request('/gateway/api/logout', {
    method: 'GET',
  });
}
