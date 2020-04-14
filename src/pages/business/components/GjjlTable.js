import React, { Component } from 'react';
import { Form, Table, Button, Popconfirm, Divider, Input, message, DatePicker, Select } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { connect } from 'dva';
import LineWrap from '@/components/LineWrap';
import { Link } from 'casic-common';
import styles from '../index.less';

const { Item: FormItem } = Form;
const Option = Select.Option;
@Form.create()
@connect((state) => ({
  business: state.business,
}))

export default class Glcp extends Component {

  //新增按钮回调
  add = () => {
    const { gjjlData, tableEdit } = this.props;
    const _gjjlData = _.cloneDeep(gjjlData);
    const item = { add: true };
    if (tableEdit) {
      message.warning('请先完成当前行操作');
    } else {
      _gjjlData.push(item);
      this.props.changeGjjlData(_gjjlData);
      this.props.changeEditState(true);
    }
  };

  //保存
  onSave = (record) => {
    const { form: { validateFields }, businessId, dispatch } = this.props;
    validateFields((errs, fields) => {
      if (errs) return;
      const payload = {
        businessId,
        jlrq: fields['jlrq'],
        remark: fields['remark'],
        ssjd: fields['ssjd'],
      };
      if (record.add) {
        // 新增
        dispatch({
          type: 'business/addBusinessGjjl',
          payload: payload,
        }).then(({ success, data }) => {
          if (success && data) {
            message.success('保存成功');
            this.props.loadData();
            this.props.changeEditState(false);
          } else {
            message.error('保存失败');
          }
        });
      } else if (record.edit) {
        // 修改
        dispatch({
          type: 'business/editBusinessGjjl',
          payload: {
            ...payload,
            id: record.id,
          },
        }).then(({ success, data }) => {
          if (success && data) {
            message.success('保存成功');
            this.props.loadData();
            this.props.changeEditState(false);
          } else {
            message.error('保存失败');
          }
        });
      }
    });
  };

  //点击取消
  onCancel = () => {
    this.props.loadData();
    this.props.changeEditState(false);
  };

  //点击编辑回调
  onEdit = (record) => {
    const { gjjlData, tableEdit } = this.props;
    const _gjjlData = _.cloneDeep(gjjlData);
    const index = _.findIndex(_gjjlData, item => item.id === record.id);
    if (tableEdit) {
      message.warning('请先完成当前行操作');
    } else {
      _.set(_gjjlData[index], 'edit', true);
      this.props.changeGjjlData(_gjjlData);
      this.props.changeEditState(true);
    }
  };

  //点击删除回调
  onDelete = (record) => {
    const { dispatch, tableEdit } = this.props;
    if (tableEdit) {
      message.warning('请先完成当前行操作');
    } else {
      dispatch({
        type: 'business/deleteGjjl',
        payload: { id: record.id },
      }).then((success) => {
        if (success) {
          this.props.loadData();
          this.props.changeEditState(false);
        }
      });
    }
  };

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  getDataColumns = () => {
    const { form: { getFieldDecorator }, sjzt } = this.props;
    const columns = [{
      title: '序号',
      dataIndex: 'rownumber',
      width: '50px',
    }, {
      title: '所属阶段',
      dataIndex: 'ssjd',
      width: '130px',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`ssjd`, {
                initialValue: text && text,
                rules: [{
                  required: true,
                  message: '请选择所属阶段',
                }],
              })(
                <Select style={{ width: '100%' }} placeholder="商机状态">
                  {
                    sjzt && sjzt.map(item => {
                      return (<Option key={item.name}>{item.name}</Option>);
                    })
                  }
                </Select>,
              )}
            </FormItem>
          );
        } else {
          return (
            <span>{text && text}</span>
          );
        }
      },
    }, {
      title: '记录日期',
      dataIndex: 'jlrq',
      width: '130px',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`jlrq`, {
                initialValue: (text && moment(text)) || moment(),
              })(
                <DatePicker disabledDate={this.disabledDate}
                            style={{ width: '100%' }}/>,
              )}
            </FormItem>
          );
        } else {
          return (
            <span>{text && moment(text).format('YYYY-MM-DD')}</span>
          );
        }
      },
    }, {
      title: '记录',
      dataIndex: 'remark',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator('remark', {
                initialValue: text && text,
              })(
                <Input/>,
              )}
            </FormItem>
          );
        } else {
          return (
            <LineWrap title={text} lineClampNum={1}/>
          );
        }
      },
    }, {
      title: '操作',
      dataIndex: 'xq',
      width: '150px',
      render: (text, record) => {
        if (record.id && !record.edit) {
          return (
            <span>
            <Link onClick={() => {
              this.onEdit(record);
            }} icon='edit'>编辑</Link>
            <Divider type='vertical'/>
          <Popconfirm title="确认删除吗？" getPopupContainer={triggerNode => triggerNode}
                      onConfirm={() => this.onDelete(record)} okText="是" cancelText="否">
            <Link icon='delete' type='danger'>删除</Link>
          </Popconfirm>
          </span>
          );
        } else {
          return (
            <span>
            <Link onClick={() => {
              this.onSave(record);
            }} icon='save'>保存</Link>
            <Divider type='vertical'/>
          <Popconfirm title="确认取消吗？" getPopupContainer={triggerNode => triggerNode}
                      onConfirm={() => this.onCancel(record)} okText="是" cancelText="否">
            <Link icon='close-circle' type='danger'>取消</Link>
          </Popconfirm>
          </span>
          );
        }
      },
    }];
    return columns;
  };

  renderGjjlHeader = () => {
    return (
      <div className={styles.tableContent}>
        <span>跟进记录</span>
      </div>
    );
  };

  render() {
    const { gjjlData } = this.props;
    let _list = [];
    if (gjjlData) {
      _list = gjjlData.map((d, idx) => {
        d.rownumber = idx + 1;
        return d;
      });
    }

    return (
      <div style={{ marginTop: 20 }}>
        <Table
          title={() => this.renderGjjlHeader()}
          dataSource={_list}
          pagination={false}
          columns={this.getDataColumns()}
          bordered/>
        <Button
          size="small"
          type='primary'
          style={{ marginTop: '10px' }}
          icon={'plus'}
          ghost
          onClick={() => this.add()}>添加</Button>
      </div>
    );
  }
}
