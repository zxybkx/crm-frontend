import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import LineWrap from '@/components/LineWrap';
import PageLayout from '@/layouts/PageLayout';
import { AdvancedSearch, session, ToolBar } from 'casic-common';
import styles from './index.less';

const breadcrumbs = [
  { icon: 'home', path: '/' },
  { label: '商机管理', path: './business' },
];
@connect((state) => ({
  business: state.business,
  loading: state.loading.effects['business/getDataList'],
}))

export default class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      total: 0,
      current: 1,
      pageSize: 10,
      params: {},
      sjzt: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const params = {
      page: 0,
      size: 10,
      advanced: true,
      'enabled.equals': 'T',
    };
    this.loadData(params);
    // 商机状态
    dispatch({
      type: 'business/categories',
      payload: {
        name: 'sj-zt',
      },
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          sjzt: data,
        });
      }
    });
  }

  handleSearch = (conditions, zt) => {
    let params;
    if (zt) {
      params = {
        'sjzt.equals': conditions.state,
        'createdName.equals': conditions.cjr && conditions.cjr[0].name,
        'sjcjrdw.equals': conditions.cjrdw && conditions.cjrdw[0].label,
        'sjsyr.equals': conditions.syr && conditions.syr[0].name,
        'sjsyrdw.equals': conditions.syrdw && conditions.syrdw[0].label,
        'jsrq.greaterOrEqualThan': conditions.dateStart && moment.utc(conditions.dateStart.startOf('day')).format(),
        'jsrq.lessOrEqualThan': conditions.dateEnd && moment.utc(conditions.dateEnd.endOf('day')).format(),
        'yjje.greaterOrEqualThan': conditions.minMoney,
        'yjje.lessOrEqualThan': conditions.maxMoney,
        'enabled.equals': 'T',
        page: 0,
        size: 10,
        advanced: zt,
      };
    } else {
      params = {
        'sjmc.contains': conditions.cjr,
        'enabled.equals': 'T',
        'pinyin.contains': conditions.cjr,
        'initial.contains': conditions.cjr,
        'customerName.contains': conditions.cjr,
        page: 0,
        size: 10,
        advanced: zt,
      };
    }
    this.loadData(params);
  };

  handleTableChange = ({ current, pageSize }) => {
    const { params } = this.state;
    this.loadData({
      ...params,
      page: current - 1,
      size: pageSize,
    });
  };

  loadData = (params) => {
    const { dispatch } = this.props;
    //去除查询条件中为空的字段
    _.forEach(params, (value, key) => {
      if (value === null || value === '') {
        delete params[key];
      }
    });

    dispatch({
      type: 'business/getDataList',
      payload: params,
    }).then(({ success, data, page }) => {
      if (success && data) {
        this.setState({
          params,
          dataList: data,
          total: page ? page.total : 0,
          current: params && params.page ? parseInt(params.page) + 1 : 1,
          pageSize: params && params.size ? parseInt(params.size) : 10,
        });
      }
    });
  };

  //点击新增回调
  AddBusiness = () => {
    const { dispatch } = this.props;
    const path = `/business/addBusiness`;
    dispatch(
      routerRedux.push({
        pathname: path,
      }),
    );
  };

  //点击详情回调
  getInfo = (record) => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/business/editBusiness`,
        query: {
          id: record.id,
        },
      }),
    );
  };

  getCustomerInfo = (text) => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/customer/customerDetail`,
        query: {
          id: text,
        },
      }),
    );
  };

  getDataColumns = () => {
    const {sjzt} = this.state;
    const columns = [{
      title: '序号',
      width: '50px',
      dataIndex: 'rownumber',
    }, {
      title: '客户名称',
      dataIndex: 'customerId',
      width: '200px',
      render: (text, record) => <a onClick={() => {
        this.getCustomerInfo(text);
      }}><LineWrap title={record.crmCustomerdto && record.crmCustomerdto.khmc} lineClampNum={1}/></a>,
    }, {
      title: '商机名称',
      dataIndex: 'sjmc',
      width: '200px',
      render: (text, record) => <a onClick={() => {
        this.getInfo(record);
      }}><LineWrap title={text} lineClampNum={1}/></a>,
    }, {
      title: '商机状态',
      dataIndex: 'sjzt',
      // width: '100px',
      render: (text, record) => {
        const zt = sjzt && _.find(sjzt, item => item.useName === text);
        return (<span>{zt && zt.name}</span>)
      }
    }, {
      title: '结束日期',
      dataIndex: 'jsrq',
      // width: '120px',
      render: (text, record) => {
        const rq = (text) ? moment(text).format('YYYY-MM-DD') : '';
        return (
          <span>{rq}</span>
        );
      },
    }, {
      title: '预计金额(元)',
      dataIndex: 'yjje',
      // width: '150px',
    }, {
      title: '商机创建人',
      dataIndex: 'createdName',
      // width: '120px',
    }, {
      title: '创建人单位',
      dataIndex: 'sjcjrdw',
      // width: '170px',
      render: (text, record) => {
        return (<LineWrap title={text} lineClampNum={1}/>);
      },
    }, {
      title: '商机所有人',
      dataIndex: 'sjsyr',
      // width: '120px',
      render: (text, record) => {
        return (<span>{text}</span>);
      },
    }, {
      title: '所有人单位',
      dataIndex: 'sjsyrdw',
      // width: '170px',
      render: (text, record) => {
        return (<LineWrap title={text && text.split('-')[0]} lineClampNum={1}/>);
      },
    }, {
      title: '操作',
      width: '60px',
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

  render() {
    const { dataList, pageSize, total, current, sjzt } = this.state;
    const { loading } = this.props;
    const tools = [{
      label: '新增',
      type: 'primary',
      icon: 'plus',
      handler: () => {
        this.AddBusiness();
      },
    }];

    let _list = [];
    if (dataList) {
      _list = dataList.map((d, idx) => {
        d.key = idx;
        d.rownumber = pageSize * (current - 1) + idx + 1;
        return d;
      });
    }

    const paginationProps = {
      showSizeChanger: true,
      pageSize, total, current,
      showTotal: (total, range) => `当前: ${range[0]}-${range[1]} 共 ${total} 条`,
    };

    let _sjzt = [];
    sjzt && sjzt.map(item => {
      let _item = {};
      _.set(_item, 'value', item.useName);
      _.set(_item, 'label', item.name);
      _sjzt.push(_item);
    });

    const searchFields = [
      {
        name: 'state', label: '商机状态', type: 'select', options: _sjzt,
      }, {
        name: 'cjr', label: '商机创建人', type: 'user',
      }, {
        name: 'cjrdw', label: '创建人单位', type: 'organization', labelInValue: true,
      }, {
        name: 'syr', label: '商机所有人', type: 'user',
      }, {
        name: 'syrdw', label: '所有人单位', type: 'organization', labelInValue: true,
      }, {
        name: 'dateStart', label: '最早结束日期', type: 'date',
      }, {
        name: 'dateEnd', label: '最晚结束日期', type: 'date',
      }, {
        name: 'minMoney', label: '最低预计金额', type: 'text',
      }, {
        name: 'maxMoney', label: '最高预计金额', type: 'text',
      },
    ];

    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.container}>
          <div className={styles.content}>
            <ToolBar tools={tools}
                     search={<AdvancedSearch useFilter={false} onSearch={this.handleSearch} fields={searchFields}/>}/>
            <Table
              dataSource={_list}
              pagination={paginationProps}
              columns={this.getDataColumns()}
              loading={loading}
              rowKey={(record) => record.id}
              rowClassName={(record, index) => index % 2 === 0 ? styles.lel : ''}
              bordered
              onChange={this.handleTableChange}
            />
          </div>
        </div>
      </PageLayout>
    );
  }
}
