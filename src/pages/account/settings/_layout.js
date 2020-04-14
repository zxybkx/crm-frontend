import React, { PureComponent } from 'react';
import {
  Layout
} from 'antd';
import styles from './_layout.less';
import {SiderMenu} from 'casic-common';

const { Content } = Layout;

export default class Index extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  render() {
    const { children } = this.props;
    const menuData = [
      // {
      //   icon: 'bars',
      //   name: '基础设置',
      //   path: '/account/settings/base',
      // },
      {
        icon: 'bars',
        name: '安全设置',
        path: '/account/settings/security',
      },{
        icon: 'bars',
        name: '新消息通知',
        path: '/account/settings/message',
      }
    ];

    return (
      <Layout className={styles.default}>
        <SiderMenu showLogo={false}
          onCollapse={() => {}}
          menuData={menuData}
          {...this.props}/>
        <Content>
          {children}
        </Content>
      </Layout>
    );
  }
}



