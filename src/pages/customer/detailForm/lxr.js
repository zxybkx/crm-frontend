import React, {Component} from 'react';
import {Form, Table} from 'antd';

@Form.create()

class Lxr extends Component {

  edit = (record) => {
    this.setState({
      editVisible: true,
      record: record
    });
  };

  getDataColumns = () => {
    const columns = [{
      title: '序号',
      dataIndex: 'rownumber',
    }, {
      title: '姓名',
      dataIndex: 'xm',
      key: 'xm',
    }, {
      title: '职务',
      dataIndex: 'zw',
      key: 'zw',
    }, {
      title: '联系电话',
      dataIndex: 'lxdh',
      key: 'lxdh',
    }];
    return columns;
  };

  render() {
    const {lxrData} = this.props;

    let _list = [];
    if (lxrData) {
      _list = lxrData.map((d, idx) => {
        d.rownumber = idx + 1;
        return d;
      });
    }

    return (
      <Table
        dataSource={_list}
        pagination={false}
        columns={this.getDataColumns()}
        bordered/>
    )
  }
}

export default Lxr;
