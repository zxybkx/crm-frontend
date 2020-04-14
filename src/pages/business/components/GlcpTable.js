import React, { Component } from 'react';
import { Form, Table, Button, Popconfirm, Divider, Input, message } from 'antd';
import _ from 'lodash';
import { Link } from 'casic-common';
import { connect } from 'dva';
import styles from '../index.less';
import ProductModal from './ProductModal';

const { Item: FormItem } = Form;
@Form.create()
@connect((state) => ({
  business: state.business,
}))

export default class Glcp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedProductRecord: {},           //选择的产品表格数据
      totalSum: null,                         //总额
      discountSum: null,                      //折后价
      selectedGlcp: {},                    //选择的关联产品数据
      currentSl: this.props.cpData.sl,
      currentZk: this.props.cpData.zk,
    };
  }

  //新增按钮回调
  add = () => {
    const { tableEdit } = this.props;
    if (tableEdit) {
      message.warning('请先完成当前行操作');
    } else {
      this.setState({
        visible: true,
      });
    }
  };

  //保存
  onSave = (record) => {
    const { form: { validateFields }, businessId, dispatch } = this.props;
    const { selectedProductRecord } = this.state;
    validateFields((errs, fields) => {
      if (errs) return;
      const payload = {
        businessId,
        productId: selectedProductRecord.id,
        sl: fields['sl'],
        ze: fields['ze'],
        zk: fields['zk'],
        zkhjg: fields['zkhjg'],
      };
      if (record.add) {
        // 新增
        dispatch({
          type: 'business/addBusinessProduct',
          payload: payload,
        }).then(({ success, data }) => {
          if (success && data) {
            message.success('保存成功');
            this.props.loadData();
            this.props.changeEditState(false);
            this.setState({
              selectedProductRecord: {},
              selectedGlcp: {},
              totalSum: null,
              discountSum: null,
            });
          } else {
            message.error('保存失败');
          }
        });
      } else if (record.edit) {
        // 修改
        dispatch({
          type: 'business/editBusinessProduct',
          payload: {
            ...payload,
            id: record.id,
          },
        }).then(({ success, data }) => {
          if (success && data) {
            message.success('保存成功');
            this.props.loadData();
            this.props.changeEditState(false);
            this.setState({
              selectedProductRecord: {},
              selectedGlcp: {},
              totalSum: null,
              discountSum: null,
            });
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
    this.setState({
      selectedProductRecord: {},
      totalSum: null,
      discountSum: 0,
      selectedGlcp: {},
    });
  };

  //点击编辑回调
  onEdit = (record) => {
    const { cpData, form: { setFieldsValue }, tableEdit } = this.props;
    const _cpData = _.cloneDeep(cpData);
    const index = _.findIndex(_cpData, item => item.id === record.id);

    if (tableEdit) {
      message.warning('请先完成当前行操作');
    } else {
      _.set(_cpData[index], 'edit', true);
      this.props.changeGlcpData(_cpData);
      this.props.changeEditState(true);
      this.setState({
        selectedGlcp: record,
        totalSum: record.ze,
        discountSum: record.zkhjg,
        selectedProductRecord: record.crmProductdto,
      }, () => {
        setFieldsValue({
          ['cpmc']: record.crmProductdto.cpmc,
        });
      });
    }
  };

  //点击删除回调
  onDelete = (record) => {
    const { dispatch, tableEdit } = this.props;
    if (tableEdit) {
      message.warning('请先完成当前行操作');
    } else {
      dispatch({
        type: 'business/deleteProduct',
        payload: { id: record.id },
      }).then((success) => {
        if (success) {
          this.props.loadData();
          this.props.changeEditState(false);
          this.setState({
            selectedProductRecord: {},
          });
        }
      });
    }
  };

  selectProduct = () => {
    this.setState({
      visible: true,
    });
  };

  getDataColumns = () => {
    const { form: { getFieldDecorator } } = this.props;
    const { selectedProductRecord, totalSum, discountSum } = this.state;
    const columns = [{
      title: '序号',
      dataIndex: 'rownumber',
      width: '50px',
    }, {
      title: '产品名称',
      dataIndex: 'cpmc',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`cpmc`, {
                initialValue: record.crmProductdto && record.crmProductdto.cpmc,
                rules: [{
                  required: true,
                  message: '请输入产品名称',
                }],
              })(
                <a onClick={this.selectProduct}>
                  {
                    (selectedProductRecord && selectedProductRecord.cpmc) || (!_.isEmpty(record.crmProductdto) && record.crmProductdto.cpmc) || '选择产品'
                  }
                </a>,
              )}
            </FormItem>
          );
        } else {
          return (
            <span>{record.crmProductdto.cpmc}</span>
          );
        }
      },
    }, {
      title: '单价(元)',
      dataIndex: 'dj',
      // width: '100px',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`dj`, {
                initialValue: text && text,
              })(
                <span>{(selectedProductRecord && selectedProductRecord.dj) || (record.crmProductdto && record.crmProductdto.dj && record.crmProductdto.dj)}</span>,
              )}
            </FormItem>
          );
        } else {
          return (
            <span>{record.crmProductdto.dj && record.crmProductdto.dj}</span>
          );
        }
      },
    }, {
      title: '数量',
      dataIndex: 'sl',
      // width: '90px',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`sl`, {
                initialValue: text && text,
                rules: [{
                  pattern: new RegExp(/^(\d{1,10})$/),
                  message: '请输入正确的数量',
                }],
              })(
                <Input style={{ width: '90px' }} onBlur={(e) => this.getNumber(e, record)}/>,
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
      title: '库存',
      dataIndex: 'kc',
      // width: '90px',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`kc`, {
                initialValue: text && text,
              })(
                <span>{(selectedProductRecord && selectedProductRecord.kcsl) || (record.crmProductdto && record.crmProductdto.kcsl && record.crmProductdto.kcsl)}</span>,
              )}
            </FormItem>
          );
        } else {
          return (
            <span>{record.crmProductdto.kcsl && record.crmProductdto.kcsl}</span>
          );
        }
      },
    }, {
      title: '供货周期',
      dataIndex: 'ghzq',
      // width: '100px',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`ghzq`, {
                initialValue: text && text,
              })(
                <span>{(selectedProductRecord && selectedProductRecord.gyzq) || (record.crmProductdto && record.crmProductdto.gyzq && record.crmProductdto.gyzq)}</span>,
              )}
            </FormItem>
          );
        } else {
          return (
            <span>{record.crmProductdto.gyzq && record.crmProductdto.gyzq}</span>
          );
        }
      },
    }, {
      title: '总额(元)',
      dataIndex: 'ze',
      // width: '100px',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`ze`, {
                initialValue: text && text,
              })(
                <span>{totalSum}</span>,
              )}
            </FormItem>
          );
        } else {
          return (
            <span>{text}</span>
          );
        }
      },
    }, {
      title: '折扣(折)',
      dataIndex: 'zk',
      // width: '90px',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`zk`, {
                initialValue: text && text,
                rules: [{
                  pattern: new RegExp(/^([0-9](\.\d{1,2})?|10)$/),
                  message: '请输入正确的折扣',
                }],
              })(
                <Input onBlur={(e) => this.countDiscountPrice(e)}/>,
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
      title: '折扣后价格(元)',
      dataIndex: 'zkhjg',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`zkhjg`, {
                initialValue: text && text,
              })(
                <span>{discountSum}</span>,
              )}
            </FormItem>
          );
        } else {
          return (<span>{text}</span>);
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

  getNumber = (e, record) => {
    const { selectedProductRecord, currentZk } = this.state;
    const { form: { setFieldsValue } } = this.props;
    if (selectedProductRecord.dj && e.target.value) {
      const totalSum = Math.round(selectedProductRecord.dj * e.target.value);
      const discountSum = (currentZk ? currentZk : record.zk) && Math.round(totalSum * (currentZk ? currentZk : record.zk) / 10);
      setFieldsValue({ ['ze']: totalSum });
      setFieldsValue({ ['zkhjg']: discountSum });
      this.setState({ totalSum, discountSum, currentSl: e.target.value });
    }
  };

  countDiscountPrice = (e) => {
    const { form: { setFieldsValue } } = this.props;
    const { totalSum } = this.state;
    if (e.target.value) {
      const discountSum = Math.round(totalSum * e.target.value / 10);
      setFieldsValue({ ['zkhjg']: discountSum });
      this.setState({ discountSum, currentZk: e.target.value });
    }
  };

  renderGlcpHeader = () => {
    return (
      <div className={styles.tableContent}>
        <span>关联产品</span>
      </div>
    );
  };

  handleOk = (record) => {
    const { cpData, form: { setFieldsValue }, tableEdit } = this.props;
    const { selectedGlcp } = this.state;
    const _cpData = _.cloneDeep(cpData);
    if (selectedGlcp.id || tableEdit) {
      const index = _.findIndex(_cpData, item => item.id === selectedGlcp.id);
      _.set(_cpData[index], 'crmProductdto', { cpmc: record.cpmc });
      const totalSum = record.dj ? selectedGlcp.sl ? Math.round(record.dj * selectedGlcp.sl) : null : null;
      const discountSum = totalSum ? Math.round((totalSum * selectedGlcp.zk) / 10) : null;
      setFieldsValue({ ['ze']: totalSum });
      setFieldsValue({ ['zkhjg']: discountSum });
      this.setState({ totalSum, discountSum });
    } else {
      const item = { add: true, crmProductdto: { cpmc: record.cpmc } };
      _cpData.push(item);
      this.props.changeEditState(true);
      this.setState({
        totalSum: null,
        discountSum: null,
      });
    }
    this.props.changeGlcpData(_cpData);
    this.setState({
      visible: false,
      selectedProductRecord: record,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { cpData } = this.props;
    const { visible } = this.state;
    let _list = [];
    if (cpData) {
      _list = cpData.map((d, idx) => {
        d.rownumber = idx + 1;
        return d;
      });
    }

    return (
      <div style={{ marginTop: 20 }}>
        <Table
          title={() => this.renderGlcpHeader()}
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
        <ProductModal visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}/>
      </div>
    );
  }
}
