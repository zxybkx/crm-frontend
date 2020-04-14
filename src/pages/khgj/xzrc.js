/**
 新增客户拜访记录
 */
import React, {PureComponent} from 'react';
import {Form, Select, Input, Row, Col, DatePicker, Button, message} from 'antd';
import {connect} from 'dva';
import moment from 'moment';
import _ from 'lodash';
import {routerRedux} from 'dva/router';
import {UserSelector} from 'casic-common';
import styles from './index.less';
import PageLayout from '@/layouts/PageLayout';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

@Form.create()
@connect(state => ({
  customer: state.customer,
  khgj: state.khgj
}))

export default class Rcgj extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      khxx: [],
      rcgjData: {},
      breadcrumbs: []
    }
  }

  componentDidMount() {
    const {dispatch, location: {query: {khgjId, id, add}}} = this.props;
    dispatch({
      type: 'khgj/getCustomersList',
    }).then(({success, data}) => {
      if (success && data) {
        this.setState({
          khxx: data
        })
      }
    });
    if (khgjId && !add) {
      dispatch({
        type: 'khgj/getRcgjData',
        payload: {khgjId}
      }).then(({success, data}) => {
        if (success && data) {
          this.setState({
            rcgjData: data,
            breadcrumbs: [
              {icon: 'home', path: '/customer'},
              {label: '客户信息', path: '/customer'},
              {label: '客户信息详情', path: `/customer/customerDetail?id=${id}`},
              {label: '客户拜访', path: `/khgj?id=${id}&type=1`},
              {label: '修改日常跟进记录'}]
          })
        }
      })
    } else {
      this.setState({
        breadcrumbs: [
          {icon: 'home', path: '/customer'},
          {label: '客户信息', path: '/customer'},
          {label: '客户信息详情', path: `/customer/customerDetail?id=${id}`},
          {label: '客户拜访', path: `/khgj?id=${id}&type=1`},
          {label: '新增日常跟进记录'}]
      })
    }
  }

  onSave = () => {
    const {form: {validateFields}, dispatch, location: {query: {id, add}}} = this.props;
    const {rcgjData} = this.state;

    validateFields((errs, fields) => {
      if (errs) return;

      //客户方重要与会人
      const khfzyyhr = {
        type: 1,
        userName: fields['khfzyyhr'],
        zw: fields['zw']
      };

      //我方参与人员
      let wfcyryArr = [];
      fields.wfcyry && fields.wfcyry.map(o => {
        let wfcyryObj = {};
        _.set(wfcyryObj, 'type', 2);
        _.set(wfcyryObj, 'userName', o.name);
        _.set(wfcyryObj, 'zw', null);
        wfcyryArr.push(wfcyryObj)
      });

      //客户方参与人员
      let khfcyryArr = [];
      fields.khfcyry && fields.khfcyry.map(o => {
        let khfcyryObj = {};
        _.set(khfcyryObj, 'type', 3);
        _.set(khfcyryObj, 'userName', o);
        _.set(khfcyryObj, 'zw', null);
        khfcyryArr.push(khfcyryObj)
      });

      const payload = {
        customerId: id,
        gjrq: fields['gjrq'],
        gjmd: fields['gjmd'],
        qtqk: fields['qtqk'],
        remark: fields['remark'],
        type: '1',
        crmKhgjRies: [
          khfzyyhr, ...wfcyryArr, ...khfcyryArr
        ]
      };
      if (id && !add) {
        //修改保存
        dispatch({
          type: 'khgj/saveEditRcgj',
          payload: {
            ...rcgjData,
            ...payload
          }
        }).then(({success, data}) => {
          if (success && data) {
            message.success('保存成功');
            dispatch(
              routerRedux.push({
                pathname: '/customer/customerDetail',
                query: {id}
              })
            );
          }
        })
      } else {
        //新增保存
        dispatch({
          type: 'khgj/saveAddRcgj',
          payload: payload
        }).then(({success, data}) => {
          if (success && data) {
            message.success('保存成功');
            dispatch(
              routerRedux.push({
                pathname: '/customer/customerDetail',
                query: {id}
              })
            );
          }
        })
      }
    })
  };

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  render() {
    const {form: {getFieldDecorator}, location: {query: {id}}} = this.props;
    const {khxx, rcgjData, breadcrumbs} = this.state;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 10},
      },
    };

    //客户方重要与会人
    const khfzyyhrObj = _.find(rcgjData.crmKhgjRies, (item) => {
      return item.type === 1
    });

    //我方参与人员
    let wfcyryNames = [];
    _.find(rcgjData.crmKhgjRies, (item) => {
      if (item && item.type === 2) {
        let perObj = {};
        _.set(perObj, 'username', item.userName);
        _.set(perObj, 'label', item.userName);
        _.set(perObj, 'name', item.userName);
        _.set(perObj, 'key', item.id);
        wfcyryNames.push(perObj)
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
        <div className={styles.formContent}>
          <div>
            <FormItem label={'客户名称'}{...formItemLayout} className={styles.inputBtm}>
              {getFieldDecorator('gsmc', {
                initialValue: id,
              })(
                <Select style={{width: '100%'}}
                        showSearch
                        disabled
                        getPopupContainer={triggerNode => triggerNode.parentElement}
                        optionFilterProp="children">
                  {
                    khxx && khxx.map((item) => {
                      return (
                        <Option key={item.id}>{item.khmc}</Option>
                      )
                    })
                  }
                </Select>
              )}
            </FormItem>
            <FormItem label={'拜访日期'} {...formItemLayout} className={styles.inputBtm}>
              {getFieldDecorator('gjrq', {
                initialValue: (rcgjData && rcgjData.gjrq && moment(rcgjData.gjrq)) || moment()
              })(
                <DatePicker disabledDate={this.disabledDate}
                            style={{width: '100%'}}/>
              )}
            </FormItem>
            <FormItem label={'客户方重要与会人'} {...formItemLayout} className={styles.inputBtm}>
              {getFieldDecorator('khfzyyhr', {
                initialValue: khfzyyhrObj && khfzyyhrObj.userName,
                rules: [{
                  message: '请输入不包含数字的名称',
                  pattern: new RegExp(/^\D*$/)
                }],
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem label={'职务'} {...formItemLayout} className={styles.inputBtm}>
              {getFieldDecorator('zw', {
                initialValue: khfzyyhrObj && khfzyyhrObj.zw
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem label={'跟进目的'} {...formItemLayout} className={styles.inputBtm}>
              {getFieldDecorator('gjmd', {
                initialValue: rcgjData && rcgjData.gjmd,
                // rules: [{
                //   message: '请输入不包含数字的跟进目的',
                //   pattern: new RegExp(/^\D*$/)
                // }],
              })(
                <TextArea/>
              )}
            </FormItem>
            <FormItem label={'我方参与人员'} {...formItemLayout} className={styles.inputBtm}>
              {getFieldDecorator('wfcyry', {
                initialValue: wfcyryNames && wfcyryNames,
              })(
                <UserSelector multiple clearable />
              )}
            </FormItem>
            <FormItem label={'客户方参与人员'} {...formItemLayout} className={styles.inputBtm}>
              {getFieldDecorator('khfcyry', {
                initialValue: khfcyryNames && khfcyryNames,
                rules: [{
                  message: '请输入不包含数字的名称',
                  pattern: new RegExp(/^\D*$/)
                }],
              })(
                <Select mode="tags" style={{width: '100%'}} getPopupContainer={triggerNode => triggerNode.parentElement}/>
              )}
            </FormItem >
            <FormItem label={'洽谈情况'} {...formItemLayout} className={styles.inputBtm}>
              {getFieldDecorator('qtqk', {
                initialValue: rcgjData && rcgjData.qtqk
              })(
                <TextArea placeholder="洽谈情况"/>
              )}
            </FormItem>
            <FormItem label={'备注'} {...formItemLayout} className={styles.inputBtm}>
              {getFieldDecorator('remark', {
                initialValue: rcgjData && rcgjData.remark
              })(
                <TextArea placeholder="备注"/>
              )}
            </FormItem>
            <Row>
              <Col sx={{span: 24}}>
                <div className={styles.btnGroup}>
                  <Button icon={'save'}
                          size={'small'}
                          type={'primary'}
                          onClick={() => {
                            this.onSave()
                          }}>
                    保存
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </PageLayout>
    )
  }
}
