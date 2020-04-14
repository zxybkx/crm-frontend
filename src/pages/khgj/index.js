/**
 * Created by sam on 2019/7/1.
 */
import React, {PureComponent} from 'react';
import {DatePicker, Button, Form, Row, Col, Input, Table, Icon, Tooltip, Divider} from 'antd';
import {connect} from 'dva';
import _ from 'lodash';
import LineWrap from '@/components/LineWrap';
import {routerRedux} from 'dva/router';
import PageLayout from '@/layouts/PageLayout';
import moment from 'moment';
import styles from './index.less';
import {AdvancedSearch, ToolBar} from 'casic-common';

@Form.create()
@connect(state => ({
  khgj: state.khgj,
  loading: state.loading.effects['khgj/getKhgjList']
}))
export default class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      formValues: {},
      btnState: '',
      pgbTypes: []
    };
  }

  componentDidMount() {
    const {dispatch, location: {query: {type}}} = this.props;
    let payload;
    payload = {
      'actived.equals': 'T',
      'enabled.equals': 'T',
      type: type ? type : null,
      advanced: true,
      sort: 'createdDate,desc',
    };
    this.loadData(payload);

    dispatch({
      type: 'khgj/getKhgjType',
      payload: {
        name: 'khgj-gjlx'
      }
    }).then(({success, data}) => {
      if (success && data) {
        this.setState({
          pgbTypes: data
        })
      }
    });
  };

  handleSearch = (conditions, zt) => {
    if (zt) {
      const payload = {
        "createdEndDate": conditions._jlsj && moment(conditions._jlsj).endOf('day'),
        "createdStartDate": conditions.jlsj && moment(conditions.jlsj).startOf('day'),
        "lastModifiedEndDate": conditions._gxsj && moment(conditions._gxsj).endOf('day'),
        "lastModifiedStartDate": conditions.gxsj && moment(conditions.gxsj).startOf('day'),
        "name": conditions.khmc,
        advanced: true,
        sort: 'createdDate,desc'
      };
      this.loadData(payload);
    } else {
      const payload = {
        "name": conditions.khmc,
        advanced: false,
        sort: 'createdDate,desc'
      };
      this.loadData(payload);
    }
  };

  loadData = (payload) => {
    const {dispatch, location: {query: {type, id}}} = this.props;

    //去除查询条件中为空的字段
    _.forEach(payload, (value, key) => {
      if (!value || value === '') {
        delete payload[key]
      }
    });

    this.setState({
      id: ''
    }, () => {
      dispatch({
        type: 'khgj/getKhgjList',
        payload: {
          ...payload,
          type: type ? type : null,
          customerId: id
        },
      }).then(() => {
        this.setState({
          formValues: payload,
        });
      })
    });
  };

  checkKhgj = (record) => {
    const {dispatch} = this.props;
    const path = record.type === '1' ? `/khgj/ckjl` : `/khgj/sddcDetail`;
    dispatch(
      routerRedux.push({
        pathname: path,
        query: {
          id: record.customerId,
          khgjId: record.id
        }
      })
    )
  };

  changeKhgj = (record) => {
    const {dispatch} = this.props;
    if (record.type === '1') {
      dispatch(
        routerRedux.push({
          pathname: `/khgj/xzrc`,
          query: {
            id: record.customerId,
            khgjId: record.id
          }
        })
      )
    } else {
      dispatch(
        routerRedux.push({
          pathname: `/khgj/sddc`,
          query: {
            customerId: record.customerId,
            id: record.id
          }
        })
      )
    }
  };

  getDataColumns = () => {
    const {pgbTypes} = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'rownumber',
        key: 'rownumber',
        width: '50px'
      }, {
        title: '客户名称',
        dataIndex: 'customerName',
        key: 'customerName',
        width: '27%',
        render: (text, record) => {
          return (
            <LineWrap title={text} lineClampNum={1}/>
          )
        }
      }, {
        title: '跟进类型',
        dataIndex: 'type',
        key: 'type',
        width: '10%',
        render: (text, record) => {
          let typeName;
          pgbTypes && pgbTypes.map((item, i) => {
            if (item.useName === record.type) {
              typeName = item.name
            }
          });
          return (<span>{typeName}</span>)
        }
      }, {
        title: '跟进目的',
        dataIndex: 'gjmd',
        key: 'gjmd',
        width: '15%',
        render: (text) => <LineWrap title={text} lineClampNum={1}/>
      }, {
        title: '记录日期',
        dataIndex: 'createdDate',
        key: 'createdDate',
        width: '8%',
        render: (text, record) => {
          if (record.createdDate) {
            const date = moment(record.createdDate).format('YYYY-MM-DD');
            return (<span>{date}</span>)
          }
        }
      }, {
        title: '最后更新日期',
        dataIndex: 'lastModifiedDate',
        key: 'lastModifiedDate',
        width: '9%',
        render: (text, record) => {
          if (record.lastModifiedDate) {
            const date = moment(record.lastModifiedDate).format('YYYY-MM-DD');
            return (<span>{date}</span>)
          }
        }
      }, {
        title: '记录人',
        dataIndex: 'createdName',
        width: '7%'
      }, {
        title: '最近更新人',
        dataIndex: 'lastModifiedName',
        width: '8%'
      }, {
        title: '操作',
        dataIndex: 'ck',
        key: 'ck',
        width: '120px',
        render: (text, record) => {
          return (
            <div>
              <a onClick={() => {
                this.checkKhgj(record)
              }}
              ><Icon type="file" style={{marginRight: 2}}/>查看</a>
              <Divider type='vertical'/>
              <a onClick={() => {
                this.changeKhgj(record)
              }}><Icon type="edit" style={{marginRight: 2}}/>修改</a>
            </div>
          )
        }
      }
    ];
    return columns;
  };

  getTableHeight = () => {
    const clientHeight = document.body.clientHeight;
    return clientHeight - 315;
  };

  handleStandardTableChange = (page, filters, sorter) => {
    const {formValues} = this.state;

    this.loadData({
      ...formValues,
      page: page.current - 1 > 0 ? page.current - 1 : 0,
      size: page.pageSize
    });
  };

  addKhgj = () => {
    const {dispatch, location: {query: {id}}} = this.props;
    const path = `/khgj/xzrc`;
    dispatch(
      routerRedux.push({
        pathname: path,
        query: {
          id,
          add: true
        }
      })
    );
  };

  addSddc = () => {
    const {dispatch, location: {query: {id}}} = this.props;
    const path = `/khgj/sddc`;
    dispatch(
      routerRedux.push({
        pathname: path,
        query: {
          customerId: id,
        }
      })
    );
  };

  render() {
    const {userList, pageSize, total, current} = this.props.khgj;
    const {loading, location: {query: {id}}} = this.props;
    const breadcrumbs = [
      {icon: 'home', path: './customer'},
      {label: '客户信息', path: '/customer'},
      {label: '客户信息详情', path: `/customer/customerDetail?id=${id}`},
      {label: '客户拜访'},
    ];
    const searchFields = [
      {
        name: 'khmc', label: '客户名称', type: 'text',
      },
      {
        name: 'jlsj', label: '记录开始时间', type: 'date'
      },
      {
        name: '_jlsj', label: '记录结束时间', type: 'date'
      },
      {
        name: 'gxsj', label: '最后更新开始时间', type: 'date'
      },
      {
        name: '_gxsj', label: '最后更新结束时间', type: 'date'
      }
    ];

    const tools = [{
      label: '新增日常跟进记录',
      icon: 'plus',
      type: 'primary',
      handler: () => this.addKhgj()
    }, {
      label: '新增实地调查记录',
      icon: 'plus',
      type: 'primary',
      handler: () => this.addSddc()
    }];

    let _list = [];
    if (userList) {
      _list = userList.map((d, idx) => {
        d.key = idx;
        d.rownumber = pageSize * (current - 1) + idx + 1;
        return d;
      })
    }

    const paginationProps = {
      showSizeChanger: true,
      pageSize, total, current,
      showTotal: (total, range) => `当前: ${range[0]}-${range[1]} 共 ${total} 条`,
    };

    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.container}>
          <div className={styles.content}>
            <ToolBar tools={tools}
                     search={<AdvancedSearch useFilter={false} onSearch={this.handleSearch} fields={searchFields}/>}/>
            <Table
              scroll={{y: this.getTableHeight()}}
              dataSource={_list}
              pagination={paginationProps}
              loading={loading}
              columns={this.getDataColumns()}
              rowClassName={(record, index) => index % 2 === 0 ? styles.lel : ''}
              bordered
              onChange={this.handleStandardTableChange}/>
          </div>
        </div>
      </PageLayout>
    )
  }
}
