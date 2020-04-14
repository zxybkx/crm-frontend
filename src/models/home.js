import {Session} from 'casic-common';
import router from 'umi/router';
import * as service from '../services/home';

export default {
  namespace: 'home',

  state: {},

  effects: {
    *getMapData({payload}, {select, call, put}) {
      return yield call(service.getMapData, payload);
    },

    *getCustomerNumber({payload}, {select, call, put}) {
      return yield call(service.getCustomerNumber, payload);
    },

    *getBusinessSpread({payload}, {select, call, put}) {
      return yield call(service.getBusinessSpread, payload);
    },

    *getProductZb({payload}, {select, call, put}) {
      return yield call(service.getProductZb, payload);
    },

    *getOrganization({payload}, {select, call, put}) {
      return yield call(service.getOrganization, payload);
    },

    *getBusinessNumber({payload}, {select, call, put}) {
      return yield call(service.getBusinessNumber, payload);
    },
  },

  reducers: {
    changeState(state, action) {
      return {...state, ...action.payload};
    },
  },
}
