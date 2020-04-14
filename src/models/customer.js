import { Session } from 'casic-common';
import router from 'umi/router';
import * as service from '../services/customer';

export default {
  namespace: 'customer',

  state: {
    total: 0,
    current: 1,
    pageSize: 10,
    userList: [],
  },

  effects: {
    * getCustomersList({ payload }, { select, call, put }) {
      if (payload) {
        payload.page = payload.page ? payload.page : 0;
        payload.size = payload.size ? payload.size : 10;
      }
      const pagination = {
        page: payload.page,
        size: payload.size,
      };

      const { page, data, success } = yield call(service.getCustomersList, pagination, payload);

      if (success) {
        let _payload = {
          userList: data,
          total: page ? page.total : 0,
          current: payload && payload.page ? parseInt(payload.page) + 1 : 1,
          pageSize: payload && payload.size ? parseInt(payload.size) : 10,
          //taskQueryCondition: payload,
        };

        yield put({
          type: 'changeState',
          payload: _payload,
        });

        //window._latestTaskQueryCondition = payload;
      }
    },

    * saveAddCustomer({ payload }, { select, call, put }) {
      return yield call(service.saveAddCustomer, payload);
    },

    * saveEditCustomer({ payload }, { select, call, put }) {
      return yield call(service.saveEditCustomer, payload);
    },

    * addCustomerGdxx({ payload }, { select, call, put }) {
      return yield call(service.addCustomerGdxx, payload);
    },

    * getCustomerGdxx({ payload }, { select, call, put }) {
      return yield call(service.getCustomerGdxx, payload);
    },

    * editCustomerGdxx({ payload }, { select, call, put }) {
      return yield call(service.editCustomerGdxx, payload);
    },

    * deleteCustomerGd({ payload }, { select, call, put }) {
      return yield call(service.deleteCustomerGd, payload);
    },

    * editCustomer({ payload }, { select, call, put }) {
      return yield call(service.editCustomer, payload);
    },

    * validateKhmc({ payload }, { select, call, put }) {
      return yield call(service.validateKhmc, payload);
    },

    * changeKhzt({ payload }, { select, call, put }) {
      return yield call(service.changeKhzt, payload);
    },

    * getOptions({ payload }, { select, call, put }) {
      return yield call(service.getOptions, payload);
    },

    * getAreaOptions({ payload }, { select, call, put }) {
      return yield call(service.getAreaOptions, payload);
    },

    * detailInfo({ payload }, { select, call, put }) {
      return yield call(service.detailInfo, payload);
    },

    * getKhzzOptions({ payload }, { select, call, put }) {
      return yield call(service.getKhzzOptions, payload);
    },

    * getKhxxFromName({ payload }, { select, call, put }) {
      return yield call(service.getKhxxFromName, payload);
    },

    * getKhbm({ payload }, { select, call, put }) {
      return yield call(service.getKhbm, payload);
    },

    *getKhlbOptions({ payload }, { select, call, put }) {
      return yield call(service.getKhlbOptions, payload);
    },
  }
  ,

  reducers: {
    changeState(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
