import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import {GlobalFooter} from 'casic-common';
import DocumentTitle from 'react-document-title';
import styles from './index.less';
import logo from '../../assets/logo.png';
import getPageTitle from 'casic-common/src/utils/getPageTitle';
import {menu, title} from '../../defaultSettings';
import { STATIC_CONTEXT } from '../../constant';

const links = [];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright"/> 2019 深圳航天工业技术研究院
  </Fragment>
);

class UserLayout extends Component {
  componentDidMount() {
    this.initVideo()
  }

  initVideo = () => {
    const bv = new Bideo();
    bv.init({
      // Video元素
      videoEl: document.querySelector('#background_video'),
      container: document.querySelector('body'),
      resize: true,
      // autoplay: false,
      isMobile: window.matchMedia('(max-width: 768px)').matches,
      // playButton: document.querySelector('#play'),
      // pauseButton: document.querySelector('#pause'),
      // 加载视频源, 根据实际业务更换自己的视频源文件
      src: [
        {
          src: `${STATIC_CONTEXT}/v/login.mp4`,
          type: 'video/mp4'
        }
      ],
      onLoad: function () {
        document.querySelector('#video_cover').style.display = 'none';
      }
    });
  }

  render() {
    const {
      children,
      location: { pathname },
      breadcrumbNameMap,
    } = this.props;
    return (
      <DocumentTitle title={getPageTitle(title, menu, pathname, breadcrumbNameMap)}>
        <div className={styles.container}>
          <video className={styles.video} loop muted id='background_video'></video>
          <div className={styles.videoCover} id='video_cover'></div>
          <div className={styles.overlay}></div>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <img alt="logo" className={styles.logo} src={logo}/>
                <span className={styles.title}>深圳航天工业技术研究院</span>
              </div>
              <div className={styles.desc}>数字工研院</div>
            </div>
            {children}
          </div>
          <GlobalFooter links={links} copyright={copyright} className={styles.foot} style={{color: '#666'}}/>
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
}))(UserLayout);
