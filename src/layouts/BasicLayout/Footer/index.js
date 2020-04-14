import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import {GlobalFooter} from 'casic-common';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2018
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
