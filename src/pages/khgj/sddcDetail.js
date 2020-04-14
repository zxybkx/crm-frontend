/**
 * 实地调查记录-基本信息
 */
import React, {Component, Fragment} from 'react';
import {Descriptions, Button} from 'antd';
import {connect} from 'dva';
import moment from 'moment';
import _ from 'lodash';
import {routerRedux} from 'dva/router';
import PageLayout from '@/layouts/PageLayout';
import ProductDetail from './components/ProductDetail';
import GysDetail from './components/GysDetail';
import styles from './index.less';

const DesItem = Descriptions.Item;
@connect(({khgj}) => ( {
  khgj
}))
export default class Jbxx extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      sddcData: {},
    };
  }

  componentDidMount() {
    const {dispatch, location: {query: {id, khgjId}}} = this.props;
    dispatch({
      type: 'khgj/getSddcData',
      payload: {
        id: khgjId
      }
    }).then(({success, data}) => {
      if (success && data) {
        this.setState({
          sddcData: data
        })
      }
    })
  }

  //修改
  edit = () => {
    const {dispatch, location: {query: {id}}} = this.props;
    const {sddcData} = this.state;
    dispatch(
      routerRedux.push({
        pathname: `/khgj/sddc`,
        query: {
          id: sddcData.id,
          customerId: id
        }
      })
    )
  };

  render() {
    const {location: {query: {id}}} = this.props;
    const {sddcData} = this.state;
    const breadcrumbs = [
      {icon: 'home', path: '/'},
      {label: '客户信息', path: '/customer'},
      {label: '客户信息详情', path: `/customer/customerDetail?id=${id}`},
      {label: '客户拜访', path: `/khgj?id=${id}&type=2`},
      {label: '查看实地调查记录'},
    ];
    //拜访人员
    let bfry = [];
    _.find(sddcData.crmKhgjRies, (item) => {
      if (item && item.type === 1) {
        bfry.push(item.userName)
      }
    });

    //接待人员
    let jdry = [];
    _.find(sddcData.crmKhgjRies, (item) => {
      if (item && item.type === 2) {
        jdry.push(item.userName)
      }
    });

    //重要人员
    const zyry = _.find(sddcData.crmKhgjRies, (item) => {
      return item.type === 3
    });

    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.container}>
          <Button type='primary' size="small" icon='edit' onClick={() => this.edit()}
                  style={{marginBottom: '10px'}}>修改</Button>
          <Descriptions title="基础信息" bordered>
            <DesItem label="客户名称">
              <span>{!_.isEmpty(sddcData.customerName) ? sddcData.customerName : '无'}</span>
            </DesItem>
            <DesItem label="拜访时间" span={2}>
              <span>{sddcData && sddcData.gjrq && moment(sddcData.gjrq).format('YYYY-MM-DD') || '无'}</span>
            </DesItem>
            <DesItem label="拜访人员">
              <span>{bfry && _.join(bfry, '、') || '无'}</span>
            </DesItem>
            <DesItem label="接待人员" span={2}>
              <span>{jdry && _.join(jdry, '、') || '无'}</span>
            </DesItem>
            <DesItem label="重要人员">
              <span>{zyry ? zyry.userName : '无'}</span>
            </DesItem>
            <DesItem label="职务">
              <span>{zyry ? zyry.zw : '无'}</span>
            </DesItem>
            <DesItem label="电话">
              <span>{zyry ? zyry.lxdh : '无'}</span>
            </DesItem>
            <DesItem label="客户上游" span={3}>
              <span>{sddcData ? sddcData.khsy : '无'}</span>
            </DesItem>
            <DesItem label="客户下游" span={3}>
              <span>{sddcData ? sddcData.khxy : '无'}</span>
            </DesItem>
          </Descriptions>
          <div style={{marginTop: '20px'}}>
            <span style={{fontWeight: 'bold', color: 'black', fontSize: '16px', lineHight: '1.5', marginTop: '20px'}}>公司产品</span>
          </div>
          <ProductDetail data={sddcData && sddcData.crmSddcGscpdtos}/>
          <div style={{marginTop: '20px'}}>
            <span style={{fontWeight: 'bold', color: 'black', fontSize: '16px', lineHight: '1.5', marginTop: '20px'}}>公司生产及财务(生产情况)</span>
          </div>
          <Descriptions bordered>
            <DesItem label="生产线">
              <span>{sddcData.crmSddcSccwdtos && sddcData.crmSddcSccwdtos.scx || '无'}</span>
            </DesItem>
            <DesItem label="月均产能">
              <span>{sddcData.crmSddcSccwdtos && sddcData.crmSddcSccwdtos.yjcn || '无'}</span>
            </DesItem>
            <DesItem label="年产值">
              <span>{sddcData.crmSddcSccwdtos && sddcData.crmSddcSccwdtos.ncz || '无'}</span>
            </DesItem>
            <DesItem label="采购周期">
              <span>{sddcData.crmSddcSccwdtos && sddcData.crmSddcSccwdtos.cgzq || '无'}</span>
            </DesItem>
            <DesItem label="外发加工情况">
              <span>{sddcData.crmSddcSccwdtos && sddcData.crmSddcSccwdtos.wfjgqk || '无'}</span>
            </DesItem>
            <DesItem label="生产周期">
              <span>{sddcData.crmSddcSccwdtos && sddcData.crmSddcSccwdtos.sczq || '无'}</span>
            </DesItem>
            <DesItem label="销售周期">
              <span>{sddcData.crmSddcSccwdtos && sddcData.crmSddcSccwdtos.xszq || '无'}</span>
            </DesItem>
            <DesItem label="公司水电费情况(年)" span={3}>
              <span>{sddcData.crmSddcSccwdtos && sddcData.crmSddcSccwdtos.gssdf || '无'}</span>
            </DesItem>
          </Descriptions>
          <div style={{marginTop: '20px'}}>
            <span style={{fontWeight: 'bold', color: 'black', fontSize: '16px', lineHight: '1.5', marginTop: '20px'}}>公司生产及财务(财务情况)</span>
          </div>
          <Descriptions bordered>
            <DesItem label="财务人员情况">
              <span>{sddcData.crmSddcSccwdtos && sddcData.crmSddcSccwdtos.cwry || '无'}</span>
            </DesItem>
            <DesItem label="是否处理过函调">
              <span>{sddcData.crmSddcSccwdtos && sddcData.crmSddcSccwdtos.hd || '无'}</span>
            </DesItem>
            <DesItem label="对供应商的管理">
              <span>{sddcData.crmSddcSccwdtos && sddcData.crmSddcSccwdtos.gysgl || '无'}</span>
            </DesItem>
            <DesItem label="与主管税局的交流">
              <span>{sddcData.crmSddcSccwdtos && sddcData.crmSddcSccwdtos.sjjl || '无'}</span>
            </DesItem>
            <DesItem label="其他财务情况">
              <span>{sddcData.crmSddcSccwdtos && sddcData.crmSddcSccwdtos.qt || '无'}</span>
            </DesItem>
          </Descriptions>
          <div style={{marginTop: '20px'}}>
            <span style={{fontWeight: 'bold', color: 'black', fontSize: '16px', lineHight: '1.5', marginTop: '20px'}}>企业供应商</span>
          </div>
          <GysDetail data={sddcData && sddcData.crmSddcQygysdtos}/>
        </div>
      </PageLayout>
    );
  }
}
