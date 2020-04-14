/*
 查看记录
 */
import React, {PureComponent} from 'react';
import {Form, Button, Descriptions} from 'antd';
import {connect} from 'dva';
import moment from 'moment';
import _ from 'lodash';
import LineWrap from '@/components/LineWrap';
import {routerRedux} from 'dva/router';
import styles from './index.less';
import PageLayout from '@/layouts/PageLayout';

@Form.create()
@connect(state => ({
  khgj: state.khgj
}))

export default class Rcgj extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rcgjData: {},
    }
  }

  componentDidMount() {
    const {dispatch, location: {query: {khgjId}}} = this.props;
    if (khgjId) {
      dispatch({
        type: 'khgj/getRcgjData',
        payload: {khgjId}
      }).then(({success, data}) => {
        if (success && data) {
          this.setState({
            rcgjData: data
          })
        }
      })
    }
  }

  toEdit = () => {
    const {dispatch, location: {query: {id, khgjId}}} = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/khgj/xzrc`,
        query: {id, khgjId}
      })
    )
  };

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  render() {
    const {rcgjData} = this.state;
    const {location: {query: {id}}} = this.props;
    const breadcrumbs = [
      {icon: 'home', path: '/customer'},
      {label: '客户信息', path: '/customer'},
      {label: '客户信息详情', path: `/customer/customerDetail?id=${id}`},
      {label: '客户拜访', path: `/khgj?id=${id}&type=1`},
      {label: '查看日常跟进记录'}
    ];

    //客户方重要与会人
    const khfzyyhrObj = _.find(rcgjData.crmKhgjRies, (item) => {
      return item.type === 1
    });

    //我方参与人员
    let wfcyryNames = [];
    _.find(rcgjData.crmKhgjRies, (item) => {
      if (item && item.type === 2) {
        wfcyryNames.push(item.userName)
      }
    });

    //客户方参与人员
    let khfcyryNames = [];
    _.find(rcgjData.crmKhgjRies, (item) => {
      if (item && item.type === 3) {
        khfcyryNames.push(item.userName)
      }
    });

    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.container}>
          <div style={{paddingTop: 10}}>
            <Button type={'primary'}
                    icon={'edit'}
                    size={'small'}
                    style={{marginBottom: 10}}
                    onClick={() => {
                      this.toEdit(rcgjData && rcgjData.id)
                    }}>
              修改
            </Button>
            <Descriptions title="客户拜访记录" bordered>
              <Descriptions.Item label="客户名称">{rcgjData && rcgjData.customerName}</Descriptions.Item>
              <Descriptions.Item label="拜访日期"
                                 span={2}>{rcgjData && rcgjData.gjrq && moment(rcgjData.gjrq).format('YYYY-MM-DD') || '无'}</Descriptions.Item>
              <Descriptions.Item label="客户方重要与会人">{ khfzyyhrObj && khfzyyhrObj.userName || '无'}</Descriptions.Item>
              <Descriptions.Item label="职务" span={2}>{khfzyyhrObj && khfzyyhrObj.zw || '无'}</Descriptions.Item>
              <Descriptions.Item label="我方参与人员">{wfcyryNames && _.join(wfcyryNames, '、') || '无'}</Descriptions.Item>
              <Descriptions.Item label="客户方参与人员"
                                 span={2}>{khfcyryNames && _.join(khfcyryNames, '、') || '无'}</Descriptions.Item>
              <Descriptions.Item label="跟进目的" span={3}>
                <LineWrap title={rcgjData && rcgjData.gjmd || '无'} lineClampNum={1}/>
                </Descriptions.Item>
              <Descriptions.Item label="洽谈情况" span={3}>{rcgjData && rcgjData.qtqk || '无'}</Descriptions.Item>
              <Descriptions.Item label="备注" span={3}>{rcgjData && rcgjData.remark || '无'}</Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </PageLayout>
    )
  }
}
