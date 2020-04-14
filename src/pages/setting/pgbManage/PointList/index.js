import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Table, Divider } from 'antd';
import LineWrap from '@/components/LineWrap';
import moment from 'moment';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import { AdvancedSearch, Link, ToolBar } from 'casic-common';

@Form.create()
@connect(({ khpg, loading }) => ({
  khpg,
  loading: loading.effects['khpg/getPgbList'],
}))

export default class KhpgList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // pgbTypes: [],        //评估表类型
      formValues: {},
      list: [],
      total: 0,
      current: 1,
      pageSize: 10,
      selectedRecord: {},         //设为默认的记录
    };
  }

  componentDidMount() {
    const payload = {
      'enabled.equals': 'T',
      'enName.equals': 'lsfx',
      page: 0,
      size: 10,
      'latest.equals': 'T',
      advanced: true,
      sort: 'createdDate,desc',
    };
    this.loadData(payload);

    // 设为默认的记录，改变状态
  };

  loadData = (payload) => {
    const { dispatch } = this.props;

    //去除查询条件中为空的字段
    _.forEach(payload, (value, key) => {
      if (!value || value === '') {
        delete payload[key];
      }
    });

    dispatch({
      type: 'khpg/getPgbList',
      payload: payload,
    }).then(({ success, data, page }) => {
      this.setState({
        formValues: payload,
        list: data,
        total: page && page.total,
        current: payload && payload.page ? parseInt(payload.page) + 1 : 1,
        pageSize: payload && payload.size ? parseInt(payload.size) : 10,
      });
    });
  };

  handleSearch = (conditions, zt) => {
    // 后端处理好后可删除
    // const t1 = '后付款客户评估表';
    // const t2 = '预付款客户评估表';
    // let value = '';
    // if (t1.indexOf(conditions.pgblx) !== -1 && t2.indexOf(conditions.pgblx) !== -1) {
    //   value = '';
    // } else if (t2.indexOf(conditions.pgblx) !== -1) {
    //   value = 1;
    // } else if (t1.indexOf(conditions.pgblx) !== -1) {
    //   value = 2;
    // } else {
    //   value = ' ';
    // }

    if (zt) {
      const payload = {
        'enabled.equals': 'T',
        'enName.equals': 'lsfx',
        // 'type.equals': conditions.pgblx,
        'latest.equals': 'T',
        page: 0,
        size: 10,
        advanced: true,
        sort: 'createdDate,desc',
      };
      this.loadData(payload);
    } else {
      const payload = {
        'enabled.equals': 'T',
        'enName.equals': 'lsfx',
        // 'type.in': value,
        'latest.equals': 'T',
        page: 0,
        size: 10,
        advanced: false,
        sort: 'createdDate,desc',
      };
      this.loadData(payload);
    }
  };

  getTableHeight = () => {
    const clientHeight = document.body.clientHeight;
    return clientHeight - 340;
  };

  editPgb = (record) => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/setting/pgbManage/PointList/pfbmb',
        query: {
          id: record.id,
        },
      }),
    );
  };

  setInitial = (record) => {
    this.setState({
      selectedRecord: record
    })
  };

  CancelInitial = (record) => {
    this.setState({
      selectedRecord: {}
    })
  };

  renderCell = () => {
    const {selectedRecord = {}} = this.state;
    const columns = [{
      title: '序号',
      dataIndex: 'rownumber',
      key: 'rownumber',
      width: '50px',
    }, {
      title: '评估表名称',
      dataIndex: 'cnName',
      key: 'cnName',
      // width: '18%',
      render: (text, record) => {
        return (
          <LineWrap title={text} lineClampNum={1}/>
        );
      },
    }, {
      title: '最后更新时间',
      dataIndex: 'time',
      width: '170px',
      render: (text, record) => {
        if (record.lastModifiedDate) {
          const date = moment(record.lastModifiedDate).format('YYYY-MM-DD');
          return (<span>{date}</span>);
        }
      },
    }, {
      title: '创建人',
      dataIndex: 'createdName',
      width: '150px',
    }, {
      title: '备注',
      dataIndex: 'bz',
      width: '250px',
    }, {
      title: '操作',
      dataIndex: 'ck',
      key: 'ck',
      width: '150px',
      render: (text, record) => {
        if(_.isEmpty(selectedRecord)) {
          return (
            <span>
            <Link onClick={() => {
              this.setInitial(record);
            }}>设为默认</Link>
            <Divider type='vertical'/>
            <Link onClick={() => {
              this.editPgb(record);
            }}>详情</Link>
          </span>
          )
        }else {
          if(record.id === selectedRecord.id) {
            return (
              <span>
            <Link onClick={() => {
              this.CancelInitial(record);
            }}>取消默认</Link>
            <Divider type='vertical'/>
            <Link onClick={() => {
              this.editPgb(record);
            }}>详情</Link>
          </span>
            )
          }else {
            return (
              <span>
            <Link disabled
                  onClick={() => {this.setInitial(record)}}
                  style={{color: '#c2c2c2'}}>设为默认</Link>
            <Divider type='vertical'/>
            <Link onClick={() => {
              this.editPgb(record);
            }}>详情</Link>
          </span>
            )
          }
        }
      },
    }];
    return columns;
  };

  handleStandardTableChange = (page, filters, sorter) => {
    const { formValues } = this.state;

    this.loadData({
      ...formValues,
      page: page.current - 1 > 0 ? page.current - 1 : 0,
      size: page.pageSize,
    });
  };

  addPgb = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/setting/pgbmanage/PointList/pfb',
      }),
    );
  };

  render() {
    const { loading } = this.props;
    const { pgbTypes, list = [], total = 0, pageSize = 10, current = 1} = this.state;

    let _list = [];
    if (list) {
      _list = list.map((d, idx) => {
        d.rownumber = pageSize * (current - 1) + idx + 1;
        return d;
      });
    }

    const paginationProps = {
      showSizeChanger: true,
      pageSize, total, current,
      showTotal: (total, range) => `当前: ${range[0]}-${range[1]} 共 ${total} 条`,
    };

    // let _options = [];
    // pgbTypes && pgbTypes.forEach(item => {
    //   let _item = {};
    //   _.set(_item, 'value', item.useName);
    //   _.set(_item, 'label', item.name);
    //   _options.push(_item);
    // });

    // 搜索组件
    const searchFields = [
      {
        name: 'pgblx',
        label: '评估表名称',
        type: 'text',
        // options: _options,
      },
    ];

    const tools = [{
      label: '新增',
      type: 'primary',
      icon: 'plus',
      handler: () => {
        this.addPgb();
      },
    }];

    return (
      <div>
        <ToolBar tools={tools}
                 search={<AdvancedSearch useFilter={false} onSearch={this.handleSearch} fields={searchFields}/>}/>
        <Table scroll={{ y: this.getTableHeight() }}
               dataSource={_list}
               pagination={paginationProps}
               columns={this.renderCell()}
               loading={loading}
               rowClassName={(record, index) => index % 2 === 0 ? styles.lel : ''}
               rowKey={(record) => record.id}
               bordered
               onChange={this.handleStandardTableChange}/>
      </div>
    );
  }
}
