import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Table, Modal, Switch, Divider } from 'antd';
import LineWrap from '@/components/LineWrap';
import moment from 'moment';
import _ from 'lodash';
import router from 'umi/router';
import styles from './index.less';
import { AdvancedSearch, Link, ToolBar } from 'casic-common';
import PfbModal from '../components/PfbModal';

@Form.create()
@connect(({ khpg, loading }) => ({
  khpg,
  loading: loading.effects['khpg/getPgbList'],
}))

export default class KhpgList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pgbTypes: [],        //评估表类型
      formValues: {},
      list: [],
      total: 0,
      current: 1,
      pageSize: 10,
      visible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'khpg/getPgbType',
      payload: {
        name: 'fxpg-pgblx',
      },
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          pgbTypes: data,
        });
      }
    });

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
    if (zt) {
      const payload = {
        'enabled.equals': 'T',
        'enName.equals': 'lsfx',
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

  deployPfb = (record) => {
    this.setState({
      visible: true,
    });
  };

  onZtChange = (checked) => {
    console.log(checked)
  };

  editPfb = (record) => {
    router.push({
      pathname: '/setting/pgbManage/SetList/pfType',
      query: {id: record.id}
    })
  };

  renderCell = () => {
    const columns = [{
      title: '序号',
      dataIndex: 'rownumber',
      key: 'rownumber',
      width: '50px',
    }, {
      title: '业务类型',
      dataIndex: 'cnName',
      key: 'cnName',
      width: '90px',
      render: (text, record) => {
        return (
          <LineWrap title={text} lineClampNum={1}/>
        );
      },
    }, {
      title: '业务范围',
      dataIndex: 'time',
      width: '90px',
      render: (text, record) => {
        if (record.lastModifiedDate) {
          const date = moment(record.lastModifiedDate).format('YYYY-MM-DD');
          return (<span>{date}</span>);
        }
      },
    }, {
      title: '付款类型',
      dataIndex: 'createdName',
      width: '100px',
    }, {
      title: '客户类型',
      dataIndex: 'bz',
      width: '100px',
    }, {
      title: '创建时间',
      dataIndex: 'time',
      width: '120px',
    }, {
      title: '评分表',
      dataIndex: 'pfb',
      width: '180px',
    }, {
      title: '状态',
      dataIndex: 'zt',
      width: '100px',
      render: (text, record) => {
        return (
          <Switch
            checkedChildren='启用'
            unCheckedChildren='停用'
            defaultChecked
            onChange={this.onZtChange}/>
        )
      }
    },{
      title: '备注',
      dataIndex: 'bz',
      // width: '250px',
    }, {
      title: '操作',
      dataIndex: 'ck',
      key: 'ck',
      width: '140px',
      render: (text, record) => {
        return (
          <span>
            <Link onClick={() => {
              this.deployPfb(record);
            }}>配置评分表</Link>
            <Divider type='vertical'/>
            <Link onClick={() => {
              this.editPfb(record);
            }}>修改</Link>
          </span>
        )
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
    router.push('/setting/pgbManage/SetList/pfType');
  };

  handleOk = () => {
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { loading } = this.props;
    const { pgbTypes, list = [], total = 0, pageSize = 10, current = 1, visible } = this.state;

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

    let _options = [];
    pgbTypes && pgbTypes.forEach(item => {
      let _item = {};
      _.set(_item, 'value', item.useName);
      _.set(_item, 'label', item.name);
      _options.push(_item);
    });

    // 搜索组件
    const searchFields = [
      {
        name: 'pgblx',
        label: '评估表类型',
        type: 'select',
        options: _options,
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
        <PfbModal visible={visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}/>
      </div>
    );
  }
}
