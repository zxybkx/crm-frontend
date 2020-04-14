import { session as Session } from 'casic-common';
import router from 'umi/router';
import * as service from '../services/agreement';

export default {
  namespace: 'agreement',

  state: {},

  subscriptions: {},

  effects: {
    * getDataLIst({ payload }, { select, call, put }) {
      return yield call(service.getDataLIst, payload);
    },
  },

  reducers: {
    changeState(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
