import React, { PureComponent } from 'react';
import { Row, Col, message } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import PageLayout from '@/layouts/PageLayout';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import Customer from './Component/Customer';
import BusinessSpread from './Component/BusinessSpread';
import ProductZb from './Component/ProductZb';
import Organization from './Component/Organization';
import BusinessNumber from './Component/BusinessNumber';
import styles from './index.less';

const breadcrumbs = [
  { icon: 'home', path: '/' },
  { label: '首页', path: './' },
];
@connect((state) => ({
  home: state.home,
}))
export default class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      country: 'china',
      data: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getMapData',
    }).then(({ success, data, message }) => {
      if (success && data) {
        this.setState({ data });
      } else {
        message.error(message);
      }
    });
  }

  componentWillMount() {
    echarts.registerMap('china', require('../../data/map/china.json'));
  }

  render() {
    const { data } = this.state;
    let otherCity = require('../../data/map/mapdata.json');
    const totalData = _.concat(data, otherCity);

    const headMapOption = {
      title: {
        text: '客户地区分布',
        left: 'left',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>总数：{c}',
      },
      visualMap: {
        min: 0,
        max: 10,
        text: ['数量'],
        realtime: false,
        calculable: true,
        // orient: 'horizontal',
        inRange: {
          color: ['#eeeeee', '#0071BC'],
        },
      },
      series: [{
        type: 'map',
        roam: true,
        mapType: 'china',
        itemStyle: {
          normal: { label: { show: false } },
          emphasis: { label: { show: true } },
        },
        data: totalData,
      }],
    };

    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.content}>
          <Row gutter={16}>
            <Col span={14}>
              <Row className={styles.left1}>
                <Col span={24} className={styles.map}>
                  <ReactEcharts
                    style={{ height: '100%' }}
                    notMerge={true}
                    option={headMapOption}
                    ref='map'/>
                </Col>
              </Row>
              <Row className={styles.left2} gutter={30}>
                <Col span={12} className={styles.product}>
                  <ProductZb/>
                </Col>
                <Col span={12} className={styles.org}>
                  <Organization/>
                </Col>
              </Row>
            </Col>
            <Col span={10}>
              <Row className={styles.card1}>
                <Col span={24} className={styles.customer}>
                  <Customer/>
                </Col>
              </Row>
              <Row className={styles.card2}>
                <Col span={24} className={styles.sjfb}>
                  <BusinessSpread/>
                </Col>
              </Row>
              <Row className={styles.card3}>
                <Col span={24} className={styles.sjsl}>
                  <BusinessNumber/>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </PageLayout>
    );
  }
}
