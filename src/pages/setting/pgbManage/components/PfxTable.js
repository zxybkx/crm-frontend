import React, { PureComponent } from 'react';
import { Table, Input, InputNumber, message, Row, Col, Form, Popconfirm, Divider, Select, Icon } from 'antd';
import _ from 'lodash';
import uuidV4 from 'uuid/v4';
import { Link } from 'casic-common';

const FormItem = Form.Item;
@Form.create()
export default class Pfx extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      currentData: {},        //当前操作行数据
      visible: true,
      title: '',               //标题
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

  //减法函数
  accSub = (arg1, arg2) => {
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
    return (arg1 * m - arg2 * m) / m;
  };

  validatePoint = (rule, value, callback) => {
    const { total } = this.props;
    const { edit, currentData } = this.state;
    const pattern = new RegExp(/^([1-9][0-9]?(\.\d+)?|100)$/);
    const surplus = this.accSub(100, total);
    let _surplus;
    if (edit && surplus !== 100) {
      _surplus = this.accAdd(surplus, _.toNumber(currentData.items ? currentData.items.zf : null));
    }
    if (_.toNumber(value) > (edit ? _surplus : surplus)) {
      callback('总分超过100!');
    } else if (!pattern.test(value)) {
      callback('请输入正确的总分');
    }
    callback();
  };


  // 标题重复验证
  validataTitle = (rule, value, callback) => {
    const { pfxData } = this.props;
    let titles = [];
    pfxData && pfxData.map(item => {
      item.groupby !== '' && titles.push(item.groupby);
    });
    if (titles.indexOf(value) > -1) {
      callback('重复添加标题');
    } else {
      this.setState({
        title: value,
      });
    }
    callback();
  };

  getDataColumns = () => {
    const { form: { getFieldDecorator } } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'rownumber',
        key: 'rownumber',
        width: '50px',
      },
      {
        title: '评分项',
        dataIndex: 'pfx',
        key: 'pfx',
        //width: '20%',
        render: (text, record) => {
          if (record.add || record.edit) {
            return (
              <FormItem>
                {getFieldDecorator(`pfx`, {
                  initialValue: record.items && record.items.pgx,
                  rules: [{
                    required: true,
                    message: '请输入评分项',
                  }],
                })(
                  <Input placeholder={`示例：五证三照`}/>,
                )}
              </FormItem>
            );
          } else {
            return (
              <span>{record.items && record.items.pgx}</span>
            );
          }
        },
      },
      {
        title: '总分',
        dataIndex: 'zf',
        key: 'zf',
        //width: '15%',
        render: (text, record) => {
          if (record.add || record.edit) {
            return (
              <FormItem>
                {getFieldDecorator(`zf`, {
                  initialValue: record.items && record.items.zf,
                  rules: [{
                    validator: this.validatePoint,
                  }],
                })(
                  <InputNumber min={0} placeholder={`总分`}/>,
                )}
              </FormItem>
            );
          } else {
            return (
              <span>{record.items && record.items.zf}</span>
            );
          }
        },
      },
      {
        title: '评分项说明',
        dataIndex: 'pfsm',
        key: 'pfsm',
        //width: '30%',
        render: (text, record) => {
          let value;
          if (text !== undefined || record.items && record.items.mx) {
            value = text !== undefined ? text : record.items.mx;
          }
          if (record.add || record.edit) {
            return (
              <FormItem>
                {getFieldDecorator(`pfsm`, {
                  initialValue: record.items && record.items.mx,
                  rules: [{
                    required: true,
                    message: '请输入评分项说明',
                  }],
                })(
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="示例：满分3分，近三年内有一项违规扣1分"
                  />,
                )}
              </FormItem>
            );
          } else {
            return (
              <div>
                {value && value.map((o, i) => <span key={o}>{'（'}{i + 1}{'）、'}{o}<br/></span>)}
              </div>
            );
          }
        },
      },
      {
        title: '操作',
        dataIndex: 'cz',
        key: 'cz',
        width: '130px',
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
      },
    ];
    return columns;
  };

  renderFooter = () => {
    const { v } = this.props;
    let total = 0;
    v && v.map(item => {
      if (item.items && item.items.zf) {
        total = total + item.items.zf;
      }
    });
    return (
      <span>{'小计：'}{total}分</span>
    );
  };

  add = () => {
    const { pfxData, form: { validateFields }, k, id } = this.props;
    const { edit, title } = this.state;
    const _pfxData = _.cloneDeep(pfxData);
    const itemId = uuidV4();
    validateFields((errs, fields) => {
      if (errs) return;
      const item = {
        id: itemId,
        groupby: title === '' ? k : title ,     //id存在修改状态
        add: true,
        items: {},
        edit: false,
      };

      if (edit) {
        message.warning('请先完成当前行操作');
      } else {
        _pfxData.push(item);
        _.remove(_pfxData, item => item.groupby === '');
        this.props.changeData(_pfxData);
        this.props.changeEdit(true);
        this.setState({
          edit: true,
          currentData: {},
          visible: false,
        });
      }
    });
  };

  onSave = (record) => {
    const { pfxData, form: { validateFields }, idx } = this.props;
    const _pfxData = _.cloneDeep(pfxData);
    const index = _.findIndex(_pfxData, item => item.id === record.id);
    validateFields((errs, fields) => {
      if (errs) return;
      const item = {
        pgx: fields['pfx'],
        zf: fields['zf'],
        mx: fields['pfsm'],
      };
      _.set(_pfxData[index], 'add', false);
      _.set(_pfxData[index], 'edit', false);
      _.set(_pfxData[index], 'items', item);
      this.props.changeData(_pfxData);
      this.props.changeEdit(false);
      this.setState({
        edit: false,
      });
    });
  };

  onCancel = (record) => {
    const { pfxData } = this.props;
    const _pfxData = _.cloneDeep(pfxData);
    const index = _.findIndex(_pfxData, item => item.id === record.id);
    if (!record.add && record.edit) {
      // 编辑取消
      _.set(_pfxData[index], 'edit', false);
      this.props.changeData(_pfxData);
      this.props.changeEdit(false);
      this.setState({
        edit: false,
      });
    } else {
      _.remove(_pfxData, item => item.id === record.id);
      this.props.changeData(_pfxData);
      this.props.changeEdit(false);
      this.setState({
        edit: false,
      });
    }
  };

  // 点击编辑回调
  onEdit = (record) => {
    const { pfxData } = this.props;
    const { edit } = this.state;
    const _pfxData = _.cloneDeep(pfxData);
    const index = _.findIndex(_pfxData, item => item.id === record.id);
    if (edit) {
      message.warning('请先完成当前行操作');
    } else {
      _.set(_pfxData[index], 'add', false);
      _.set(_pfxData[index], 'edit', true);
      this.props.changeData(_pfxData);
      this.props.changeEdit(true);
      this.setState({
        edit: true,
        currentData: record,
      });
    }
  };

  // 点击删除回调
  onDelete = (record) => {
    const { pfxData } = this.props;
    const { edit } = this.state;
    const _pfxData = _.cloneDeep(pfxData);
    if (edit) {
      message.warning('请先完成当前行操作');
    } else {
      _.remove(_pfxData, item => item.id === record.id);
      this.props.changeData(_pfxData);
      this.props.changeEdit(false);
      this.setState({
        edit: false,
      });
    }
  };

  render() {
    const { form: { getFieldDecorator }, k, v, id, idx } = this.props;
    const { visible } = this.state;
    let _list = [];

    if (v && k !== '') {
      _list = v.map((d, idx) => {
        d.rownumber = idx + 1;
        return d;
      });
    }
    return (
      <div>
        <Row>
          <Col span={12}>
            <FormItem label={'标题：'} labelCol={{ span: 6 }} wrapperCol={{ span: 6 }}>
              {
                (k=== '') ?
                  getFieldDecorator(`groupby`, {
                    initialValue: k && k,
                    rules: [
                      {required: true, message: '请输入标题名称'},
                      {
                        validator: this.validataTitle
                      }],
                  })(
                    <Input placeholder="请输入标题" allowClear/>
                  ) : <span>{k && k}</span>
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={15} offset={3}>
            <Table
              dataSource={_list}
              pagination={false}
              columns={this.getDataColumns()}
              footer={() => this.renderFooter()}
              bordered/>
            <div style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
              <a onClick={this.add}>
                <Icon type="plus-circle" theme="twoTone" style={{ marginRight: 2 }}/>
                新增评分项
              </a>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
