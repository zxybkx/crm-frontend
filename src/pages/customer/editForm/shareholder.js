import React, { PureComponent } from 'react';
import { Button, Popconfirm, Form, Divider, Table, Input, Select, message } from 'antd';
import _ from 'lodash';
import uuidV4 from 'uuid/v4';
import LineWrap from '@/components/LineWrap';
import { Link } from 'casic-common';

const { Item: FormItem } = Form;
@Form.create()
export default class Shareholder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      currentData: {},        //当前操作行数据
    };
  }

  //加法函数
  accAdd = (arg1, arg2) => {
    let r1, r2, m;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
  };

  validatePoint = (rule, value, callback) => {
    const { surplus } = this.props;
    const { edit, currentData } = this.state;
    const pattern = new RegExp(/^([0-9][0-9]?(\.\d+)?|100)$/);
    let _surplus;
    if (edit && surplus !== 100) {
      _surplus = this.accAdd(surplus, _.toNumber(currentData.czbl ? currentData.czbl : null));
    }

    if (_.toNumber(value) > (edit ? _surplus : surplus)) {
      callback('出资比例超过100%!');
    } else if (!pattern.test(value)) {
      callback('请输入正确的出资比例');
    }
    callback();
  };

  getDataColumns = () => {
    const { form: { getFieldDecorator } } = this.props;
    const columns = [{
      title: '序号',
      width: '50px',
      dataIndex: 'rownumber',
    }, {
      title: '股东名称',
      dataIndex: 'gdmc',
      key: 'gdmc',
      width: '120px',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`gdmc`, {
                initialValue: text && text,
                rules: [{ required: true, message: '请输入股东名称' }],
              })(
                <Input placeholder={`股东名称`}/>,
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
      title: '认缴出资额',
      dataIndex: 'rjcze',
      key: 'rjcze',
      width: '120px',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`rjcze`, {
                initialValue: text && text,
                rules: [{
                  message: '请输入正确的认缴出资额',
                  pattern: new RegExp(/^[0-9]*$/),
                }],
              })(
                <Input placeholder={`认缴出资额`}/>,
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
      title: '币种',
      dataIndex: 'dw',
      key: 'dw',
      width: '100px',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`dw`, {
                initialValue: text && text,
              })(
                <Select placeholder={`请选择单位`} style={{ width: '100%' }}>
                  <Option key='人民币'>人民币</Option>
                  <Option key='港币'>港币</Option>
                  <Option key='美元'>美元</Option>
                  <Option key='欧元'>欧元</Option>
                  <Option key='英镑'>英镑</Option>
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
      title: '出资比例%',
      dataIndex: 'czbl',
      key: 'czbl',
      width: '100px',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`czbl`, {
                initialValue: text && text,
                rules: [{
                  validator: this.validatePoint,
                }],
              })(
                <Input placeholder={`出资比例`}/>,
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

  addShareholder = () => {
    const { gdData } = this.props;
    const { edit } = this.state;
    const _gdData = _.cloneDeep(gdData);
    const itemId = uuidV4();
    const item = {
      id: itemId,
      add: true,
      edit: false,
    };
    if (edit) {
      message.warning('请先完成当前行操作');
    } else {
      _gdData.push(item);
      this.props.changeGdxx(_gdData);
      this.setState({
        edit: true,
        currentData: {},
      });
    }
  };

  //保存
  onSave = (record) => {
    const { gdData, form: { validateFields } } = this.props;
    const _gdData = _.cloneDeep(gdData);
    const index = _.findIndex(_gdData, item => item.id === record.id);
    validateFields((errs, fields) => {
      if (errs) return;
      _.set(_gdData[index], 'add', false);
      _.set(_gdData[index], 'edit', false);
      _.set(_gdData[index], 'gdmc', fields['gdmc']);
      _.set(_gdData[index], 'rjcze', fields['rjcze']);
      _.set(_gdData[index], 'dw', fields['dw']);
      _.set(_gdData[index], 'czbl', fields['czbl']);
      this.props.changeGdxx(_gdData);
      this.setState({
        edit: false,
      });
    });
  };

  //点击取消
  onCancel = (record) => {
    const { gdData } = this.props;
    const _gdData = _.cloneDeep(gdData);
    if (!record.add && record.edit) {
      //编辑取消
      const index = _.findIndex(_gdData, item => item.id === record.id);
      _.set(_gdData[index], 'edit', false);
      this.props.changeGdxx(_gdData);
      this.setState({
        edit: false,
      });
    } else {
      //新增取消
      _.remove(_gdData, item => item.id === record.id);
      this.props.changeGdxx(_gdData);
      this.setState({
        edit: false,
      });
    }
  };

  //点击编辑回调
  onEdit = (record) => {
    const { gdData } = this.props;
    const { edit } = this.state;
    const _gdData = _.cloneDeep(gdData);
    const index = _.findIndex(_gdData, item => item.id === record.id);
    if (edit) {
      message.warning('请先完成当前行操作');
    } else {
      _.set(_gdData[index], 'add', false);
      _.set(_gdData[index], 'edit', true);
      this.props.changeGdxx(_gdData);
      this.setState({
        edit: true,
        currentData: record,
      });
    }
  };

  //点击删除回调
  onDelete = (record) => {
    const { gdData } = this.props;
    const { edit } = this.state;
    const _gdData = _.cloneDeep(gdData);
    if (edit) {
      message.warning('请先完成当前行操作');
    } else {
      _.remove(_gdData, item => item.id === record.id);
      this.props.changeGdxx(_gdData);
      this.setState({
        edit: false,
      });
    }
  };

  render() {
    const { gdData, surplus } = this.props;
    let _list = [];
    if (gdData) {
      _list = gdData.map((d, idx) => {
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
          bordered
          footer={() => <span>{`剩余出资比例${surplus}%`}</span>}
        />
        <Button
          size="small"
          type='primary'
          style={{ marginTop: '10px' }}
          icon={'plus'}
          ghost
          onClick={() => this.addShareholder()}>添加</Button>
      </div>
    );
  }
}
