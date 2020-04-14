import React, { PureComponent } from 'react';
import {
  Layout,
} from 'antd';
import styles from './_layout.less';
import { SiderMenu } from 'casic-common';

const { Content } = Layout;

export default class Index extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  render() {
    const { children, ...rest } = this.props;
    const menuData = [
      {
        icon: 'user',
        name: '我的信息',
        path: '/account/center/base',
        order: 1,
      },
    ];

    return (
      <Layout className={styles.default}>
        <SiderMenu showLogo={false}
                   onCollapse={() => {
                   }}
                   menuData={menuData}
                   {...rest}
                   hideTrigger/>
        <Content>
          {children}
        </Content>
      </Layout>
    );
  }
}



