import React, { PureComponent } from 'react';
import { Table, Button, message, Modal } from 'antd';
import _ from 'lodash';
import { connect } from 'dva';
import LineWrap from '@/components/LineWrap';
import { AdvancedSearch, ToolBar } from 'casic-common';
import styles from '../index.less';

@connect(({ product }) => ({
  product,
}))

export default class ProductModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      total: 0,
      current: 1,
      pageSize: 10,
      params: {},
      productType: [],           //产品类型
      selectedRow: [],
      localvisible: false,
      currentImg: {},
      record: {}
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
    dispatch({
      type: 'business/categories',
      payload: {
        name: 'cp-lx',
      },
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          productType: data,
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

  showImg = (item, record) => {
    this.setState({
      localvisible: true,
      currentImg: item,
      record
    });
  };

  photoOk = () => {
    this.setState({
      localvisible: false,
    });
  };

  renderColumns = () => {
    const columns = [{
      title: '序号',
      dataIndex: 'rownumber',
      width: '50px',
    }, {
      title: '单位名称',
      dataIndex: 'dwmc',
      width: '200px',
      render: (text, record) => {
        return (<LineWrap title={text.split('-')[0]} lineClampNum={1}/>)
      }
    }, {
      title: '产品类型',
      dataIndex: 'type',
      width: '80px',
    }, {
      title: '产品名称',
      dataIndex: 'cpmc',
      width: '80px',
    }, {
      title: '产品概述',
      dataIndex: 'cpgs',
      width: '200px',
      render: (text, record) => {
        return (<LineWrap title={text} lineClampNum={1}/>)
      }
    }, {
      title: '计量单位',
      dataIndex: 'jldw',
      width: '80px',
    }, {
      title: '图片',
      dataIndex: 'photo',
      render: (text, record) => {
        if(!_.isEmpty(record.fileList)) {
          const url = `/gateway/fileservice/api/file/view/${record.fileList[0].fileId}`;
          return (<img src={url} height={'60'} width={'60'} style={{ cursor: 'pointer' }} onClick={() => this.showImg(url, record)}/>)
        }
      },
    }];
    return columns;
  };

  onSearch = (conditions, zt) => {
    let params;
    if(zt) {
      params = {
        'dwmc.contains': conditions.name,
        'type.equals': conditions.type,
        'enabled.equals': 'T',
        advanced: zt,
        page: 0,
        size: 10,
      }
    }else {
      params = {
        'cpmc.contains': conditions.name,
        'cpgs.contains': conditions.name,
        'enabled.equals': 'T',
        advanced: zt,
        page: 0,
        size: 10,
      }
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

  handleOk = () => {
    const { selectedRow } = this.state;
    if (_.isEmpty(selectedRow)) {
      message.warning('请选择一个产品');
    } else {
      this.props.onOk(selectedRow[0]);
    }
  };

  onRowClick = (record) => {
    this.setState({
      selectedRow: record,
    });
    record.zt === '下架' && message.warning('该产品已下架')
  };

  changePhoto = (url) => {
    this.setState({
      currentImg: url
    });
  };

  render() {
    const { visible } = this.props;
    const { dataList, pageSize, total, current, productType, localvisible, currentImg, record } = this.state;

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

    let _type = [];
    productType && productType.map(item => {
      let _item = {};
      _.set(_item, 'value', item.name);
      _.set(_item, 'label', item.name);
      _type.push(_item);
    });

    const rowSelection = {
      columnWidth: 50,
      onChange: (selectedRowKeys, selectedRows) => {
        this.onRowClick(selectedRows);
      },
      type: 'radio',
      columnTitle: '选择',
      getCheckboxProps: record => ({
        disabled: record.zt === '下架'
      }),
    };

    const searchFields = [
      {
        name: 'name', label: '单位名称', type: 'text',
      }, {
        name: 'type',
        label: '产品类型',
        type: 'select',
        options: _type,
      },
    ];

    const tools = [{
      label: '确定',
      type: 'primary',
      handler: () => {
        this.handleOk();
      },
    },{
      label: '取消',
      type: 'default',
      handler: () => {
        this.props.onCancel();
      },
    }];

    let photos = [];
    record.fileList && record.fileList.map((item) => {
      let _item = {};
      _.set(_item, 'id', item.fileId);
      _.set(_item, 'name', item.fileName);
      _.set(_item, 'url', `/gateway/fileservice/api/file/view/${item.fileId}`);
      photos.push(_item);
    });

    return (
      <Modal title={'选择产品'}
             visible={visible}
             width={'50%'}
             maskClosable={false}
             onCancel={this.props.onCancel}
             footer={null}>
        <ToolBar tools={tools} search={<AdvancedSearch useFilter={false} onSearch={this.onSearch} fields={searchFields}/>}/>
        <Table
          bordered
          dataSource={_list}
          pagination={paginationProps}
          rowSelection={rowSelection}
          onRow={record => {return {onClick: () => {this.onRowClick(record)}}}}
          columns={this.renderColumns()}
          rowKey={(record) => record.id}
          rowClassName={(record, index) => index % 2 === 0 ? styles.lel : ''}
          onChange={this.handleTableChange}/>
        <Modal title={'产品图片'}
               visible={localvisible}
               footer={null}
               onOk={this.photoOk}
               onCancel={this.photoOk}>
          <img src={currentImg} width={'100%'} height={'100%'}/>
          <div style={{marginTop: '10px'}}>
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
      </Modal>
    );
  }
}
