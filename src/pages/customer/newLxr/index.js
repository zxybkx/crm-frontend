import React, {Component} from 'react';
import {Form, Table, Button, Popconfirm, Divider, message, Input} from 'antd';
import {connect} from 'dva';
import _ from 'lodash';
import PageLayout from '@/layouts/PageLayout';
import {Link} from 'casic-common';
import LineWrap from '@/components/LineWrap';
import styles from '../index.less';

const FormItem = Form.Item;

@Form.create()
@connect((state) => ({
  lxr: state.lxr
}))

class Lxr extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      total: 0,
      current: 1,
      pageSize: 10,
      params: {},
      edit: false,
    }
  }

  componentDidMount() {
    const {location: {query: {id}}} = this.props;
    const payload = {
      'actived.equals': 'T',
      'enabled.equals': 'T',
      'customerId.equals': id ? id : null,
      advanced: true,
      sort: 'createdDate,desc',
    };
    this.loadData(payload);
  }

  loadData = (params = {}) => {
    const {dispatch, location: {query: {id}}} = this.props;
    const {pageSize: size} = params;

    //去除查询条件中为空的字段
    _.forEach(params, (value, key) => {
      if (value === null || value === '') {
        delete params[key]
      }
    });

    dispatch({
      type: 'lxr/getLxrList',
      payload: ({
        'actived.equals': 'T',
        'enabled.equals': 'T',
        'customerId.equals': id ? id : null,
        advanced: true,
        sort: 'createdDate,desc',
      }),
    }).then(({success, data, page}) => {
      this.setState({
        dataList: data,
        total: page ? page.total : 0,
        params: params
      });
    })
  };

  //新增按钮回调
  add = () => {
    const {location: {query: {khmc}}} = this.props;
    const {dataList, edit} = this.state;
    const _dataList = _.cloneDeepWith(dataList);
    const item = {
      crmCustomer: {
        khmc: khmc
      },
      add: true
    };
    if (edit) {
      message.warning('请先完成当前行操作')
    } else {
      _dataList.push(item);
      const currentpage = Math.ceil(_dataList.length / 10);
      this.setState({
        dataList: _dataList,
        edit: true,
        current: currentpage
      })
    }
  };

  onSave = (record) => {
    const {dispatch, form: {validateFields}, location: {query: {id}}} = this.props;
    const {params} = this.state;
    validateFields((errs, fields) => {
      if (errs) return;
      if (record.add) {
        dispatch({
          type: 'lxr/addLxr',
          payload: {
            ...fields,
            customerId: id
          },
        }).then(({success, data}) => {
          if (success && data) {
            message.success('保存成功');
            this.loadData(params);
            this.setState({
              edit: false
            })
          }
        });
      } else if (record.edit) {
        dispatch({
          type: 'lxr/modifyLxr',
          payload: {
            ...fields,
            id: record.id,
            customerId: id
          },
        }).then(({success, data}) => {
          if (success && data) {
            message.success('保存成功');
            this.loadData(params);
            this.setState({
              edit: false
            })
          }
        });
      }
    })
  };

  onEdit = (record) => {
    const {dataList, edit} = this.state;
    const _dataList = _.cloneDeep(dataList);
    const index = _.findIndex(_dataList, item => item.id === record.id);
    if (edit) {
      message.warning('请先完成当前行操作')
    } else {
      _.set(_dataList[index], 'edit', true);
      this.setState({
        dataList: _dataList,
        edit: true
      })
    }
  };

  onDelete = (record) => {
    const {dispatch} = this.props;
    const {params, edit} = this.state;
    const id = record.id;
    if (edit) {
      message.warning('请先完成当前行操作')
    } else {
      dispatch({
        type: 'lxr/deleteLxr',
        payload: {id}
      }).then(({success, data}) => {
        if (success) {
          this.loadData(params);
          this.setState({
            edit: false
          })
        }
      })
    }
  };

  onCancel = () => {
    const {params} = this.state;
    this.loadData(params);
    this.setState({
      edit: false
    })
  };

  getDataColumns = () => {
    const {form: {getFieldDecorator}} = this.props;
    const columns = [{
      title: '序号',
      dataIndex: 'rownumber',
      width: '50px'
    }, {
      title: '客户名称',
      dataIndex: 'crmCustomer.khmc',
      render: (text, record) => <LineWrap title={text} lineClampNum={1}/>
    }, {
      title: '姓名',
      dataIndex: 'xm',
      width: '120px',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`xm`, {
                initialValue: text && text,
                rules: [{
                  required: true,
                  message: '请输入姓名'
                }]
              })(
                <Input/>
              )}
            </FormItem>
          )
        } else {
          return (
            <span>{text && text}</span>
          )
        }
      }
    }, {
      title: '职务',
      dataIndex: 'zw',
      width: '120px',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`zw`, {
                initialValue: text && text,
                rules: [{
                  required: true,
                  message: '请输入职务'
                }]
              })(
                <Input/>
              )}
            </FormItem>
          )
        } else {
          return (
            <span>{text && text}</span>
          )
        }
      }
    }, {
      title: '联系电话',
      dataIndex: 'lxdh',
      width: '150px',
      render: (text, record) => {
        if (record.add || record.edit) {
          return (
            <FormItem>
              {getFieldDecorator(`lxdh`, {
                initialValue: text && text,
                // rules:[{
                //   required: true,
                //   pattern: new RegExp(/^(\(\d{3,4}\)|\d{3,4}-)?\d{7,14}$/),
                //   message: '请输入正确的联系电话'
                // }]
              })(
                <Input/>
              )}
            </FormItem>
          )
        } else {
          return (
            <span>{text && text}</span>
          )
        }
      }
    }, {
      title: '操作',
      dataIndex: 'xq',
      width: '150px',
      render: (text, record) => {
         if (record.id && !record.edit) {
          return (
            <span>
            <Link onClick={() => {
              this.onEdit(record)
            }} icon='edit'>编辑</Link>
            <Divider type='vertical'/>
          <Popconfirm title="确认删除吗？" onConfirm={() => this.onDelete(record)} okText="是" cancelText="否">
            <Link icon='delete' type='danger'>删除</Link>
          </Popconfirm>
          </span>
          )
        } else{
          return (
            <span>
            <Link onClick={() => {
              this.onSave(record)
            }} icon='save'>保存</Link>
            <Divider type='vertical'/>
          <Popconfirm title="确认取消吗？" onConfirm={() => this.onCancel(record)} okText="是" cancelText="否">
            <Link icon='close-circle' type='danger'>取消</Link>
          </Popconfirm>
          </span>
          )
        }
      }
    }];
    return columns;
  };

  onChange = (page) => {
    this.setState({
      current: page
    })
  };

  render() {
    const {location: {query: {id}}} = this.props;
    const {dataList, current} = this.state;
    const breadcrumbs = [
      {icon: 'home', path: '/'},
      {label: '客户信息', path: '/customer'},
      {label: '客户信息详情', path: `/customer/customerDetail?id=${id}`},
      {label: '联系人'}
    ];

    let _list = [];
    if (dataList) {
      _list = dataList.map((d, idx) => {
        d.rownumber = idx + 1;
        return d;
      });
    }

    const paginationProps = {
      showSizeChanger: true,
      current,
      onChange: this.onChange,
      showTotal: (total, range) => `当前: ${range[0]}-${range[1]} 共 ${total} 条`,
    };

    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.content}>
          <div className={styles.apply}>
            <Button
              size="small"
              type='primary'
              style={{marginBottom: '10px'}}
              icon='plus'
              onClick={() => this.add()}>新增</Button>
            <Table
              dataSource={_list}
              pagination={paginationProps}
              columns={this.getDataColumns()}
              rowClassName={(record, index) => index % 2 === 0 ? styles.lel : ''}
              rowKey={(record) => record.id}
              bordered
            />
          </div>
        </div>
      </PageLayout>
    )
  }
}

export default Lxr;
