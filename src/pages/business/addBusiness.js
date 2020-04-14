import React, { PureComponent } from 'react';
import { Form, Select, Input, Row, Col, DatePicker, Button, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import {session} from 'casic-common';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import PageLayout from '@/layouts/PageLayout';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
const breadcrumbs = [
  { icon: 'home', path: '/' },
  { label: '商机管理', path: '/business' },
  { label: '新增商机' },
];

@Form.create()
@connect((state) => ({
  business: state.business,
}))

export default class Rcgj extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      khxx: [],
      sjzt: [],           //商机状态
      pinyin: {}
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'business/getCustomersList',
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          khxx: data,
        });
      }
    });
    dispatch({
      type: 'business/categories',
      payload: {
        name: 'sj-zt'
      }
    }).then(({success, data}) => {
      if(success && data) {
        this.setState({
          sjzt: data
        })
      }
    })
  }

  onSave = () => {
    const { dispatch, form: {validateFields} } = this.props;
    const {pinyin} = this.state;
    validateFields((errs, fields) => {
      if(errs) return;
      dispatch({
        type: 'business/addBusiness',
        payload: {
          ...fields,
          customerId: fields['customerId'].key,
          customerName: fields['customerId'].label,
          sjsyr: session.get().name,
          sjcjrdw: session.get().orgName,
          sjsyrdw: session.get().orgName,
          initial: pinyin && pinyin.initial,
          pinyin: pinyin && pinyin.pinyin,
        }
      }).then(({success, data}) => {
        if(success && data) {
          message.success('保存成功');
          dispatch(
            routerRedux.push({
              pathname: `/business/editBusiness`,
              query: {id: data.id}
            }),
          );
        }else {
          message.error('保存失败！');
        }
      })
    });
  };

  disabledDate = (current) => {
    return current && current < moment().startOf('day');
  };

  getPinYin = (text) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'business/getPinYin',
      payload: {text}
    }).then(({success, data}) => {
      if(success && data) {
        this.setState({
          pinyin: data
        })
      }
    })
  };

  render() {
    const { form: { getFieldDecorator }, location: { query: { id } } } = this.props;
    const {khxx, sjzt } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };

    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.container}>
          <div className={styles.content}>
            <FormItem label={'客户名称'} {...formItemLayout}>
              {getFieldDecorator('customerId', {
                rules: [{
                  required: true,
                  message: '请选择客户'
                }]
              })(
                <Select showSearch
                        getPopupContainer={triggerNode => triggerNode.parentElement}
                        style={{ width: '100%' }}
                        placeholder={'客户名称'}
                        optionFilterProp="children"
                        labelInValue
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                  {
                    khxx && khxx.map((item) => {
                      return (
                        <Option key={item.id}>{item.khmc}</Option>
                      );
                    })
                  }
                </Select>,
              )}
            </FormItem>
            <FormItem label={'商机名称'}{...formItemLayout}>
              {getFieldDecorator('sjmc', {
                rules: [{
                  required: true,
                  message: '请输入商机名称',
                }],
              })(
                <Input maxLength={50} placeholder={'商机名称'} onBlur={(e) => this.getPinYin(e.target.value)}/>,
              )}
            </FormItem>
            <FormItem label={'商机状态'} {...formItemLayout}>
              {getFieldDecorator('sjzt', {})(
                <Select style={{ width: '100%' }} placeholder={'商机状态'} getPopupContainer={triggerNode => triggerNode.parentElement}>
                  {
                    sjzt && sjzt.map((o, i) => {
                      return (<Option key={o.useName}>{o.name}</Option>);
                    })
                  }
                </Select>,
              )}
            </FormItem>
            <FormItem label={'结束日期'} {...formItemLayout}>
              {getFieldDecorator('jsrq', {
                initialValue: moment(),
              })(
                <DatePicker disabledDate={this.disabledDate}
                            style={{ width: '100%' }}/>,
              )}
            </FormItem>
            <FormItem label={'预计金额'} {...formItemLayout}>
              {getFieldDecorator('yjje', {
                rules: [
                  {
                    pattern: new RegExp(/^([0-9]{1,10}(\.\d{1,2})?)$/),
                    message: '请输入正确的预计金额',
                  },
                ],
              })(
                <Input addonAfter={'元'}/>,
              )}
            </FormItem>
            <FormItem label={'说明'} {...formItemLayout}>
              {getFieldDecorator('remark', {})(
                <TextArea row={3} placeholder={'说明'}/>,
              )}
            </FormItem>
            <Row>
              <Col sx={{ span: 24 }}>
                <div className={styles.btnGroup}>
                  <Button icon={'save'}
                          size={'small'}
                          type={'primary'}
                          onClick={() => {
                            this.onSave();
                          }}>
                    保存
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </PageLayout>
    );
  }
}
