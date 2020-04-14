import React, { PureComponent } from 'react';
import PageLayout from '@/layouts/PageLayout';
import PointList from './PointList';
import SetList from './SetList';
import {Tabs} from 'antd';
import styles from './index.less';

const breadcrumbs = [
  { icon: 'home', path: '/' },
  { label: '系统管理', path: '/setting' },
  { label: '评分表' },
];
const {TabPane} = Tabs;
export default class KhpgList extends PureComponent {

  render() {
    return (
      <PageLayout breadcrumb={breadcrumbs}>
        <div className={styles.content}>
          <div className={styles.apply}>
            <Tabs defaultActiveKey='1'>
              <TabPane tab='配置列表' key='1'>
                <SetList/>
              </TabPane>
              <TabPane tab='评分列表' key='2'>
                <PointList/>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </PageLayout>
    );
  }
}
