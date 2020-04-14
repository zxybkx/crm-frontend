import { PureComponent } from 'react';
import PageLayout from '@/layouts/PageLayout';
import {Alert} from  'antd';

const breadcrumbs = [
  { icon: 'home', path: '/' },
  { label: '个人设置', path: '/account/settings' },
  { label: '基础设置' },
];
export default class Messages extends PureComponent{

  render() {
    return (
      <PageLayout breadcrumb={breadcrumbs}>
        <Alert message="正在建设中，敬请期待" type="info" showIcon/>
      </PageLayout>
    );
  }
}

