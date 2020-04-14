import React, {PureComponent} from 'react';
import {Icon, Button, Form, Row, Col, Input, DatePicker, message, Collapse} from 'antd';
import {connect} from 'dva';
import uuidV4 from 'uuid/v4';
import {routerRedux} from 'dva/router';
import moment from 'moment';
import PageLayout from '@/layouts/PageLayout';
import {FileUploader} from 'casic-common';
import _ from 'lodash';
import styles from '../index.less';

const {Panel} = Collapse;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
@Form.create()
@connect((state) => ({
  khpg: state.khpg
}))

export default class Zzxx extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      visible: false,
      modify: false,
      breadcrumbs: []
    }
  }

  componentDidMount() {
    const {dispatch, location: {query: {id, zzxx}}} = this.props;
    if (zzxx) {
      //查看
      dispatch({
        type: 'khpg/getKhzzData',
        payload: {id: id}
      }).then(({success, data}) => {
        if (success && data) {
          this.setState({
            data: data,
            breadcrumbs: [
              {icon: 'home', path: '/'},
              {label: '客户信息', path: '/customer'},
              {label: '客户信息详情', path: `/customer/customerDetail?id=${id}`},
              {label: '资质评估修改'}
            ]
          })
        }
      })
    } else {
      //添加
      dispatch({
        type: 'khpg/getkhzzRules',
      }).then(({success, data}) => {
        if (success && data) {
          this.setState({
            data: data,
            breadcrumbs: [
              {icon: 'home', path: '/'},
              {label: '客户信息', path: '/customer'},
              {label: '客户信息详情', path: `/customer/customerDetail?id=${id}`},
              {label: '资质评估新增'}
            ]
          })
        }
      })
    }
  };

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  renderForm = (id, index) => {
    const {form: {getFieldDecorator}} = this.props;
    const {data} = this.state;
    const initialValue = _.find(data.crmKhzzItemdtos, o => {
      return o.itemId === id
    });
    const fjInitialValue = initialValue && initialValue.fileList;
    let _fjInitialValue = [];
    fjInitialValue && fjInitialValue.map((item) => {
      let _item = {};
      _.set(_item, 'id', item.fileId);
      _.set(_item, 'name', item.fileName);
      _.set(_item, 'url', `/gateway/fileservice/api/file/view/${item.fileId}`);
      _fjInitialValue.push(_item);
    });
    return (
      <Form>
        <Row>
          <Col span={8}>
            <FormItem label="颁发日期" labelCol={{span: 11}} wrapperCol={{span: 8}}>
              {
                getFieldDecorator(id ? `bfrq-${id}` : `bfrq-${index}`, {
                  initialValue: initialValue.bfrq && moment(initialValue.bfrq),
                })(
                  <DatePicker disabledDate={this.disabledDate}/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="有效截止日期" labelCol={{span: 7}} wrapperCol={{span: 16}}>
              {
                getFieldDecorator(id ? `yxjzrq-${id}` : `yxjzrq-${index}`, {
                  initialValue: initialValue.yxjzrq && moment(initialValue.yxjzrq),
                })(
                  <DatePicker/>
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <FormItem label="资质说明" labelCol={{span: 4}} wrapperCol={{span: 20}}>
              {
                getFieldDecorator(id ? `zzsm-${id}` : `zzsm-${index}`, {
                  initialValue: initialValue.zzsm && initialValue.zzsm,
                })(
                  <TextArea placeholder="资质说明"/>
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <FormItem label="资质附件" labelCol={{span: 8}} wrapperCol={{span: 16}}>
              {
                getFieldDecorator(id ? `fileList-${id}` : `fileList-${index}`, {
                  initialValue: _fjInitialValue,
                })(
                  <FileUploader maxSize={5} label="上传(最多上传5个附件)"/>
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  };

  onAdd = () => {
    const {data} = this.state;
    const itemId = uuidV4();
    let newItem = {
      bfrq: null,
      groupby: "其他支持文件及照片",
      groupbyOrder: 3,
      id: null,
      itemName: '',
      itemId: itemId,
      itemOrder: 1,
      parentId: null,
      tenantId: null,
      yxjzrq: null,
      zzsm: null,
    };
    const _data = _.cloneDeep(data);
    _data.crmKhzzItemdtos.push(newItem);
    this.setState({
      data: _data,
    })
  };

  onSave = () => {
    const {form: {validateFieldsAndScroll}, dispatch, location: {query: {id, zzxx}}} = this.props;
    const {data} = this.state;

    validateFieldsAndScroll((errs, fields) => {
      if (errs) return;

      const _data = _.cloneDeep(data);
      _.map(fields, (v, k) => {
        const key = k.split('-');
        if (key[0] === 'fileList') {
          fields[k] && fields[k].map((o) => {
            o.fileId = o.id;
            o.fileName = o.name;
            delete o.id;
            delete o.name
          })
        }

        _data.crmKhzzItemdtos.forEach((item, _Index) => {
          _.set(item, 'yxjzrq', fields[`yxjzrq-${item.itemId}`]);
          _.set(item, 'zzsm', fields[`zzsm-${item.itemId}`]);
          _.set(item, 'bfrq', fields[`bfrq-${item.itemId}`]);
          !item.id && _.set(item, 'itemName', fields[`itemName-${item.itemId}`]);
          const oldFileList = data.crmKhzzItemdtos[_Index].fileList;
          const newFileList = fields[`fileList-${item.itemId}`];
          const finalFileList = [];
          newFileList && newFileList.forEach(o => {
            const index = _.findIndex(oldFileList, x => x.fileId === o.fileId);
            if (index >= 0) {
              finalFileList.push(oldFileList[index])
            } else {
              finalFileList.push(o)
            }
          });
          _.set(item, 'fileList', finalFileList);
        })
      });

      _.set(_data, 'customerId', id);
      _.set(_data, 'pgsj', fields['pgsj']);

      if (zzxx) {
        //修改
        dispatch({
          type: 'khpg/saveEditkhzz',
          payload: _data,
        }).then(({success, data}) => {
          if (success) {
            message.success('保存成功');
            dispatch(
              routerRedux.push({
                pathname: '/customer/customerDetail',
                query: {
                  id: data.customerId,
                }
              })
            );
          }
        })
      } else {
        //新增
        this.setState({
          modify: true,
        });
        dispatch({
          type: 'khpg/saveAddkhzz',
          payload: _data,
        }).then(({success, data}) => {
          if (success) {
            message.success('保存成功');
            //查看
            dispatch({
              type: 'khpg/getKhzzData',
              payload: {id: data.customerId}
            }).then(({success, data}) => {
              if (success && data) {
                dispatch(
                  routerRedux.push({
                    pathname: '/customer/customerDetail',
                    query: {
                      id: data.customerId,
                    }
                  })
                );
                this.setState({
                  data: data
                })
              }
            })
          }
        })
      }
    })
  };

  renderSearchForm = () => {
    const {getFieldDecorator} = this.props.form;
    const {location: {query: {khmc}}} = this.props;
    const {data} = this.state;

    return (
      <Form layout='inline'>
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

  render() {
    const {data, breadcrumbs} = this.state;
    const {form: {getFieldDecorator}} = this.props;
    const rulesObj = _.groupBy(data.crmKhzzItemdtos, 'groupby');

    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.content}>
          <div className={styles.apply}>
            <div style={{marginLeft: 20, marginTop: 10}}>
              {this.renderSearchForm()}
            </div>
            {
              _.map(rulesObj, (v, k) => {
                return (
                  <div style={{margin: '10px 20px 10px 20px'}} key={k}>
                    <Collapse defaultActiveKey={data.crmKhzzItemdtos[0].groupby}>
                      <Panel header={<span style={{color: '#2fb4b1'}}>{k}</span>} key={k}>
                        {
                          v.map((o, i) => {
                            return (
                              <div key={o.itemId}>
                                <div>
                                  <Row>
                                    <Col span={22} offset={2}>
                                      {
                                        o.itemName === '' ?
                                          <FormItem wrapperCol={{span: 3}}>
                                            {
                                              getFieldDecorator(o.itemId ? `itemName-${o.itemId}` : `zzsm-${i}`, {
                                                rules: [{required: true, message: '请输入标题'}]
                                              })(
                                                <div style={{fontSize: 15, color: '#2fb4b1'}}>
                                                  <Input/>
                                                </div>
                                              )
                                            }
                                          </FormItem> :
                                          <span style={{fontSize: 15, color: '#2fb4b1'}}>
                                            {i + 1}{'、'}{o.itemName}
                                          </span>
                                      }
                                    </Col>
                                  </Row>
                                  {this.renderForm(o.itemId)}
                                </div>
                              </div>
                            )
                          })
                        }
                        {
                          k === '其他支持文件及照片' ?
                            <div className={styles.btn}>
                              <Button type='primary' size="small" onClick={() => {
                                this.onAdd()
                              }}>
                                <Icon type="plus"/>
                                添加更多支持文件及照片
                              </Button>
                            </div> : null
                        }
                      </Panel>
                    </Collapse>
                  </div>
                )
              })
            }
            <div className={styles.footer}>
              <Button
                size="small"
                type='primary'
                icon={'save'}
                onClick={() => {
                  this.onSave()
                }}>
                保存
              </Button>
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }
}
