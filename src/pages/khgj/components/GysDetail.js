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
      title: '供应商名称',
      dataIndex: 'name',
      key: 'name',
      //width: '20%',
    }, {
      title: '供应产品',
      dataIndex: 'gycp',
      key: 'gycp',
      //width: '20%',
    }, {
      title: '产品单价（元）',
      dataIndex: 'cpdj',
      key: 'cpdj',
      //width: '15%',
    }, {
      title: '供应商经营资质及隐性风险核查',
      dataIndex: 'zzfx',
      key: 'zzfx',
    }, {
      title: '符合程度',
      dataIndex: 'fhcd',
      key: 'fhcd',
    }, {
      title: '参保人数',
      dataIndex: 'cbrs',
      key: 'cbrs',
    }, {
      title: '行政处罚和法律诉讼',
      dataIndex: 'cfss',
      key: 'cfss',
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
      <div>
        <Table
          dataSource={ _list}
          columns={this.getDataColumns()}
          pagination={false}
          rowKey={record => record.id || Math.random()}
          bordered
        />
      </div>
    )
  }
}
