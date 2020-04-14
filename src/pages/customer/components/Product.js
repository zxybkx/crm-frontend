import React, { PureComponent } from 'react';
import { Button, Popconfirm, Form, Divider, Table, message, Input } from 'antd';
import _ from 'lodash';
import { connect } from 'dva';
import uuidV4 from 'uuid/v4';
import { Link } from 'casic-common';
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
      title: '产品类别',
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`type`, {
                initialValue: text && text,
                rules: [{
                  required: true,
                  message: '请输入产品类别',
                }],
              })(
                <Input placeholder={`产品类别`}/>,
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
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
      //width: '20%',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`name`, {
                initialValue: text && text,
                rules: [{
                  required: true,
                  message: '请输入产品名称',
                }],
              })(
                <Input placeholder={`产品名称`}/>,
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
      title: '销售价格（元）',
      dataIndex: 'xsjg',
      key: 'xsjg',
      //width: '15%',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`xsjg`, {
                initialValue: text && text,
                rules: [{
                  pattern: new RegExp(/^[0-9]*(\.\d+)?$/),
                  message: '请输入正确的销售价格'
                }],
              })(
                <Input placeholder={`销售价格`}/>,
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
      title: '产品毛利%',
      dataIndex: 'cpml',
      key: 'cpml',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`cpml`, {
                initialValue: text && text,
                rules: [{
                  required: true,
                  pattern: new RegExp(/^[0-9]{1,3}(\.\d+)?$/),
                  message: '请输入正确的产品毛利',
                }],
              })(
                <Input placeholder={`产品毛利`}/>,
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
    const { productData, edit } = this.props;
    const _productData = _.cloneDeep(productData);
    const itemId = uuidV4();
    const item = {
      id: itemId,
      add: true,
      edit: false,
    };
    if (edit) {
      message.warning('请先完成当前行操作');
    } else {
      _productData.push(item);
      this.props.changeProductData(_productData);
      this.props.changeEdit(true);
    }
  };

  onSave = (record) => {
    const { productData, form: { validateFields } } = this.props;
    const _productData = _.cloneDeep(productData);
    const index = _.findIndex(_productData, item => item.id === record.id);
    validateFields((errs, fields) => {
      if (errs) return;
      _.set(_productData[index], 'add', false);
      _.set(_productData[index], 'edit', false);
      _.set(_productData[index], 'cpml', fields['cpml']);
      _.set(_productData[index], 'name', fields['name']);
      _.set(_productData[index], 'type', fields['type']);
      _.set(_productData[index], 'xsjg', fields['xsjg']);
      this.props.changeProductData(_productData);
      this.props.changeEdit(false);
    });
  };

  onEdit = (record) => {
    const { productData, edit } = this.props;
    const _productData = _.cloneDeep(productData);
    const index = _.findIndex(_productData, item => item.id === record.id);
    if (edit) {
      message.warning('请先完成当前行操作');
    } else {
      _.set(_productData[index], 'add', false);
      _.set(_productData[index], 'edit', true);
      this.props.changeProductData(_productData);
      this.props.changeEdit(true);
    }
  };

  onDelete = (record) => {
    const { productData, edit } = this.props;
    const _productData = _.cloneDeep(productData);
    if (edit) {
      message.warning('请先完成当前行操作');
    } else {
      _.remove(_productData, item => item.id === record.id);
      this.props.changeProductData(_productData);
      this.props.changeEdit(false);
    }
  };

  onCancel = (record) => {
    const { productData } = this.props;
    const _productData = _.cloneDeep(productData);
    if (!record.add && record.edit) {
      //编辑取消
      const index = _.findIndex(_productData, item => item.id === record.id);
      _.set(_productData[index], 'edit', false);
      this.props.changeProductData(_productData);
      this.props.changeEdit(false);
    } else {
      //新增取消
      _.remove(_productData, item => item.id === record.id);
      this.props.changeProductData(_productData);
      this.props.changeEdit(false);
    }
  };

  render() {
    const { productData } = this.props;
    let _list = [];
    if (productData) {
      _list = productData.map((d, idx) => {
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
          onClick={() => this.add()}>新增产品</Button>
      </div>
    );
  }
}
