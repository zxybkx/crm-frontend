import React, {PureComponent} from 'react';
import {Table} from 'antd';

export default class Shareholder extends PureComponent {
  getDataColumns = () => {
    const columns = [{
      title: '序号',
      width: '100px',
      dataIndex: 'rownumber',
      className: 'rownumber',
      //width: '13%',
    }, {
      title: '产品类别',
      dataIndex: 'type',
      key: 'type',
      //width: '20%',
    }, {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
      //width: '20%',
    }, {
      title: '销售价格（元）',
      dataIndex: 'xsjg',
      key: 'xsjg',
      //width: '15%',
    }, {
      title: '产品毛利%',
      dataIndex: 'cpml',
      key: 'cpml',
    }];
    return columns;
  };

  render() {
    const {data} = this.props;
    let _list = [];
    if (data) {
      _list = data.map((d, idx) => {
        d.rownumber = idx + 1;
        return d;
      });
    }

    return (
      <Table
        dataSource={ _list}
        columns={this.getDataColumns()}
        pagination={false}
        rowKey={record => record.id || Math.random()}
        bordered
      />
    )
  }
}
