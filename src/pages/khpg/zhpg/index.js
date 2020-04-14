import React, {PureComponent}  from 'react';
import { Button, Form, Row, Col, Input, DatePicker, message, Table, Modal } from 'antd';
import {connect} from 'dva';
import moment from 'moment';
import _ from 'lodash';
import PageLayout from '@/layouts/PageLayout';
import {routerRedux} from 'dva/router';
import styles from '../index.less';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
@Form.create()
@connect((khpg) => ({
  khpg
}))

export default class Zhpg extends PureComponent {
  constructor(props) {
    super(props);
    const {location: {query: {btnName}}} = this.props;
    this.state = {
      data: {},        //表格数据
      btnName: btnName,
      modify: false,
      breadcrumbs : [],
      visible: false
    }
  }

  componentDidMount() {
    const {location: {query: {id, zhpg}}, dispatch} = this.props;
    if (zhpg) {
      //修改
      dispatch({
        type: 'khpg/getZhpgData',
        payload: {customerId: id}
      }).then(({success, data}) => {
        if (success && data) {
          this.setState({
            data: data,
            breadcrumbs: [
              {icon: 'home', path: '/'},
              {label: '客户信息', path: '/customer'},
              {label: '客户信息详情', path: `/customer/customerDetail?id=${id}`},
              {label: '综合评估修改'}
            ]
          })
        }
      })
    } else {
      //新增
      dispatch({
        type: 'khpg/getZhpgRules',
      }).then(({success, data}) => {
        if (success && data) {
          this.setState({
            data: data,
            breadcrumbs: [
              {icon: 'home', path: '/'},
              {label: '客户信息', path: '/customer'},
              {label: '客户信息详情', path: `/customer/customerDetail?id=${id}`},
              {label: '综合评估新增'}
            ]
          })
        }
      });
    }
  }

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  renderSearchForm = () => {
    const {getFieldDecorator} = this.props.form;
    const {location: {query: {khmc}}} = this.props;
    const {data} = this.state;

    return (
      <Form layout="inline">
        <Row>
          <Col span={8}>
            <FormItem label='客户名称：'>
              {getFieldDecorator('khmc', {
                initialValue: khmc && khmc,
              })(
                <span>{khmc && khmc}</span>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='评估时间：'>
              {getFieldDecorator('pgsj', {
                initialValue: (data.pgsj && moment(this.state.data.pgsj)) || moment(),
                rules: [{required: true, message: '请选择评估时间!'}]
              })(
                <DatePicker disabledDate={this.disabledDate}/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  renderDynamicCell = (row) => {
    const {getFieldDecorator} = this.props.form;
    const {item, itemContent} = row;
    const {btnName} = this.state;

    return (
      <FormItem key={item}>
        {getFieldDecorator(`${item}`, {
          initialValue: itemContent
        })(
          <TextArea disabled={btnName === '修改' && true}/>
        )}
      </FormItem>
    )
  };

  renderCell = () => {
    const columns = [{
      title: '',
      colSpan: 2,
      width: 320,
      dataIndex: 'groupby',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        const start = _.findIndex(this.state.data.crmZhpgItemdtos, function (o) {
          return o.groupby === row.groupby;
        });
        const end = _.findLastIndex(this.state.data.crmZhpgItemdtos, function (o) {
          return o.groupby === row.groupby;
        });

        if (index === start) {
          obj.props.rowSpan = end - start + 1;
        }
        if (index > start && index <= end) {
          obj.props.rowSpan = 0;
        }
        return obj;
      }
    }, {
      title: '标签',
      dataIndex: 'item',
      colSpan: 0,
      width: 320,
    }, {
      title: '',
      dataIndex: 'text',
      //width: 320,
      render: (value, row) => {
        return this.renderDynamicCell(row);
      }
    }];
    return columns;
  };

  onSave = () => {
    const {location: {query: {id, zhpg}}, dispatch, form: {validateFields}} = this.props;
    const {data} = this.state;

    validateFields((errs, values) => {
      if (errs) return;
      const _data = _.cloneDeep(data);
      _data.crmZhpgItemdtos.forEach(o => {
        _.set(o, 'itemContent', values[o.item])
      });

      const addPayload = {
        ..._data,
        customerId: id,
        pgsj: values['pgsj']
      };
      const modifyPayload = {
        ..._data,
        pgsj: values['pgsj']
      };

      if (zhpg) {
        //修改保存
        dispatch({
          type: 'khpg/saveModifyZhpg',
          payload: modifyPayload
        }).then(({success, data}) => {
          if (success) {
            message.success('保存成功');
            dispatch(
              routerRedux.push({
                pathname: '/customer/customerDetail',
                query: {
                  id: id,
                }
              })
            )
          }
        })
      } else {
        //新增保存
        dispatch({
          type: 'khpg/saveAddZhpg',
          payload: addPayload
        }).then(({success, data}) => {
          if (success) {
            message.success('保存成功');
            dispatch(
              routerRedux.push({
                pathname: '/customer/customerDetail',
                query: {
                  id: id,
                }
              })
            )
          }
        })
      }
    })
  };

  judgeContent = () => {
    const {form: {validateFields}} = this.props;
    validateFields((errs, fields) => {
      if(errs) return;
      const _fields = fields;
      delete _fields.khmc;
      delete _fields.pgsj;
      const item = _.find(_fields, (v, k) => v && v!=='');
      if(item) {
        this.onSave()
      }else {
        this.setState({
          visible: true
        })
      }
    })
  };

  onOk = () => {
    this.setState({
      visible: false
    });
    this.onSave()
  };

  onCancel = () => {
    this.setState({
      visible: false
    })
  };

  render() {
    const {data, breadcrumbs, visible} = this.state;
    const columns = this.renderCell();

    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.content}>
          <div className={styles.apply}>
            <div style={{marginBottom: '30px'}}>
              {this.renderSearchForm()}
            </div>
            <Table columns={columns}
                   dataSource={data.crmZhpgItemdtos}
                   pagination={false}
                   title={() => <span>综合评估</span>}
                   showHeader={false}
                   bordered/>
            <div className={styles.btnGroup}>
              <Button icon={'save'}
                      type={'primary'}
                      size="small"
                      onClick={() => this.judgeContent()}>保存
              </Button>
            </div>
          </div>
        </div>
        <Modal
          title={'保存提示'}
          visible={visible}
          footer={[
            <Button size='small' type='primary' onClick={this.onOk}>确定</Button>,
            <Button size='small' onClick={this.onCancel}>取消</Button>,
          ]}>
          <span style={{fontSize: '17px'}}>评估内容为空，确定保存吗？</span>
        </Modal>
      </PageLayout>
    )
  }
}
