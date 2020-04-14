/**
 新增客户拜访记录
 */
import React, {PureComponent} from 'react';
import {Form, Select, Input, Row, Col, DatePicker, Button, message, Modal} from 'antd';
import {connect} from 'dva';
import moment from 'moment';
import _ from 'lodash';
import {routerRedux} from 'dva/router';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

@Form.create()
@connect(state => ({
  customer: state.customer,
  khgj: state.khgj
}))

export default class Rcgj extends PureComponent {
  handleOk = () => {
    const {form: {validateFields, resetFields}} = this.props;
    validateFields((err, values) => {
      if (err) return;
      this.props.addRcgj && this.props.addRcgj(values);
      resetFields();
    });
  };

  handleCancel = () => {
    const {form: {resetFields}} = this.props;
    this.props.onCancel();
    resetFields();
  };

  onSave = () => {
    const {form: {validateFields}, dispatch, location: {query: {id}}} = this.props;
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
        _.set(wfcyryObj, 'userName', o);
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
        customerId: fields['gsmc'],
        gjrq: fields['gjrq'],
        gjmd: fields['gjmd'],
        qtqk: fields['qtqk'],
        remark: fields['remark'],
        type: '1',
        crmKhgjRies: [
          khfzyyhr, ...wfcyryArr, ...khfcyryArr
        ]
      };
      if (id) {
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
                pathname: '/khgj/ckjl',
                query: {
                  id: data.id,
                }
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
                pathname: '/khgj/ckjl',
                query: {
                  id: data.id,
                }
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

  jumpRcgj = () => {
    const {dispatch, id} = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/khgj/xzrc',
        query: {
          id,
          add: true
        }
      })
    )
  };

  render() {
    const {visible, title, form: {getFieldDecorator}, khmc} = this.props;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 16},
    };
    return (
      <Modal title={title}
             visible={visible}
             maskClosable={false}
             onCancel={this.handleCancel}
             footer={[
               <Button size='small' type='primary' onClick={this.jumpRcgj}>填写完整记录</Button>,
               <Button size='small' type='primary' onClick={this.handleOk}>确定</Button>,
               <Button size='small' onClick={this.handleCancel}>取消</Button>,
             ]}>
          <Form>
            <Row>
              <Col span={24}>
                <FormItem label="客户" {...formItemLayout}>
                  {getFieldDecorator('gsmc', {
                  })(
                    <span>{khmc}</span>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label='时间' {...formItemLayout}>
                  {getFieldDecorator('gjrq', {
                    initialValue: moment()
                  })(
                    <DatePicker disabledDate={this.disabledDate}
                                style={{width: '100%'}}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label={'跟进目的'} {...formItemLayout}>
                  {getFieldDecorator('gjmd', {
                  })(
                    <TextArea/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label={'洽谈情况'} {...formItemLayout}>
                  {getFieldDecorator('qtqk', {
                  })(
                    <TextArea placeholder="洽谈情况"/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
      </Modal>
    )
  }
}
