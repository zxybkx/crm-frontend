import { routerRedux } from 'dva/router';
import * as service from '../services/login';
import { reloadAuthorized } from 'casic-common/src/utils/Authorized';
import Session from 'casic-common/src/utils/session';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    departments:[],
  },

  subscriptions: {},

  effects: {
    * getAllOrganizations({payload}, {call, put}) {
      return yield call(service.getAllOrganizations, {...payload});
    },

    *pk({ payload }, { call, put }){
      return yield call(service.pk);
    },

    *login({ payload }, { call, put }) {
      Session.destroy();
      return yield call(service.fakeAccountLogin, payload);
    },

    *logout(_, { call, put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
          },
        });
        yield call(service.fakeLogout);
        Session.destroy();
        reloadAuthorized();
        yield put(routerRedux.push('/passport/sign-in'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
