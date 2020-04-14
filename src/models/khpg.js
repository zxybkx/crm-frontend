import {Session} from 'casic-common';
import router from 'umi/router';
import * as service from '../services/khpg';

export default {
  namespace: 'khpg',

  state: {
    total: 0,
    current: 1,
    pageSize: 10,
    userList: [],
  },

  effects: {
    *getKhpgList({payload}, {select, call, put}) {
      if (payload) {
        payload.page = payload.page ? payload.page : 0;
        payload.size = payload.size ? payload.size : 10;
      }
      const pagination = {
        page: payload.page,
        size: payload.size,
      };

      const {page, data, success} = yield call(service.getKhpgList, pagination, payload);

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

    *getZhpgRules({payload}, {select, call, put}) {
      return yield call(service.getZhpgRules, payload);
    },

    *saveAddZhpg({payload}, {select, call, put}) {
      return yield call(service.saveAddZhpg, payload);
    },

    *getZhpgData({payload}, {select, call, put}) {
      return yield call(service.getZhpgData, payload);
    },

    *saveModifyZhpg({payload}, {select, call, put}) {
      return yield call(service.saveModifyZhpg, payload);
    },

    *getFxpgRules({payload}, {select, call, put}) {
      return yield call(service.getFxpgRules, payload);
    },

    *getFxpgData({payload}, {select, call, put}) {
      return yield call(service.getFxpgData, payload);
    },

    *addFxpgSave({payload}, {select, call, put}) {
      return yield call(service.addFxpgSave, payload);
    },

    *editFxpgSave({payload}, {select, call, put}) {
      return yield call(service.editFxpgSave, payload);
    },

    *getkhzzRules({payload}, {select, call, put}) {
      return yield call(service.getkhzzRules, payload);
    },

    *saveAddkhzz({payload}, {select, call, put}) {
      return yield call(service.saveAddkhzz, payload);
    },

    *getKhzzData({payload}, {select, call, put}) {
      return yield call(service.getKhzzData, payload);
    },

    *saveEditkhzz({payload}, {select, call, put}) {
      return yield call(service.saveEditkhzz, payload);
    },

    *getPgbType({payload}, {select, call, put}) {
      return yield call(service.getPgbType, payload);
    },

    *getPgbList({payload}, {select, call, put}) {
      return yield call(service.getPgbList, payload);
    },

    *addTemplate({payload}, {select, call, put}) {
      return yield call(service.addTemplate, payload);
    },

    *editTemplate({payload}, {select, call, put}) {
      return yield call(service.editTemplate, payload)
    },

    *editSave({payload}, {select, call, put}) {
      return yield call(service.editSave, payload)
    },

    //新增实地调研评估
    *addSddy({payload}, {select, call, put}) {
      return yield call(service.addSddy, payload);
    },

    *getSddy({payload}, {select, call, put}) {
      return yield call(service.getSddy, payload);
    },

    *editSddy({payload}, {select, call, put}) {
      return yield call(service.editSddy, payload);
    },

    *getSddyTableData({payload}, {select, call, put}) {
      return yield call(service.getSddyTableData, payload);
    },

  },

  reducers: {
    changeState(state, action) {
      return {...state, ...action.payload};
    },
  },
};
