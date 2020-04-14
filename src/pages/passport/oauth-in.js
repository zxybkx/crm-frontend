import { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import jwt from 'jsonwebtoken';
import { session as Session } from 'casic-common';
import PageLoading from '@/lib/PageLoading';
import { reloadAuthorized } from 'casic-common/src/utils/Authorized';

@connect()
export default class OauthInIn extends PureComponent {

  componentDidMount() {
    const { dispatch, location: { query } } = this.props;
    const { _k } = query;

    if (!_k) {
      dispatch(routerRedux.push('/403'));
      return false;
    }

    const decoded = jwt.decode(_k);
    if (decoded) {
      const { auth, name, username, gh } = decoded;
      let user = { name, username, gh, roles: auth.split(','), access_token: _k };
      Session.init(user);
      dispatch({
        type: 'user/getCurrentEmployeeDetail',
      }).then(({ data, success }) => {
        if (success) {
          user = Object.assign({}, user, data);
          Session.init(user);
        }
      });
      dispatch({
        type: 'user/fetchCurrent',
      });
      reloadAuthorized();
      const { back_url } = query;
      if (_.isEmpty(back_url)) {
        dispatch(routerRedux.push({
          pathname: '/',
          query,
        }));
      } else {
        dispatch(routerRedux.push({
          pathname: back_url,
          query,
        }));
      }
    }
  }

  render() {
    return <PageLoading/>;
  }
}
