import React, {PureComponent} from 'react';
import {Form, Button, Descriptions} from 'antd';
import styles from './index.less';
import Shareholder from './shareholder';
import moment from 'moment';
import PageLayout from '@/layouts/PageLayout';
import {routerRedux} from 'dva/router';
import {connect} from 'dva';
import _ from 'lodash';
import Lxr from'./lxr';

const {Item: DesItem} = Descriptions;
@Form.create()
@connect((customer) => ({
  customer
}))

export default class BasicInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      basicInfo: {},
      customerData: {},
      gdData: [],                //股东信息数据
      selectData: {},
      lxrData: [],               //联系人数据
    };
  }

  componentDidMount() {
    const {location: {query: {id}}, dispatch} = this.props;
    dispatch({
      type: 'customer/getAreaOptions',
      payload: {
        parentCode: '',
        parentLevel: '0'
      }
    }).then(({success, data}) => {
      if (success && data) {
        this.setState({
          provinceData: data
        })
      }
    });

    //企业类型选项
    dispatch({
      type: 'customer/getOptions',
    }).then(({success, data}) => {
      if (success && data) {
        this.setState({
          selectData: data
        })
      }
    });

    if (id) {
      dispatch({
        type: 'customer/editCustomer',
        payload: {id: id}
      }).then(({success, data}) => {
        if (success && data) {
          this.setState({
            customerData: data,
            gdData: data.crmCustomerGdxxes,
            lxrData: data.crmCustomerLxrdtos
          })
        }
      })
    }
  };

  edit = () => {
    const {dispatch} = this.props;
    const {customerData} = this.state;
    const path = `/customer/editForm`;
    dispatch(
      routerRedux.push({
        pathname: path,
        query: {
          id: customerData.id,
        }
      })
    )
  };

  render() {
    const {location: {query: {id}}, dispatch} = this.props;
    const {customerData, gdData, selectData, lxrData} = this.state;
    const address = customerData.cs && customerData.cs.replace(/[/]/g, '');
    const zcdz = customerData.zcdzcs && customerData.zcdzcs.replace(/[/]/g, '');
    const qylxItem = _.find(selectData.mdDictionaryItems, item => {
      if (!_.isEmpty(customerData)) {
        return (item.code === 'enterprise_type' && item.itemValue === customerData.extraQylx);
      }
    });
    const shareholder = {
      dispatch,
      gdData,
    };
    const lxr = {
      dispatch,
      lxrData,
    };
    const breadcrumbs = [
      {icon: 'home', path: '/'},
      {label: '客户信息', path: '/customer'},
      {label: '客户信息详情', path: `/customer/customerDetail?id=${id}`},
      {label: '基本信息详情'},
    ];


    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.content}>
          <div className={styles.apply}>
            <Button type='primary' size="small" icon='edit' onClick={() => this.edit()} style={{marginBottom: '10px'}}>修改</Button>
            <div >
              <span>客户名称：</span>
              <span>{!_.isEmpty(customerData.khmc) ? customerData.khmc : '无'}</span>
            </div>
            <div>
              <span>客户性质：</span>
              <span style={{ marginRight: 20}}>{customerData.khxzmc || '无'}</span>
              <span>客户类别：</span>
              <span>{customerData.khlbmc || '无'}</span>
            </div>
            <div style={{marginTop: '20px'}}>
              <span style={{fontWeight: 'bold', color: 'black', fontSize: '16px', lineHight: '1.5', marginTop: '20px'}}>联系人</span>
            </div>
            <Lxr {...lxr}/>
            <Descriptions title="基本信息" bordered style={{marginTop: '20px'}}>
              <DesItem label="企业简称">
                <span>{!_.isEmpty(customerData.khjc) ? customerData.khjc : '无'}</span>
              </DesItem>
              <DesItem label="英文名称">
                <span>{!_.isEmpty(customerData.khywm) ? customerData.khywm : '无'}</span>
              </DesItem>
              <DesItem label="公司网址">
                <span>{!_.isEmpty(customerData.extraGsWz) ? customerData.extraGsWz : '无'}</span>
              </DesItem>
              <DesItem label="企业性质">
                <span>{!_.isEmpty(customerData.extraQyxz) ? customerData.extraQyxz : '无'}</span>
              </DesItem>
              <DesItem label="通讯地址">
                <span>{!address && '无'}</span>
                <span>{address}{customerData && customerData.txdz}</span>
              </DesItem>
            </Descriptions>
            <Descriptions title="工商信息" bordered style={{marginTop: '20px'}}>
              <DesItem label="法人代表">
                <span>{!_.isEmpty(customerData.fddbr) ? customerData.fddbr : '无'}</span>
              </DesItem>
              <DesItem label="注册资本">
                {
                  customerData.extraZczb ?
                    <span>{customerData.extraZczb}</span> : '无'
                }
              </DesItem>
              <DesItem label="统一社会编码">
                <span>{!_.isEmpty(customerData.shxydm) ? customerData.shxydm : '无'}</span>
              </DesItem>
              <DesItem label="成立日期">
                <span>{(customerData && customerData.extraGsClsj) ? moment(customerData.extraGsClsj).format('YYYY-MM-DD') : '无'}</span>
              </DesItem>
              <DesItem label="营业执照注册码">
                <span>{!_.isEmpty(customerData.yyzzZch) ? customerData.yyzzZch : '无'}</span>
              </DesItem>
              <DesItem label="纳税登记号">
                <span>{!_.isEmpty(customerData.nsdjh) ? customerData.nsdjh : '无'}</span>
              </DesItem>
              <DesItem label="组织机构代码">
                <span>{!_.isEmpty(customerData.zzjgdm) ? customerData.zzjgdm : '无'}</span>
              </DesItem>
              <DesItem label="行业">
                <span>{!_.isEmpty(customerData.hylb) ? customerData.hylb : '无'}</span>
              </DesItem>
              <DesItem label="营业执照年审日期">
                <span>{(customerData && customerData.extraYyzzNsrq) ? moment(customerData.extraYyzzNsrq).format('YYYY-MM-DD') : '无'}</span>
              </DesItem>
              <DesItem label="企业类型">
                <span>{qylxItem ? qylxItem.itemName : '无'}</span>
              </DesItem>
              <DesItem label="一般纳税人成立日期">
                <span>{(customerData && customerData.extraYbnsrClsj) ? moment(customerData.extraYbnsrClsj).format('YYYY-MM-DD') : '无'}</span>
              </DesItem>
              <DesItem label="员工人数">
                {
                  customerData.extraYgrs ?
                    <span>{customerData.extraYgrs}{'人'}</span> : '无'
                }
              </DesItem>
              <DesItem label="经营范围">
                <span>{!_.isEmpty(customerData.extraJyfw) ? customerData.extraJyfw : '无'}</span>
              </DesItem>
              <DesItem label="注册地址">
                <span>{!zcdz && '无'}</span>
                <span>{zcdz}{customerData && customerData.extraZcdz}</span>
              </DesItem>
            </Descriptions>
            <div style={{marginTop: '20px'}}>
              <span style={{fontWeight: 'bold', color: 'black', fontSize: '16px', lineHight: '1.5', marginTop: '20px'}}>股东信息</span>
            </div>
            <Shareholder {...shareholder}/>
            <Descriptions title="其他信息" bordered style={{marginTop: '20px', marginBottom: '20px'}}>
              <DesItem label="总经理">
                <span>{!_.isEmpty(customerData.extraZjl) ? customerData.extraZjl : '无'}</span>
              </DesItem>
              <DesItem label="联系电话">
                <span>{!_.isEmpty(customerData.lxdh) ? customerData.lxdh : '无'}</span>
              </DesItem>
              <DesItem label="账户名称">
                <span>{!_.isEmpty(customerData.zhmc) ? customerData.zhmc : '无'}</span>
              </DesItem>
              <DesItem label="账户号码">
                <span>{!_.isEmpty(customerData.zhhm) ? customerData.zhhm : '无'}</span>
              </DesItem>
              <DesItem label="开户银行">
                <span>{!_.isEmpty(customerData.khyhmc) ? customerData.khyhmc : '无'}</span>
              </DesItem>
              <DesItem label="传真">
                <span>{!_.isEmpty(customerData.cz) ? customerData.cz : '无'}</span>
              </DesItem>
              <DesItem label="邮编">
                <span>{!_.isEmpty(customerData.yb) ? customerData.yb : '无'}</span>
              </DesItem>
              <DesItem label="邮箱">
                <span>{!_.isEmpty(customerData.email) ? customerData.email : '无'}</span>
              </DesItem>
              <DesItem label="业务主办人">
                <span>{!_.isEmpty(customerData.extraYwzbr) ? customerData.extraYwzbr : '无'}</span>
              </DesItem>
              <DesItem label="厂房情况">
                <span>{!_.isEmpty(customerData.extraCfqk) ? customerData.extraCfqk : '无'}</span>
              </DesItem>
              <DesItem label="集团战略客户">
                <span>{!_.isEmpty(customerData.sfJtzlkh) ? customerData.sfJtzlkh : '无'}</span>
              </DesItem>
              <DesItem label="客户隶属">
                <span>{!_.isEmpty(customerData.khls) ? customerData.khls : '无'}</span>
              </DesItem>
              <DesItem label="单位类别">
                <span>{!_.isEmpty(customerData.dwlb) ? customerData.dwlb : '无'}</span>
              </DesItem>
              <DesItem label="信用类别">
                <span>{!_.isEmpty(customerData.xylb) ? customerData.xylb : '无'}</span>
              </DesItem>
              <DesItem label="邓氏编码">
                <span>{!_.isEmpty(customerData.dsbm) ? customerData.dsbm : '无'}</span>
              </DesItem>
              <DesItem label="数据密级">
                <span>{!_.isEmpty(customerData.sjmj) ? customerData.sjmj : '无'}</span>
              </DesItem>
              <DesItem label="办公场所或厂房占地面积">
                <span>{!_.isEmpty(customerData.extraZdmj) ? customerData.extraZdmj : '无'}</span>
              </DesItem>
              <DesItem label="主资产否抵押">
                <span>{!_.isEmpty(customerData.extraZyzcSfdy) ? customerData.extraZyzcSfdy : '无'}</span>
              </DesItem>
              <DesItem label="内部客户">
                <span>{!_.isEmpty(customerData.sfNbkh) ? customerData.sfNbkh : '无'}</span>
              </DesItem>
            </Descriptions>
            {
              customerData.sfNbkh === '是' ?
                <div>
                  <div>
                    <span style={{
                      fontWeight: 'bold',
                      color: 'black',
                      fontSize: '16px',
                      lineHight: '1.5',
                      marginTop: '20px'
                    }}>内部客户信息</span>
                  </div>
                  <Descriptions bordered style={{marginBottom: '20px'}}>
                    <DesItem label="所属二级单位">
                      <span>{!_.isEmpty(customerData.lbkhSsejdw) ? customerData.lbkhSsejdw : '无'}</span>
                    </DesItem>
                    <DesItem label="所属三级单位">
                      <span>{!_.isEmpty(customerData.lbkhSssjdw) ? customerData.lbkhSssjdw : '无'}</span>
                    </DesItem>
                    <DesItem label="顺序码">
                      <span>{!_.isEmpty(customerData.lbkhSxm) ? customerData.lbkhSxm : '无'}</span>
                    </DesItem>
                    <DesItem label="机构代码">
                      <span>{!_.isEmpty(customerData.lbkhJgdm) ? customerData.lbkhJgdm : '无'}</span>
                    </DesItem>
                    <DesItem label="是否军品客户">
                      <span>{!_.isEmpty(customerData.lbkhSfJpkh) ? customerData.lbkhSfJpkh : '无'}</span>
                    </DesItem>
                    <DesItem label="其他经营地址">
                      <span>{!_.isEmpty(customerData.extraJydz) ? customerData.extraJydz : '无'}</span>
                    </DesItem>
                  </Descriptions>
                </div>
                : null
            }
          </div>
        </div>
      </PageLayout>
    )
  }
}
