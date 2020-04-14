import React, { PureComponent } from 'react';
import { Table, Button, Divider, Popconfirm, Modal, Switch, Pagination } from 'antd';
import { AdvancedSearch, ToolBar } from 'casic-common';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import LineWrap from '@/components/LineWrap';
import _ from 'lodash';
import PageLayout from '@/layouts/PageLayout';
import { Link } from 'casic-common';
import ProductView from './ProductView';
import styles from './index.less';

const breadcrumbs = [
  { icon: 'home', path: '/' },
  { label: '产品管理', path: '/product' },
];
@connect((state) => ({
  product: state.product,
  loading: state.loading.effects['product/getDataList'],
}))
export default class NewPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dataList: [],
      total: 0,
      current: 1,
      pageSize: 10,
      selectedRows: [],
      deployData: [],            //配置数据
      params: {},
      visible: false,
      currentUrl: '',
      record: {},
      isView: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const payload = {
      page: 0,
      size: 10,
      advanced: true,
      'enabled.equals': 'T',
    };
    this.loadData(payload);
    //获取配置数据
    dispatch({
      type: 'product/deployData',
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          deployData: data,
        });
      }
    });
  }

  loadData = (params = {}) => {
    const { dispatch } = this.props;
    //去除查询条件中为空的字段
    _.forEach(params, (value, key) => {
      if (value === null || value === '') {
        delete params[key];
      }
    });

    dispatch({
      type: 'product/getDataList',
      payload: params,
    }).then(({ success, data, page }) => {
      if (success && data) {
        this.setState({
          dataList: data,
          total: page ? page.total : 0,
          current: params && params.page ? parseInt(params.page) + 1 : 1,
          pageSize: params && params.size ? parseInt(params.size) : 10,
          params,
        });
      }
    });
  };

  edit = (record) => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/product/add`,
        query: {
          id: record.id,
        },
      }),
    );
  };

  check = (record) => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/product/check',
        query: {
          id: record.id,
        },
      }),
    );
  };

  showImg = (url, record) => {
    this.setState({
      visible: true,
      currentUrl: url,
      record,
    });
  };

  renderColumns = () => {
    const { deployData } = this.state;
    const columns = [{
      title: '序号',
      dataIndex: 'rownumber',
      width: '50px',
    }, {
      title: '所属单位',
      dataIndex: 'dwmc',
      // render: (text, record) => {
      //   return (<span>{text.split('-')[0]}</span>);
      // },
    }, {
      title: '产品类型',
      dataIndex: 'type',
      render: (text, record) => {
        const type = _.filter(deployData, item => item.categoryName === 'cp-lx');
        const item = type && _.find(type, item => item.useName === text);
        return (<span>{item && item.name}</span>);
      },
    }, {
      title: '产品名称',
      dataIndex: 'cpmc',
    }, {
      title: '产品概述',
      dataIndex: 'cpgs',
      width: '200px',
      render: (text, record) => {
        return (<LineWrap title={text} lineClampNum={1}/>);
      },
    }, {
      title: '图片',
      dataIndex: 'photo',
      render: (text, record) => {
        if (!_.isEmpty(record.fileList)) {
          const url = `/gateway/fileservice/api/file/view/${record.fileList[0].fileId}`;
          return (<img src={url} width={'60'} height={'60'} onClick={() => this.showImg(url, record)}/>);
        }
      },
    }, {
      title: '库存数量',
      dataIndex: 'kcsl',
    }, {
      title: '计量单位',
      dataIndex: 'jldw',
      render: (text, reocrd) => {
        const Unit = _.filter(deployData, item => item.categoryName === 'cp-jldw');
        const item = Unit && _.find(Unit, item => item.useName === text);
        return (<span>{item && item.name}</span>);
      },
    }, {
      title: '供应周期(天)',
      dataIndex: 'gyzq',
    }, {
      title: '单价(元)',
      dataIndex: 'dj',
    }, {
      title: '折扣(折)',
      dataIndex: 'zk',
    }, {
      title: '状态',
      dataIndex: 'zt',
      render: (text, reocrd) => {
        const cpzt = _.filter(deployData, item => item.categoryName === 'cp-zt');
        const item = cpzt && _.find(cpzt, item => item.useName === text);
        return (<span>{item && item.name}</span>);
      },
    }, {
      title: '操作',
      dataIndex: 'operat',
      width: 130,
      render: (text, record) => {
        return (
          <span>
              <Link onClick={() => {
                this.edit(record);
              }} icon='edit'>
                编辑
              </Link>
              <Divider type='vertical'/>
              <Link onClick={() => {
                this.check(record);
              }} icon='file'>
                详情
              </Link>
          </span>
        );
      },
    }];
    return columns;
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/product/add`,
      }),
    );
  };

  onClick = (keys) => {
    this.setState({
      selectedRows: keys,
    });
  };

  delete = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'product/deleteData',
      payload: selectedRows,
    }).then(({ success, data }) => {
      if (success) {
        const payload = {
          page: 0,
          size: 10,
          advanced: true,
          'enabled.equals': 'T',
        };
        this.loadData(payload);
      }
    });
  };

  onSearch = (conditions, zt) => {
    let params;
    if (zt) {
      params = {
        'dwmc.equals': conditions.dwmc && conditions.dwmc[0].label,
        'cpmc.contains': conditions.name,
        'type.equals': conditions.type,
        'zt.equals': conditions.state,
        'enabled.equals': 'T',
        'dj.greaterOrEqualThan': conditions.down,
        'dj.lessOrEqualThan': conditions.top,
        advanced: zt,
        page: 0,
        size: 10,
      };
    } else {
      params = {
        'enabled.equals': 'T',
        'cpmc.contains': conditions.name,
        'createdName.contains': conditions.name,
        'pinyin.contains': conditions.name,
        'initial.contains': conditions.name,
        advanced: zt,
        page: 0,
        size: 10,
      };
    }
    this.loadData(params);
  };

  handleTableChange = (page, pageSize) => {
    const { params } = this.state;
    this.loadData({
      ...params,
      page: page - 1 > 0 ? page - 1 : 0,
      size: pageSize,
    });
  };

  onShowSizeChange = (current, size) => {
    const { params } = this.state;
    this.loadData({
      ...params,
      page: current - 1 > 0 ? current - 1 : 0,
      size: size,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  changePhoto = (url) => {
    this.setState({
      currentUrl: url,
    });
  };

  isView = (checked) => {
    this.setState({
      isView: !checked,
    });
  };

  changeData = (data) => {
    this.setState({
      dataList: data
    })
  };

  render() {
    const { dataList, pageSize, total, current, deployData, selectedRows, visible, currentUrl, record, isView } = this.state;
    const { loading } = this.props;
    const type = _.filter(deployData, item => item.categoryName === 'cp-lx');
    const cpzt = _.filter(deployData, item => item.categoryName === 'cp-zt');

    let _type = [];
    type && type.map(item => {
      let _item = {};
      _.set(_item, 'value', item.useName);
      _.set(_item, 'label', item.name);
      _type.push(_item);
    });

    let _cpzt = [];
    cpzt && cpzt.map(item => {
      let _item = {};
      _.set(_item, 'value', item.useName);
      _.set(_item, 'label', item.name);
      _cpzt.push(_item);
    });

    const tools = [{
      component: <Button
        style={{ marginRight: 0 }}
        type="primary"
        size="small"
        icon="plus"
        onClick={() => this.add()}
      >新增</Button>,
    }, {
      component: <Divider type='vertical'/>,
    }, {
      component: <Popconfirm title="确定要删除吗？"
                             disabled={_.isEmpty(selectedRows)}
                             onConfirm={this.delete} okText="是"
                             cancelText="否">
        <Button type="danger"
                icon="delete"
                disabled={_.isEmpty(selectedRows)}
                size="small">
          删除
        </Button>
      </Popconfirm>,
    },{
      component: <Switch
      // className={styles.switch}
      checkedChildren='列表'
      unCheckedChildren='视图'
      defaultChecked
        onChange={this.isView}/>
    }];

    const paginationProps = {
      showSizeChanger: true,
      pageSize, total, current,
      showTotal: (total, range) => `当前: ${range[0]}-${range[1]} 共 ${total} 条`,
    };

    const searchFields = [
      {
        name: 'dwmc', label: '所属单位', type: 'organization', labelInValue: true,
      },
      {
        name: 'name', label: '产品名称', type: 'text',
      }, {
        name: 'type',
        label: '产品类型',
        type: 'select',
        options: _type,
      }, {
        name: 'state',
        label: '产品状态',
        type: 'select',
        options: _cpzt,
      }, {
        name: 'top',
        label: '价格上限',
        type: 'text',
      }, {
        name: 'down',
        label: '价格下限',
        type: 'text',
      },
    ];

    const rowSelection = {
      columnWidth: 40,
      onChange: (selectedRowKeys, selectedRows) => {
        this.onClick(selectedRowKeys);
      },
    };

    let _list = [];
    if (dataList) {
      _list = dataList.map((d, idx) => {
        d.key = idx;
        d.rownumber = pageSize * (current - 1) + idx + 1;
        return d;
      });
    }

    let photos = [];
    record.fileList && record.fileList.map((item) => {
      let _item = {};
      _.set(_item, 'id', item.fileId);
      _.set(_item, 'name', item.fileName);
      _.set(_item, 'url', `/gateway/fileservice/api/file/view/${item.fileId}`);
      photos.push(_item);
    });

    return (
      <PageLayout breadcrumb={breadcrumbs} className={styles.default}>
        <div className={styles.content}>
          <div className={styles.prodMain}>
            {
              isView ?
                <ProductView
                  data={dataList}
                  onChange={this.isView}
                  changeData={this.changeData}
                  onSearch={this.onSearch}
                  cpzt={cpzt}
                  type={type}/> :
                <div>
                  <ToolBar tools={tools}
                           search={<AdvancedSearch useFilter={false} onSearch={this.onSearch} fields={searchFields}/>}/>
                  <Table
                    bordered
                    dataSource={_list}
                    pagination={false}
                    rowSelection={rowSelection}
                    loading={loading}
                    columns={this.renderColumns()}
                    rowClassName={(record, index) => index % 2 === 0 ? styles.lel : ''}
                    rowKey={(record) => record.id}
                    onChange={this.handleTableChange}/>
                </div>
            }
            <Pagination
              style={{marginTop: 10, float: 'right'}}
              showSizeChanger
              onShowSizeChange={this.onShowSizeChange}
              onChange={this.handleTableChange}
              pageSize={pageSize}
              total={total}
              current={current}
              showTotal={(total, range) => `当前: ${range[0]}-${range[1]} 共 ${total} 条`}/>
          </div>
        </div>
        <Modal title={'产品图片'}
               visible={visible}
               footer={null}
               onOk={this.handleOk}
               onCancel={this.handleOk}>
          <img src={currentUrl} width={'100%'} height={'100%'}/>
          <div style={{ marginTop: '10px' }}>
            {
              photos.map((item, i) => {
                return (
                  <img src={item.url} key={i} height={'30px'} width={'30px'}
                       style={{ marginRight: 10, cursor: 'pointer' }}
                       onClick={() => this.changePhoto(item.url)}/>
                );
              })
            }
          </div>
        </Modal>
      </PageLayout>
    );
  }
}
