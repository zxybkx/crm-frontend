/**
 * Created by sam on 2019/7/1.
 */
import React, { PureComponent } from 'react';
import { Form, Table } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import PageLayout from '@/layouts/PageLayout';
import { AdvancedSearch, ToolBar } from 'casic-common';
import LineWrap from '@/components/LineWrap';
import styles from './index.less';

const breadcrumbs = [
  { icon: 'home', path: '/' },
  { label: '客户评估' },
];

@Form.create()
@connect(({khpg, loading}) => ({
  khpg,
  loading: loading.effects['khpg/getKhpgList']
}))

export default class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      formValues: {},
      optionsData: {},
    };
  }

  componentDidMount() {
    let payload;
    payload = {
      'actived.equals': 'T',
      'enabled.equals': 'T',
      advanced: true,
      sort: 'createdDate,desc',
    };
    this.loadData(payload);
  }

  handleSearch = (conditions, zt) => {
    const payload = {
      'khmc.contains': conditions.khmc,
      'shxydm.contains': conditions.bh,
      'khdm.contains': conditions.khdm,
      'actived.equals': 'T',
      'enabled.equals': 'T',
      advanced: zt,
      sort: 'createdDate,desc',
    };
    this.loadData(payload);
  };

  handleStandardTableChange = (page) => {
    const { formValues } = this.state;

    this.loadData({
      ...formValues,
      page: page.current - 1 > 0 ? page.current - 1 : 0,
      size: page.pageSize,
    });
  };

  loadData = (payload) => {
    const { dispatch } = this.props;

    //去除查询条件中为空的字段
    _.forEach(payload, (value, key) => {
      if (!value || value === '') {
        delete payload[key];
      }
    });

    this.setState({
      id: '',
    }, () => {
      dispatch({
        type: 'khpg/getKhpgList',
        payload: payload,
      }).then(() => {
        this.setState({
          formValues: payload,
        });
      });
    });
  };

  addZhpg = (record) => {
    const { dispatch } = this.props;
    const path = `khpg/zhpg`;
    dispatch(
      routerRedux.push({
        pathname: path,
        query: {
          khdm: record.khdm,
          khmc: record.khmc,
          id: record.customerId,
        },
      }),
    );
  };

  checkZhpg = (record) => {
    const { dispatch } = this.props;
    const path = `khpg/zhpg/check`;
    dispatch(
      routerRedux.push({
        pathname: path,
        query: {
          khdm: record.khdm,
          khmc: record.khmc,
          id: record.customerId,
          zhpg: record.zhpg,
        },
      }),
    );
  };

  addFxpg = (record) => {
    const { dispatch } = this.props;
    const path = `khpg/fxpg`;
    dispatch(
      routerRedux.push({
        pathname: path,
        query: {
          id: record.customerId,
          khdm: record.khdm,
          khmc: record.khmc,
        },
      }),
    );
  };

  checkFxpg = (record) => {
    const { dispatch } = this.props;
    const path = 'khpg/fxpg/check';
    dispatch(
      routerRedux.push({
        pathname: path,
        query: {
          id: record.customerId,
          khdm: record.khdm,
          khmc: record.khmc,
          lsfx: record.lsfx,
        },
      }),
    );
  };

  addZzxx = (record) => {
    const { dispatch } = this.props;
    const path = `khpg/zzpg`;
    dispatch(
      routerRedux.push({
        pathname: path,
        query: {
          id: record.customerId,
          khdm: record.khdm,
          khmc: record.khmc,
        },
      }),
    );
  };

  checkZzxx = (record) => {
    const { dispatch } = this.props;
    const path = `khpg/zzpg/check`;
    dispatch(
      routerRedux.push({
        pathname: path,
        query: {
          id: record.customerId,
          khdm: record.khdm,
          khmc: record.khmc,
          khzz: record.khzz,
        },
      }),
    );
  };

  addSddy = (record) => {
    const { dispatch } = this.props;
    const path = `khpg/sddy`;
    dispatch(
      routerRedux.push({
        pathname: path,
        query: {
          customerId: record.customerId,
        },
      }),
    );
  };

  checkSddy = (record) => {
    const { dispatch } = this.props;
    const path = `khpg/sddy/check`;
    dispatch(
      routerRedux.push({
        pathname: path,
        query: {
          id: record.sddc,
          customerId: record.customerId,
          //sddy: record.sddcDate
        },
      }),
    );
  };

  getDataColumns = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: 'rownumber',
        key: 'rownumber',
        width: '50px',
      }, {
        title: '客户名称',
        dataIndex: 'khmc',
        key: 'khmc',
        //width: '23%',
        render: (text, record) => <LineWrap title={text} lineClampNum={1}/>
      }, {
        title: '综合评估',
        dataIndex: 'zhpg',
        key: 'zhpg',
        width: '100px',
        render: (text, record) => {
          if (record.zhpg) {
            return (
              <a onClick={() => {
                this.checkZhpg(record);
              }}>查看</a>
            );
          } else {
            return (
              <a onClick={() => {
                this.addZhpg(record);
              }}>评估</a>
            );
          }
        },
      },
      {
        title: '风险评估',
        dataIndex: 'lsfx',
        key: 'lsfx',
        width: '100px',
        render: (text, record) => {
          if (record.lsfx) {
            return (
              <a onClick={() => {
                this.checkFxpg(record);
              }}>查看</a>
            );
          } else {
            return (
              <a onClick={() => {
                this.addFxpg(record);
              }}>评估</a>
            );
          }
        },
      },
      {
        title: '资质评估',
        dataIndex: 'khzz',
        key: 'khzz',
        width: '120px',
        render: (text, record) => {
          if (record.khzz) {
            return (
              <a onClick={() => {
                this.checkZzxx(record);
              }}>查看</a>
            );
          } else {
            return (
              <a onClick={() => {
                this.addZzxx(record);
              }}>评估</a>
            );
          }
        },
      },
      {
        title: '实地调研评估',
        dataIndex: 'sddcDate',
        key: 'sddcDate',
        width: '120px',
        render: (text, record) => {
          if (record.sddcDate) {
            return (
              <a onClick={() => {
                this.checkSddy(record);
              }}>查看</a>
            );
          } else {
            return (
              <a onClick={() => {
                this.addSddy(record);
              }}>评估</a>
            );
          }
        }
      }
    ];
    return columns;
  };

  getTableHeight = () => {
    const clientHeight = document.body.clientHeight;
    return clientHeight - 315;
  };

  render() {
    const { userList, pageSize, total, current } = this.props.khpg;
    const {loading} = this.props;
    const searchFields = [
      {
        name: 'khmc', label: '客户名称', type: 'text',
      }
    ];

    let _list = [];
    if (userList) {
      _list = userList.map((d, idx) => {
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

    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.content}>
          <div className={styles.apply}>
            <ToolBar search={<AdvancedSearch useFilter={false} onSearch={this.handleSearch} fields={searchFields}/>}/>
            <Table style={{ marginTop: '10px' }}
                   scroll={{ y: this.getTableHeight() }}
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
    );
  }
}

