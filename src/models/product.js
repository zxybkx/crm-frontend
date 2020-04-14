import {session as Session} from 'casic-common';
import router from 'umi/router';
import * as service from '../services/product';

export default {
  namespace: 'product',

  state: {},

  subscriptions: {},

  effects: {
    *addProduct({payload},{select, call, put}) {
      return yield call(service.addProduct, payload);
    },

    *checkProduct({payload}, {select, call, put}) {
      return yield call(service.checkProduct, payload);
    },

    *editProduct({payload}, {select, call, put}) {
      return yield call(service.editProduct, payload);
    },

    *getDataList({payload}, {select, call, put}) {
      return yield call(service.getDataList, payload);
    },

    *deployData({payload}, {select, call, put}) {
      return yield call(service.deployData, payload);
    },

    *deleteData({payload}, {select, call, put}) {
      return yield call(service.deleteData, payload);
    },

    *getPinYin({payload}, {select,call, put}) {
      return yield call(service.getPinYin, payload);
    },
  },

  reducers: {
    changeState(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
