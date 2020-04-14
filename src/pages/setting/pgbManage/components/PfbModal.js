import React, { PureComponent } from 'react';
import { message, Modal, Table } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import moment from '../PointList';
import { AdvancedSearch, Link, ToolBar } from 'casic-common';
import LineWrap from '@/components/LineWrap';
import styles from '../PointList/index.less';

@connect(({ khpg, loading }) => ({
  khpg,
  loading: loading.effects['khpg/getPgbList'],
}))

export default class PfbModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      list: [],
      total: 0,
      current: 1,
      pageSize: 10,
      selectedKeys: [],
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
      if (success && data) {
        this.setState({
          formValues: payload,
          list: data,
          total: page && page.total,
          current: payload && payload.page ? parseInt(payload.page) + 1 : 1,
          pageSize: payload && payload.size ? parseInt(payload.size) : 10,
        });
      }
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

  renderCell = () => {
    const columns = [{
      title: '序号',
      dataIndex: 'rownumber',
      key: 'rownumber',
      // width: '50px',
    }, {
      title: '表名',
      dataIndex: 'cnName',
      key: 'cnName',
      // width: '18%',
      render: (text, record) => {
        return (
          <LineWrap title={text} lineClampNum={1}/>
        );
      },
    }, {
      title: '备注',
      dataIndex: 'bz',
      // width: '250px',
    }];
    return columns;
  };

  relatedPgb = () => {
    const { selectedKeys } = this.state;
    if (selectedKeys.length > 2) {
      message.warning('最多关联两张表！');
    } else {
      this.setState({
        selectedKeys: [],
      });
    }
  };

  onSelect = (keys) => {
    if (keys.length > 2) {
      message.warning('最多关联两张表！');
    }
    this.setState({
      selectedKeys: keys,
    });
  };

  handleStandardTableChange = (page, filters, sorter) => {
    const { formValues } = this.state;
    this.loadData({
      ...formValues,
      page: page.current - 1 > 0 ? page.current - 1 : 0,
      size: page.pageSize,
    });
  };

  render() {
    const { loading, visible } = this.props;
    const { list = [], total = 0, pageSize = 10, current = 1 } = this.state;

    let _list = [];
    if (list) {
      _list = list.map((d, idx) => {
        d.rownumber = pageSize * (current - 1) + idx + 1;
        return d;
      });
    }

    const rowSelection = {
      columnWidth: 40,
      onChange: (selectedRowKeys, selectedRows) => {
        this.onSelect(selectedRowKeys);
      },
    };

    const paginationProps = {
      showSizeChanger: true,
      pageSize, total, current,
      showTotal: (total, range) => `当前: ${range[0]}-${range[1]} 共 ${total} 条`,
    };

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
      label: '确定',
      type: 'primary',
      handler: () => {
        this.relatedPgb();
      },
    }, {
      label: '取消',
      type: 'primary',
      handler: () => {
        this.props.onCancel();
      },
    }];

    return (
      <Modal
        title='选择评分表'
        visible={visible}
        maskClosable={false}
        footer={null}
        onCancel={this.props.onCancel}>
        <ToolBar tools={tools}
                 search={<AdvancedSearch useFilter={false} onSearch={this.onSearch} fields={searchFields}/>}/>
        <Table dataSource={_list}
               pagination={paginationProps}
               rowSelection={rowSelection}
               columns={this.renderCell()}
               loading={loading}
               rowClassName={(record, index) => index % 2 === 0 ? styles.lel : ''}
               rowKey={(record) => record.id}
               bordered
               onChange={this.handleStandardTableChange}/>
      </Modal>
    );
  }
}
