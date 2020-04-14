import {session as Session} from 'casic-common';
import router from 'umi/router';
import * as service from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    * getCurrentEmployeeDetail(_, {call, put}) {
      return yield call(service.getCurrentEmployeeDetail)
    },

    * fetchCurrent(_, {call, put}) {
      const session = Session.get();
      if (session) {
        yield put({
          type: 'saveCurrentUser',
          payload: Object.assign({}, session, {avatar: session.photo}),
        });
      }else{
        router.push('/passport/sign-in')
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};
