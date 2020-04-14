import BasicLayout from './BasicLayout';
import BlankLayout from './BlankLayout';
import UserLayout from './UserLayout';
import _ from 'lodash';
import { layoutConfig } from '@/layouts/config';
import {ConfigProvider} from 'antd';

export default (props) => {

  let layout;

  const { location } = props;
  let { pathname, query } = location;
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  let type = layoutConfig[pathname];
  if (!type) {
    type = _.find(layoutConfig, (v, k) => new RegExp(k).test(pathname));
  }
  if (type) {
    switch (type) {
      case 'blank':
        layout = <BlankLayout {...props} />;
        break;
      case 'user':
        layout = <UserLayout {...props} />;
        break;
      default:
        layout = <BlankLayout {...props} />;
        break;
    }
  } else if (query.q && query.q === 'w') {
    // q=w 内嵌页面 直接渲染
    layout = <BlankLayout {...props} />;
  } else {
    layout = <BasicLayout {...props} />;
  }

  return layout
}
