import React, { PureComponent } from 'react';
import { Descriptions, Button, message, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import PageLayout from '@/layouts/PageLayout';
import styles from './index.less';
import _ from 'lodash';

const breadcrumbs = [
  { icon: 'home', path: '/' },
  { label: '产品管理', path: '/product' },
  { label: '查看' },
];
@connect((state) => ({
  product: state.product,
}))
export default class Detail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      visible: false,
      currentImg: {},
      deployData: []
    };
  }

  componentDidMount() {
    const { location: { query: { id } }, dispatch } = this.props;
    dispatch({
      type: 'product/checkProduct',
      payload: { id },
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          data,
        });
      } else {
        message.error('数据获取失败');
      }
    });

    //获取配置数据
    dispatch({
      type: 'product/deployData',
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          deployData: data,
        });
      }
    });
  }

  edit = () => {
    const { dispatch, location: { query: { id } } } = this.props;
    dispatch(
      routerRedux.push({
        pathname: 'add',
        query: { id },
      }),
    );
  };

  showImg = (item) => {
    this.setState({
      visible: true,
      currentImg: item,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { data, visible, currentImg, deployData } = this.state;
    let photos = [];
    data.fileList && data.fileList.map((item) => {
      let _item = {};
      _.set(_item, 'id', item.fileId);
      _.set(_item, 'name', item.fileName);
      _.set(_item, 'url', `/gateway/fileservice/api/file/view/${item.fileId}`);
      photos.push(_item);
    });

    // 产品类型
    const type = _.filter(deployData, item => item.categoryName === 'cp-lx');
    const _type = type && _.find(type, item => item.useName === data.type);
    // 计量单位
    const unit = _.filter(deployData, item => item.categoryName === 'cp-jldw');
    const _unit = unit && _.find(unit, item => item.useName === data.jldw);
    // 产品状态
    const state = _.filter(deployData, item => item.categoryName === 'cp-zt');
    const _state = state && _.find(state, item => item.useName === data.zt);
    return (
      <PageLayout breadcrumb={breadcrumbs} className={styles.default}>
        <div className={styles.content}>
          <div className={styles.prodMain}>
            <Button type='primary' size="small" icon='edit' onClick={() => this.edit()}
                    style={{ marginBottom: '10px' }}>修改</Button>
            <Descriptions bordered style={{ marginBottom: '20px' }}>
              <Descriptions.Item label='所属单位'>
                {data.dwmc && data.dwmc || '无'}
              </Descriptions.Item>
              <Descriptions.Item label='产品类型'>
                <span>{_type && _type.name || '无'}</span>
              </Descriptions.Item>
              <Descriptions.Item label='产品名称'>
                <span>{data && data.cpmc || '无'}</span>
              </Descriptions.Item>
              <Descriptions.Item label="单价(元)">
                <span>{data && data.dj || '无'}</span>
              </Descriptions.Item>
              <Descriptions.Item label="库存数量">
                <span>{data && data.kcsl || '无'}</span>
              </Descriptions.Item>
              <Descriptions.Item label="计量单位">
                <span>{_unit && _unit.name || '无'}</span>
              </Descriptions.Item>
              <Descriptions.Item label="供应周期(天)">
                <span>{data && data.gyzq || '无'}</span>
              </Descriptions.Item>
              <Descriptions.Item label="折扣(折)">
                <span>{data && data.zk || '无'}</span>
              </Descriptions.Item>
              <Descriptions.Item label="折扣条件">
                <span>{data && data.zktj || '无'}</span>
              </Descriptions.Item>
              <Descriptions.Item span={3} label="产品状态">
                <span>{_state && _state.name || '无'}</span>
              </Descriptions.Item>
              <Descriptions.Item span={3} style={{ background: 'red' }} label="图片">
                {photos.length > 0 ?
                  photos.map((item, i) => {
                    return (
                      <img src={item.url} key={i} height={'100'} width={'100'} style={{ marginRight: 10, cursor: 'pointer' }}
                           onClick={() => this.showImg(item)}/>
                    );
                  }) : '无'}
              </Descriptions.Item>
              <Descriptions.Item span={3} label="产品概述">
                <div className={data.cpgs && styles.textAreaSty}>
                  <span>{data && data.cpgs || '无'}</span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item span={3} label="功能说明">
                <div className={data.cpgs && styles.textAreaSty}>
                  <span>{data && data.gnsm || '无'}</span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item span={3} label="备注">
                <div className={data.cpgs && styles.textAreaSty}>
                  <span>{data && data.bz || '无'}</span>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
        <Modal title={'产品图片'}
               visible={visible}
               footer={null}
               onOk={this.handleOk}
               onCancel={this.handleOk}>
          <img src={currentImg.url} width={'100%'} height={'100%'}/>
        </Modal>
      </PageLayout>
    );
  }
}
