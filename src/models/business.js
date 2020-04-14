import { session as Session } from 'casic-common';
import router from 'umi/router';
import * as service from '../services/business';

export default {
  namespace: 'business',

  state: {},

  subscriptions: {},

  effects: {
    * getCustomersList({ payload }, { select, call, put }) {
      return yield call(service.getCustomersList, payload);
    },

    * getDataList({ payload }, { select, call, put }) {
      return yield call(service.getDataList, payload);
    },

    * addBusiness({ payload }, { select, call, put }) {
      return yield call(service.addBusiness, payload);
    },

    * getBusinessData({ payload }, { select, call, put }) {
      return yield call(service.getBusinessData, payload);
    },

    * categories({ payload }, { select, call, put }) {
      return yield call(service.categories, payload);
    },

    * getProdcutOption({ payload }, { select, call, put }) {
      return yield call(service.getProdcutOption, payload);
    },

    * saveBasicInfo({ payload }, { select, call, put }) {
      return yield call(service.saveBasicInfo, payload);
    },

    * addBusinessProduct({ payload }, { select, call, put }) {
      return yield call(service.addBusinessProduct, payload);
    },

    * editBusinessProduct({ payload }, { select, call, put }) {
      return yield call(service.editBusinessProduct, payload);
    },

    * deleteProduct({ payload }, { select, call, put }) {
      return yield call(service.deleteProduct, payload);
    },

    * addBusinessGjjl({ payload }, { select, call, put }) {
      return yield call(service.addBusinessGjjl, payload);
    },

    * editBusinessGjjl({ payload }, { select, call, put }) {
      return yield call(service.editBusinessGjjl, payload);
    },

    * deleteGjjl({ payload }, { select, call, put }) {
      return yield call(service.deleteGjjl, payload);
    },

    * getPinYin({ payload }, { select, call, put }) {
      return yield call(service.getPinYin, payload);
    },
  },

  reducers: {
    changeState(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
