import React, { Suspense } from 'react';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import Media from 'react-media';
import fullLogo from '../../assets/logo-full.png';
import logo from '../../assets/logo.png';
import Header from './Header';
import MenuHeader from './MenuHeader';
import Context from './MenuContext';
import {PageLoading, SiderMenu} from 'casic-common';
import getPageTitle from 'casic-common/src/utils/getPageTitle';
import { menu, title, name } from '../../defaultSettings';
import styles from './index.less';

// lazy load SettingDrawer
const SettingDrawer = React.lazy(() => import('casic-common/src/lib/SettingDrawer'));

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.Component {
  componentDidMount() {
    const {
      location: { pathname },
      dispatch,
      route: { routes, authority },
    } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'setting/getSetting',
    });
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '180px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  renderSettingDrawer = () => {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    if (process.env.NODE_ENV === 'production' && APP_TYPE !== 'site') {
      return null;
    }
    return <SettingDrawer/>;
  };

  renderMobileLayout = () => {
    const {
      children,
      navTheme,
      isMobile,
      menuData,
      fixedHeader,
    } = this.props;

    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};

    return (
      <Layout>
        <Header
          menuData={menuData}
          handleMenuCollapse={this.handleMenuCollapse}
          logo={logo}
          fullLogo={fullLogo}
          isMobile={isMobile}
          {...this.props}
        />
        <SiderMenu
          logo={logo}
          fullLogo={fullLogo}
          theme={navTheme}
          onCollapse={this.handleMenuCollapse}
          menuData={menuData}
          isMobile={isMobile}
          {...this.props}
        />
        <Content className={classNames(styles.content)} style={contentStyle}>
          {children}
        </Content>
      </Layout>
    );
  };

  renderDesktopLayout = () => {
    const {
      navTheme,
      children,
      isMobile,
      menuData,
      fixedHeader,
    } = this.props;

    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};

    return (
      <Layout>
        <SiderMenu
          name={name}
          logo={logo}
          fullLogo={fullLogo}
          theme={navTheme}
          onCollapse={this.handleMenuCollapse}
          menuData={menuData}
          isMobile={isMobile}
          {...this.props}
        />
        <Layout
          style={{
            ...this.getLayoutStyle(),
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            title={title}
            logo={logo}
            fullLogo={fullLogo}
            isMobile={isMobile}
            {...this.props}
          />
          <Content className={classNames(styles.content)} style={contentStyle}>
            {children}
          </Content>
        </Layout>
      </Layout>
    );
  };

  renderDesktopLayoutTop = () => {
    const {
      children,
      isMobile,
      menuData,
      fixedHeader,
    } = this.props;

    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};

    return (
      <Layout>
        <Header
          menuData={menuData}
          handleMenuCollapse={this.handleMenuCollapse}
          title={title}
          logo={logo}
          fullLogo={fullLogo}
          isMobile={isMobile}
          {...this.props}
        />
        <Layout
          style={{
            ...this.getLayoutStyle(),
          }}
        >
          <MenuHeader
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            fullLogo={fullLogo}
            isMobile={isMobile}
            {...this.props}
          />
          <Content className={classNames(styles.content, styles.top)} style={contentStyle}>
            {children}
          </Content>
        </Layout>
      </Layout>
    );
  };

  render() {
    const {
      layout: PropsLayout,
      location: { pathname },
      isMobile,
      breadcrumbNameMap,
    } = this.props;

    const isTop = PropsLayout === 'topmenu';

    let layout = this.renderDesktopLayout();
    if (isTop) {
      layout = this.renderDesktopLayoutTop();
    }
    if (isMobile) {
      layout = this.renderMobileLayout();
    }
    return (
      <React.Fragment>
        <DocumentTitle title={getPageTitle(title, menu, pathname, breadcrumbNameMap)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        <Suspense fallback={<PageLoading/>}>{this.renderSettingDrawer()}</Suspense>
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, menu: menuModel }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile}/>}
  </Media>
));
