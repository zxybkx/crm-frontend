// import Session from '@/utils/session';
// import router from 'umi/router';
import * as service from '../services/lxr';

export default {
  namespace: 'lxr',

  state: {
    // total: 0,
    // current: 1,
    // pageSize: 10,
    // lxrList: [],
  },

  effects: {
    *getLxrList({payload}, {select, call, put}) {
      return yield call(service.getLxrList, payload);
    },

    *addLxr({payload}, {select, call, put}) {
      return yield call(service.addLxr, payload);
    },

    *modifyLxr({payload}, {select, call, put}) {
      return yield call(service.modifyLxr, payload);
    },

    *deleteLxr({payload}, {select, call, put}) {
      return yield call(service.deleteLxr, payload);
    },

    *getLxrListById({payload}, {select, call, put}) {
      return yield call(service.getLxrListById, payload);
    },
// 条件查询联系人信息条数
    *getLxrCount({payload}, {select, call, put}) {
      return yield call(service.getLxrCount, payload);
    },
   // 软删除联系人信息
    *deleteLxrSoft({payload}, {select, call, put}) {
      return yield call(service.deleteLxrSoft, payload);
    },
    // 根据ID查询联系人详情信息
    *getLxrDetails({payload}, {select, call, put}) {
      return yield call(service.getLxrDetails, payload);
    },
  }
  ,

  reducers: {
    changeState(state, action) {
      return {...state, ...action.payload};
    },
  },
};
