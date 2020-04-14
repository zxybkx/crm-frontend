/**
 * Created by sam on 2019/7/1.
 */
import React, { PureComponent } from 'react';
import { message, Button, Popconfirm, Row, Col, Table, Divider } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import LineWrap from '@/components/LineWrap';
import { routerRedux } from 'dva/router';
import PageLayout from '@/layouts/PageLayout';
import { AdvancedSearch, ToolBar } from 'casic-common';
import styles from './index.less';

const breadcrumbs = [
  { icon: 'home', path: '/' },
  { label: '客户信息', path: './customer' },
];
@connect(({ customer, loading }) => ({
  customer,
  loading: loading.effects['customer/getCustomersList'],
}))

export default class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      khzt: '',
      id: '',
      formValues: {},
      optionsData: {},
      khztOptions: [],      //客户状态下拉选项值
      filteredInfo: null,      //筛选的数据
      isShow: false,        //是否展示下方说明
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { khzt } = this.state;
    let payload;
    payload = {
      'khzt.equals': khzt ? khzt : null,
      'actived.equals': 'T',
      'enabled.equals': 'T',
      advanced: true,
      sort: 'createdDate,desc',
    };
    this.loadData(payload);

    dispatch({
      type: 'customer/getKhzzOptions',
      payload: {
        name: 'khxx-khzt',
      },
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          khztOptions: data,
        });
      }
    });
  }

  handleSearch = (conditions, zt) => {
    const payload = {
      'khmc.contains': conditions.khmc,
      'shxydm.contains': conditions.shxydm,
      'khzt.equals': conditions.khzt,
      'actived.equals': 'T',
      'enabled.equals': 'T',
      advanced: zt,
      sort: 'createdDate,desc',
    };
    this.setState({
      filteredInfo: null,
    });
    this.loadData(payload);
  };

  handleStandardTableChange = (page, filters) => {
    const { formValues } = this.state;
    if (!_.isEmpty(filters)) {
      delete formValues['khzt.equals'];
    }
    this.setState({
      filteredInfo: filters,
    });
    this.loadData({
      ...formValues,
      page: page.current - 1 > 0 ? page.current - 1 : 0,
      size: page.pageSize,
      'khzt.in': filters ? filters.khzt : null,
    });
  };

  loadData = (payload) => {
    const { dispatch } = this.props;

    //去除查询条件中为空的字段
    _.forEach(payload, (value, key) => {
      if (value === null || value === '') {
        delete payload[key];
      }
    });

    dispatch({
      type: 'customer/getCustomersList',
      payload: payload,
    }).then(() => {
      this.setState({
        formValues: payload,
      });
    });
  };

  //点击新增回调
  AddCustomer = () => {
    const { dispatch } = this.props;
    const path = `/customer/editForm`;
    dispatch(
      routerRedux.push({
        pathname: path,
      }),
    );
  };

  //点击修改回调
  EditCustomer = () => {
    const { dispatch } = this.props;
    const { id } = this.state;
    if (_.isEmpty(id)) {
      this.tooltips();
    } else {
      const path = `/customer/editForm`;
      dispatch(
        routerRedux.push({
          pathname: path,
          query: {
            id: id,
          },
        }),
      );
    }
  };

  tooltips = () => {
    message.warning('请选择一个用户');
  };

  //修改客户状态
  changeCustomerZt = (khzt) => {
    const { dispatch } = this.props;
    const { id, formValues } = this.state;
    if (_.isEmpty(id)) {
      this.tooltips();
    } else {
      dispatch({
        type: 'customer/changeKhzt',
        payload: { id, khzt },
      });
      this.loadData(formValues);
      this.setState({
        khzt: '',
      });
    }
  };

  //点击详情回调
  getInfo = (record) => {
    const { dispatch } = this.props;
    if (record.id) {
      dispatch(
        routerRedux.push({
          pathname: `/customer/customerDetail`,
          query: {
            id: record.id,
          },
        }),
      );
    }
  };

  getDataColumns = () => {
    const { khztOptions, filteredInfo } = this.state;
    const columns = [{
      title: '序号',
      width: '50px',
      dataIndex: 'rownumber',
    }, {
      title: '客户名称',
      dataIndex: 'khmc',
      render: (text, record) => {
        return (
          <LineWrap title={text} lineClampNum={1}/>
        );
      },
    }, {
      title: '企业性质',
      dataIndex: 'extraQyxz',
      width: '150px',
    }, {
      title: '客户状态',
      dataIndex: 'khzt',
      width: '120px',
      filters: [
        { text: '待准入', value: '1' },
        { text: '已准入', value: '2' },
        { text: '黑名单', value: '3' },
        { text: '已退出', value: '4' },
        { text: '已删除', value: '5' },
      ],
      onFilter: (value, record) => record.khzt.includes(value),
      filteredValue: filteredInfo ? filteredInfo.khzt : null,
      render: (text, record) => {
        const currentKhzt = _.find(khztOptions, item => text === item.useName);
        return (
          <span>{currentKhzt && currentKhzt.name}</span>
        );
      },
    }, {
      title: '操作',
      width: '100px',
      key: 'xq',
      render: (text, record) => {
        return (
          <span>
            <a onClick={() => {
              this.getInfo(record);
            }}>详情</a>
          </span>
        );
      },
    }];
    return columns;
  };

  onRowClick = (selectRow) => {
    if (selectRow && selectRow.id) {
      this.setState({
        khzt: selectRow.khzt,
        id: selectRow.id,
      });
    }
  };

  getTableHeight = () => {
    const clientHeight = document.body.clientHeight;
    return clientHeight - 315;
  };

  upClick = () => {
    this.setState({
      isShow: false,
    });
  };

  downClick = () => {
    this.setState({
      isShow: true,
    });
  };

  render() {
    const { userList, pageSize, total, current } = this.props.customer;
    const { loading } = this.props;
    const { khzt, khztOptions, isShow } = this.state;
    const btnLimit = ['1', '4'];
    const _btnLimit = ['3', '5'];
    const btn_limit = ['2', '3'];

    let _khztOptions = [];
    khztOptions && khztOptions.map(item => {
      let _item = {};
      _.set(_item, 'value', item.useName);
      _.set(_item, 'label', item.name);
      _khztOptions.push(_item);
    });

    const tools = [{
      label: '新增',
      type: 'primary',
      icon: 'plus',
      handler: () => {
        this.AddCustomer();
      },
    }, {
      component: <Button
        style={{ marginRight: 0 }}
        type="primary"
        size="small"
        icon="edit"
        onClick={() => this.EditCustomer()}
      >修改</Button>,
    }, {
      component: <Divider type='vertical'/>,
    }, {
      component: <Button
        type="primary"
        size="small"
        style={{ marginRight: 0 }}
        disabled={khzt !== '2'}
        icon="stop"
        onClick={() => this.changeCustomerZt('3')}
      >加入黑名单</Button>,
    }, {
      component: <Divider type='vertical'/>,
    }, {
      component: <Button
        type="primary"
        size="small"
        disabled={_.indexOf(btnLimit, khzt) < 0}
        icon="check"
        onClick={() => this.changeCustomerZt('2')}
      >准入</Button>,
    }, {
      component: <Button
        type="primary"
        size="small"
        style={{ marginRight: 0 }}
        disabled={_.indexOf(btn_limit, khzt) < 0}
        icon="close-circle"
        onClick={() => this.changeCustomerZt('4')}
      >退出</Button>,
    }, {
      component: <Divider type='vertical'/>,
    }, {
      component: <Popconfirm title="确定要删除该客户吗？"
                             disabled={_.indexOf(btnLimit, khzt) < 0}
                             onConfirm={() => this.changeCustomerZt('5')} okText="是"
                             cancelText="否">
        <Button
          type="danger"
          icon="delete"
          disabled={_.indexOf(btnLimit, khzt) < 0}
          size="small"
          style={{ marginRight: 0 }}
        >删除</Button>
      </Popconfirm>,
    }, {
      component: <Divider type='vertical'/>,
    }, {
      component: <Button
        type="primary"
        size="small"
        disabled={_.indexOf(_btnLimit, khzt) < 0}
        icon="arrow-left"
        onClick={() => {
          khzt === '3' ? this.changeCustomerZt('2') : this.changeCustomerZt('1');
        }}
      >恢复</Button>,
    }];

    const searchFields = [
      {
        name: 'khmc', label: '客户名称', type: 'text',
      },
      {
        name: 'khzt',
        label: '客户状态',
        type: 'select',
        options: _khztOptions,
      },
    ];

    let _list = [];
    if (userList) {
      _list = userList.map((d, idx) => {
        d.rownumber = pageSize * (current - 1) + idx + 1;
        return d;
      });
    }

    const rowSelection = {
      onChange: (selectRowKey, selectRows) => {
        this.onRowClick(selectRows[0]);
      },
      type: 'radio',
      columnTitle: '选择',
    };

    const paginationProps = {
      showSizeChanger: true,
      pageSize, total, current,
      showTotal: (total, range) => `当前: ${range[0]}-${range[1]} 共 ${total} 条`,
    };

    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.content}>
          <div className={styles.apply}>
            <ToolBar
              tools={tools}
              search={<AdvancedSearch useFilter={false} onSearch={this.handleSearch} fields={searchFields}/>}
            />
            <Table
              scroll={{ y: this.getTableHeight() }}
              dataSource={_list}
              pagination={paginationProps}
              columns={this.getDataColumns()}
              loading={loading}
              rowSelection={rowSelection}
              rowKey={(record) => record.id}
              rowClassName={(record, index) => index % 2 === 0 ? styles.lel : ''}
              bordered
              onChange={this.handleStandardTableChange}/>
            {/*<div className={styles.bottomIcon}>*/}
            {/*<Button size='small' onClick={this.upClick}><Icon type="caret-up" /></Button>*/}
            {/*<Button size='small' onClick={this.downClick}><Icon type="caret-down" /></Button>*/}
            {/*</div>*/}
            {
              isShow ?
                <div>
                  <Row>
                    <Col xl={10} lg={10} md={10} sm={24}>
                      <ul className={styles.textul}>
                        <li style={{ fontSize: '15px' }}>客户状态改变说明</li>
                        <li>状态为“已登记”的用户点击“准入”按钮，状态变更为“已审核”</li>
                        <li>状态为“已登记”的用户点击“删除”按钮，状态变更为“已删除”</li>
                        <li>状态为“已审核”的用户点击“加入黑名单”按钮，状态变更为“黑名单”</li>
                        <li>状态为“已审核”的用户点击“退出”按钮，状态变更为“已退出”</li>
                        <li>状态为“黑名单”的用户点击“退出”按钮，状态变更为“已退出”</li>
                        <li>状态为“黑名单”的用户点击“恢复”按钮，状态变更为“已审核”</li>
                        <li>状态为“已退出”的用户点击“准入”按钮，状态变更为“已审核”</li>
                        <li>状态为“已退出”的用户点击“删除”按钮，状态变更为“已删除”</li>
                        <li>状态为“已删除”的用户点击“恢复”按钮，状态变更为“已登记”</li>
                      </ul>
                    </Col>
                    <Col xl={10} lg={10} md={10} sm={24}>
                      <ul className={styles.textul}>
                        <li style={{ fontSize: '15px' }}>按钮是否可点击说明</li>
                        <li>状态为“已登记”的用户可以点击“准入、删除”按钮</li>
                        <li>状态为“已审核”的用户可以点击“加入黑名单、退出”按钮</li>
                        <li>状态为“黑名单”的用户可以点击“退出、恢复”按钮</li>
                        <li>状态为“已退出”的用户可以点击“准入、删除”按钮</li>
                        <li>状态为“已删除”的用户可以点击“恢复”按钮</li>
                      </ul>
                    </Col>
                  </Row>
                </div> : null
            }
          </div>
        </div>
      </PageLayout>
    );
  }
}
