import React, { PureComponent } from 'react';
import { Button, Popconfirm, Form, Divider, Table, message, Input } from 'antd';
import _ from 'lodash';
import { connect } from 'dva';
import { Link } from 'casic-common';
import uuidV4 from 'uuid/v4';
import LineWrap from '@/components/LineWrap';

const { Item: FormItem } = Form;
@Form.create()
@connect(({ khgj }) => ({
  khgj,
}))
export default class Shareholder extends PureComponent {
  getDataColumns = () => {
    const { form: { getFieldDecorator } } = this.props;
    const columns = [{
      title: '序号',
      width: '100px',
      dataIndex: 'rownumber',
    }, {
      title: '供应商名称',
      dataIndex: 'name',
      key: 'name',
      //width: '20%',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator('name', {
                initialValue: text && text,
              })(
                <Input placeholder={`供应商名称`}/>
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
      title: '供应产品',
      dataIndex: 'gycp',
      key: 'gycp',
      //width: '20%',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator('gycp', {
                initialValue: text && text,
              })(
                <Input placeholder={`供应产品`}/>,
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
      title: '产品单价（元）',
      dataIndex: 'cpdj',
      key: 'cpdj',
      //width: '15%',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator('cpdj', {
                initialValue: text && text,
                rules: [{
                  pattern: new RegExp(/^[0-9]*(\.\d+)?$/),
                  message: '请输入正确的产品单价'
                }],
              })(
                <Input placeholder={`产品单价`}/>
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
      title: '供应商经营资质及隐性风险核查',
      dataIndex: 'zzfx',
      key: 'zzfx',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator('zzfx', {
                initialValue: text && text,
              })(
                <Input placeholder={`供应商经营资质及隐性风险核查`}/>,
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
      title: '符合程度',
      dataIndex: 'fhcd',
      key: 'fhcd',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator('fhcd', {
                initialValue: text && text,
              })(
                <Input placeholder={`符合程度`}/>,
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
      title: '参保人数',
      dataIndex: 'cbrs',
      key: 'cbrs',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator('cbrs', {
                initialValue: text && text,
                rules: [{
                  pattern: new RegExp(/^\d*$/),
                  message: '请输入正确的参保人数',
                }],
              })(
                <Input placeholder={`参保人数`}/>,
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
      title: '行政处罚和法律诉讼',
      dataIndex: 'cfss',
      key: 'cfss',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator('cfss', {
                initialValue: text && text,
              })(
                <Input placeholder={`行政处罚和法律诉讼`}/>,
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
      width: '130px',
      key: 'xq',
      render: (text, record) => {
        if (!record.add && !record.edit) {
          return (
            <span>
            <Link onClick={() => {
              this.onEdit(record);
            }} icon='edit'>编辑</Link>
            <Divider type='vertical'/>
          <Popconfirm title="确认删除吗？" onConfirm={() => this.onDelete(record)} okText="是" cancelText="否">
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
          <Popconfirm title="确认取消吗？" onConfirm={() => this.onCancel(record)} okText="是" cancelText="否">
            <Link icon='close-circle' type='danger'>取消</Link>
          </Popconfirm>
          </span>
          );
        }
      },
    }];
    return columns;
  };

  add = () => {
    const { gysData, edit } = this.props;
    const _gysData = _.cloneDeep(gysData);
    const itemId = uuidV4();
    const item = {
      id: itemId,
      add: true,
      edit: false,
    };
    if (edit) {
      message.warning('请先完成当前行操作');
    } else {
      _gysData.push(item);
      this.props.changeGysData(_gysData);
      this.props.changeEdit(true);
    }
  };

  onEdit = (record) => {
    const { gysData, edit } = this.props;
    const _gysData = _.cloneDeep(gysData);
    const index = _.findIndex(_gysData, item => item.id === record.id);
    if (edit) {
      message.warning('请先完成当前行操作');
    } else {
      _.set(_gysData[index], 'add', false);
      _.set(_gysData[index], 'edit', true);
      this.props.changeGysData(_gysData);
      this.props.changeEdit(true);
    }
  };

  onDelete = (record) => {
    const { gysData, edit } = this.props;
    const _gysData = _.cloneDeep(gysData);
    if (edit) {
      message.warning('请先完成当前行操作');
    } else {
      _.remove(_gysData, item => item.id === record.id);
      this.props.changeGysData(_gysData);
      this.props.changeEdit(false);
    }
  };

  onCancel = (record) => {
    const { gysData } = this.props;
    const _gysData = _.cloneDeep(gysData);
    if (!record.add && record.edit) {
      //编辑取消
      const index = _.findIndex(_gysData, item => item.id === record.id);
      _.set(_gysData[index], 'edit', false);
      this.props.changeGysData(_gysData);
      this.props.changeEdit(false);
    } else {
      //新增取消
      _.remove(_gysData, item => item.id === record.id);
      this.props.changeGysData(_gysData);
      this.props.changeEdit(false);
    }
  };

  onSave = (record) => {
    const { gysData, form: { validateFields } } = this.props;
    const _gysData = _.cloneDeep(gysData);
    const index = _.findIndex(_gysData, item => item.id === record.id);
    validateFields((errs, fields) => {
      if (errs) return;
      _.set(_gysData[index], 'add', false);
      _.set(_gysData[index], 'edit', false);
      _.set(_gysData[index], 'name', fields['name']);
      _.set(_gysData[index], 'gycp', fields['gycp']);
      _.set(_gysData[index], 'cpdj', fields['cpdj']);
      _.set(_gysData[index], 'zzfx', fields['zzfx']);
      _.set(_gysData[index], 'fhcd', fields['fhcd']);
      _.set(_gysData[index], 'cbrs', fields['cbrs']);
      _.set(_gysData[index], 'cfss', fields['cfss']);
      this.props.changeGysData(_gysData);
      this.props.changeEdit(false);
    });
  };

  render() {
    const { gysData } = this.props;
    let _list = [];
    if (gysData) {
      _list = gysData.map((d, idx) => {
        d.rownumber = idx + 1;
        return d;
      });
    }

    return (
      <div>
        <Table
          dataSource={_list}
          columns={this.getDataColumns()}
          pagination={false}
          rowKey={record => record.id || Math.random()}
          bordered
        />
        <Button
          size="small"
          type='primary'
          style={{ marginTop: '10px' }}
          icon={'plus'}
          ghost
          onClick={() => this.add()}>新增供应商</Button>
      </div>
    );
  }
}
