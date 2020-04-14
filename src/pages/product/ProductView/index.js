import React, { PureComponent } from 'react';
import { Input, Modal, Col, Row, Card, Switch, Divider, Icon } from 'antd';
import { connect } from 'dva';
import LineWrap from '@/components/LineWrap';
import _ from 'lodash';
import styles from './index.less';

const { Meta } = Card;
const {Search} = Input;
@connect((state) => ({
  product: state.product,
  loading: state.loading.effects['product/getDataList'],
}))
export default class ProductView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentRecord: {},
      imgVisible: false,
      currentImg: {},
    };
  }

  showDetail = (record) => {
    this.setState({
      visible: true,
      currentRecord: record,
    });
  };

  onCancel = () => {
    this.setState({
      visible: false,
    });
  };

  showImg = (item) => {
    this.setState({
      imgVisible: true,
      currentImg: item,
    });
  };

  handleOk = () => {
    this.setState({
      imgVisible: false,
    });
  };

  changePhoto = (item, idx) => {
    const {data} = this.props;
    const _data = _.cloneDeepWith(data);
    const index = _.findIndex(_data, i => i.id === item.id);
    _.set(_data[index], 'photoIndex', idx);
    this.props.changeData(_data)
  };

  onSearch = (value) => {
    const conditions = {name: value};
    this.props.onSearch(conditions, false)
  };

  onClick = (solu, value) => {
    const conditions = {[solu]: value};
    this.props.onSearch(conditions, true)
  };

  reset = () => {
    this.props.onSearch({},true)
  };

  render() {
    const { data, cpzt, type } = this.props;
    const { visible, currentRecord, imgVisible, currentImg } = this.state;
    // 产品类型
    const _type = type && _.find(type, item => item.useName === currentRecord.type);
    // 产品状态
    const _state = cpzt && _.find(cpzt, item => item.useName === currentRecord.zt);
    let photos = [];
    currentRecord.fileList && currentRecord.fileList.map((item) => {
      let _item = {};
      _.set(_item, 'id', item.fileId);
      _.set(_item, 'name', item.fileName);
      _.set(_item, 'url', `/gateway/fileservice/api/file/view/${item.fileId}`);
      photos.push(_item);
    });

    return (
      <div className={styles.contain}>
        <div className={styles.search}>
          <Search
            addonBefore={<a onClick={this.reset}><Icon type="sync" /></a>}
            allowClear
            placeholder={'产品名称/创建人'}
            enterButton='搜索'
            onSearch={this.onSearch}/>
        </div>
        <Switch
          className={styles.switch}
          checkedChildren='列表'
          unCheckedChildren='视图'
          onChange={this.props.onChange}/>
          <div>
            <ul className={styles.solution}>
              <li>
                <a onClick={() => this.onClick('type',1)}>数码</a>
              </li>
              <Divider type='vertical'/>
              <li>
                <a onClick={() => this.onClick('type',2)}>家电</a>
              </li>
              <Divider type='vertical'/>
              <li>
                <a onClick={() => this.onClick('state',1)}>上架</a>
              </li>
              <Divider type='vertical'/>
              <li>
                <a onClick={() => this.onClick('state',2)}>下架</a>
              </li>
            </ul>
          </div>
        <Divider/>
        <div className={styles.content}>
          <Row>
            {
              data.map(item => {
                const index = item.photoIndex ? item.photoIndex : 0;
                const url = item.fileList.length > 0 ? `/gateway/fileservice/api/file/view/${item.fileList[index].fileId}` : `/gateway/fileservice/api/file/view/5d82f2f0a1d43e01417a3a8f`;
                const des = (
                  <div>
                    <span>{item.cpmc}</span>&nbsp;&nbsp;&nbsp;
                    <span>{item.cpgs && item.cpgs}</span>
                  </div>
                );
                // 产品状态
                const _state = cpzt && _.find(cpzt, i => i.useName === item.zt);
                const title = (
                  <div className={styles.smallphoto}>
                    {
                      item.fileList.length > 0 ?
                        _.map(item.fileList, (i, idx) => {
                          const url = `/gateway/fileservice/api/file/view/${i.fileId}`;
                          return (
                            <img src={url} className={styles.photo} style={{border: (idx === 0 && !item.photoIndex) && '1px solid red'  }} onMouseOver={() => this.changePhoto(item, idx)}/>
                          );
                        }) :
                        <img className={styles.photo}
                             src={`/gateway/fileservice/api/file/view/5d82f2f0a1d43e01417a3a8f`}/>
                    }
                  </div>
                );
                const content = (
                  <div>
                    <p>所属单位：{item.dwmc || '无'}</p>
                    <p>单价(元)：{item.dj || '无'}</p>
                    <p>库存：{item.kcsl || '无'}</p>
                    <p>折扣(折)：{item.zk || '无'}</p>
                    <p>产品状态：{_state && _state.name || '无'}</p>
                  </div>
                );
                return (
                  <Col span={6}>
                    <Card
                      bodyStyle={{padding: '6px'}}
                      bordered={false}
                      onClick={() => this.showDetail(item)}
                      hoverable
                      cover={<img src={url} width={'416'} height={'234'} style={{ padding: '10px' }}/>}
                    >
                      <div>
                        {title}
                        <p className={styles.money}>{item.dj ? ('￥' + item.dj) : '￥暂无'}</p>
                        <span className={styles.org}>{item.dwmc}</span><br/>
                        <LineWrap title={des} lineClampNum={1}/>
                      </div>
                    </Card>
                  </Col>
                );
              })
            }
          </Row>
        </div>
        <Modal
          title={currentRecord.cpmc}
          visible={visible}
          onCancel={this.onCancel}
          footer={null}>
          <p>所属单位：{currentRecord.dwmc}</p>
          <p>产品类型：{_type && _type.name}</p>
          <p>产品名称：{currentRecord.cpmc}</p>
          <p>单价(元)：{currentRecord.dj || '无'}</p>
          <p>
            图片：
            {photos.length > 0 ?
              photos.map((item, i) => {
                return (
                  <img src={item.url} key={i} height={'50'} width={'50'} style={{ marginRight: 10, cursor: 'pointer' }}
                       onClick={() => this.showImg(item)}/>
                );
              }) : '无'}
          </p>
          <p>库存数量：{currentRecord.kcsl || '无'}</p>
          <p>供应周期(天)：{currentRecord.gyzq || '无'}</p>
          <p>折扣(折)：{currentRecord.zk || '无'}</p>
          <p>折扣条件：{currentRecord.zktj || '无'}</p>
          <p>产品状态：{_state && _state.name || '无'}</p>
          <p>产品概述：{currentRecord.cpgs || '无'}</p>
          <p>功能说明：{currentRecord.gnsm || '无'}</p>
          <p>备注：{currentRecord.bz || '无'}</p>
        </Modal>
        <Modal title={currentRecord.cpmc}
               visible={imgVisible}
               footer={null}
               onCancel={this.handleOk}>
          <img src={currentImg.url} width={'100%'} height={'100%'}/>
        </Modal>
      </div>
    );
  }
}
