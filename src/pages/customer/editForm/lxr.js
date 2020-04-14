import React, { Component } from 'react';
import { Form, Table, Button, Popconfirm, Divider, Input, message } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import { Link } from 'casic-common';
import uuidV4 from 'uuid/v4';
import LineWrap from '@/components/LineWrap';

const { Item: FormItem } = Form;

@Form.create()
@connect((lxr) => ({
  lxr,
}))

class Lxr extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
    };
  }

  //新增按钮回调
  add = () => {
    const { lxrData } = this.props;
    const { edit } = this.state;
    const _lxrData = _.cloneDeep(lxrData);
    const itemId = uuidV4();
    const item = {
      id: itemId,
      add: true,
      edit: false,
    };
    if (edit) {
      message.warning('请先完成当前行操作');
    } else {
      _lxrData.push(item);
      this.props.changeLxr(_lxrData);
      this.setState({
        edit: true,
      });
    }
  };

  //保存
  onSave = (record) => {
    const { lxrData, form: { validateFields } } = this.props;
    const _lxrData = _.cloneDeep(lxrData);
    const index = _.findIndex(_lxrData, item => item.id === record.id);
    validateFields((errs, fields) => {
      if (errs) return;
      _.set(_lxrData[index], 'add', false);
      _.set(_lxrData[index], 'edit', false);
      _.set(_lxrData[index], 'xm', fields['xm']);
      _.set(_lxrData[index], 'zw', fields['zw']);
      _.set(_lxrData[index], 'lxdh', fields['lxdh']);
      this.props.changeLxr(_lxrData);
      this.setState({
        edit: false,
      });
    });
  };

  //点击取消
  onCancel = (record) => {
    const { lxrData } = this.props;
    const _lxrData = _.cloneDeep(lxrData);
    if (!record.add && record.edit) {
      //编辑取消
      const index = _.findIndex(_lxrData, item => item.id === record.id);
      _.set(_lxrData[index], 'edit', false);
      this.props.changeLxr(_lxrData);
      this.setState({
        edit: false,
      });
    } else {
      //新增取消
      _.remove(_lxrData, item => item.id === record.id);
      this.props.changeLxr(_lxrData);
      this.setState({
        edit: false,
      });
    }
  };

  //点击编辑回调
  onEdit = (record) => {
    const { lxrData } = this.props;
    const { edit } = this.state;
    const _lxrData = _.cloneDeep(lxrData);
    const index = _.findIndex(_lxrData, item => item.id === record.id);
    if (edit) {
      message.warning('请先完成当前行操作');
    } else {
      _.set(_lxrData[index], 'add', false);
      _.set(_lxrData[index], 'edit', true);
      this.props.changeLxr(_lxrData);
      this.setState({
        edit: true,
      });
    }
  };

  //点击删除回调
  onDelete = (record) => {
    const { lxrData } = this.props;
    const { edit } = this.state;
    const _lxrData = _.cloneDeep(lxrData);
    if (edit) {
      message.warning('请先完成当前行操作');
    } else {
      _.remove(_lxrData, item => item.id === record.id);
      this.props.changeLxr(_lxrData);
      this.setState({
        edit: false,
      });
    }
  };

  getDataColumns = () => {
    const { form: { getFieldDecorator } } = this.props;
    const columns = [{
      title: '序号',
      dataIndex: 'rownumber',
    }, {
      title: '姓名',
      dataIndex: 'xm',
      key: 'xm',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`xm`, {
                initialValue: text && text,
                rules: [{
                  required: true,
                  message: '请输入姓名',
                }],
              })(
                <Input placeholder={`姓名`}/>,
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
      title: '职务',
      dataIndex: 'zw',
      key: 'zw',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`zw`, {
                initialValue: text && text,
                rules: [{
                  required: true,
                  message: '请输入职务',
                }],
              })(
                <Input placeholder={`职务`}/>,
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
      title: '联系电话',
      dataIndex: 'lxdh',
      key: 'lxdh',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`lxdh`, {
                initialValue: text && text,
                // rules:[{
                //   required: true,
                //   pattern: new RegExp(/^(\(\d{3,4}\)|\d{3,4}-)?\d{7,14}$/),
                //   message: '请输入联系电话'
                // }]
              })(
                <Input placeholder={`联系电话`}/>,
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
      width: '150px',
      dataIndex: 'xq',
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

  render() {
    const { lxrData } = this.props;

    let _list = [];
    if (lxrData) {
      _list = lxrData.map((d, idx) => {
        d.rownumber = idx + 1;
        return d;
      });
    }

    return (
      <div>
        <Table
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

export default Lxr;
