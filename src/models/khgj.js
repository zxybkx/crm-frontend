import {Session} from 'casic-common';
import router from 'umi/router';
import * as service from '../services/khgj';

export default {
  namespace: 'khgj',

  state: {
    total: 0,
    current: 1,
    pageSize: 10,
    userList: [],
  },

  effects: {
    *getKhgjList({payload}, {select, call, put}) {
      if (payload) {
        payload.page = payload.page ? payload.page : 0;
        payload.size = payload.size ? payload.size : 10;
      }
      const pagination = {
        page: payload.page,
        size: payload.size,
      };

      const {page, data, success} = yield call(service.getKhgjList, pagination, payload);

      if (success) {
        let _payload = {
          userList: data,
          total: page ? page.total : 0,
          current: payload && payload.page ? parseInt(payload.page) + 1 : 1,
          pageSize: payload && payload.size ? parseInt(payload.size) : 10,
          taskQueryCondition: payload,
        };

        yield put({
          type: 'changeState',
          payload: _payload,
        });

        window._latestTaskQueryCondition = payload;
      }
    },

    *getCustomersList({payload}, {select, call, put}) {
      return yield call(service.getCustomersList, payload);
    },

    *saveAddRcgj({payload}, {select, call, put}) {
      return yield call(service.saveAddRcgj, payload);
    },

    *getRcgjData({payload}, {select, call, put}) {
      return yield call(service.getRcgjData, payload);
    },

    *saveEditRcgj({payload}, {select, call, put}) {
      return yield call(service.saveEditRcgj, payload);
    },

    *getKhgjType({payload}, {select, call, put}) {
      return yield call(service.getKhgjType, payload);
    },

    /**
     * (实地调查)基本信息
     * @param payload
     * @param select
     * @param call
     * @param put
     */
      *addSddcJbxx({payload}, {select, call, put}){
      return yield call(service.addSddcJbxx, payload);
    },

    //公司产品查询
    *getProductList({payload}, {select, call, put}) {
      return yield call(service.getComProduct, payload);
    },
    //公司产品批量新增
    *addProduct({payload}, {select, call, put}) {
      return yield call(service.addComProduct, payload);
    },
    //公司产品批量更新
    *editProduct({payload}, {select, call, put}) {
      return yield call(service.editProduct, payload);
    },

    //公司生产及财务新增
    *addGscw({payload}, {select, call, put}) {
      return yield call(service.addGscw, payload);
    },

    //公司生产及财务查询
    *getGscwData({payload}, {select, call, put}) {
      return yield call(service.getGscwData, payload);
    },
    //公司生产及财务更新
    *editGscw({payload}, {select, call, put}) {
      return yield call(service.editGscw, payload);
    },
    //企业供应商查询
    *getGysList({payload}, {select, call, put}) {
      return yield call(service.getGysList, payload);
    },
    //企业供应批量新增
    *addGys({payload}, {select, call, put}) {
      return yield call(service.addGys, payload);
    },
    //企业供应批量更新
    *editGys({payload}, {select, call, put}) {
      return yield call(service.editGys, payload);
    },
    //实地调查全部数据
    *getSddcData({payload}, {select, call, put}) {
        return yield call(service.getSddcData, payload);
    },

    //客户详情新增实地调查其他三个模块
    *saveSddcOntherModal({payload}, {select, call, put}) {
        return yield call(service.saveSddcOntherModal, payload);
    },
  },

  reducers: {
    changeState(state, action) {
      return {...state, ...action.payload};
    },
  },
};
