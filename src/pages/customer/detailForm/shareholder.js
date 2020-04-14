import React, {PureComponent} from 'react';
import {Table} from 'antd';

export default class Shareholder extends PureComponent {
  getDataColumns = () => {
    const columns = [{
      title: '序号',
      width: '100px',
      dataIndex: 'rownumber',
      className: 'rownumber',
    }, {
      title: '股东信息',
      dataIndex: 'gdmc',
      key: 'gdmc',
    }, {
      title: '认缴出资额',
      dataIndex: 'rjcze',
      key: 'rjcze',
      width: '20%',
    }, {
      title: '币种',
      dataIndex: 'dw',
      key: 'dw',
      width: '20%',
    }, {
      title: '出资比例%',
      dataIndex: 'czbl',
      key: 'czbl',
      width: '15%',
    }];
    return columns;
  };

  render() {
    const {gdData} = this.props;
    let _list = [];
    if (gdData) {
      _list = gdData.map((d, idx) => {
        d.rownumber = idx + 1;
        return d;
      });
    }
    return (
      <div>
        <div>
          <Table
            dataSource={_list}
            columns={this.getDataColumns()}
            pagination={false}
            bordered
          />
        </div>
      </div>
    )
  }
}
