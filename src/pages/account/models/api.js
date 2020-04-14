import * as service from '../services/api';

export default {
  namespace: 'api',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *changePassword({payload}, { call, put }) {
      return yield call(service.changePassword, payload);
    },
  },

  reducers: {
  },
};
