import React, {PureComponent} from 'react';
import {Button, Popconfirm, Form, Divider, Table, message} from 'antd';
import _ from 'lodash';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import AddGys from './GysModal';
import EditGys from './EditGysModal';
import {Link} from 'casic-common';
import styles from './Jbxx.less';

@Form.create()
@connect(({khgj}) => ( {
  khgj
}))
export default class Shareholder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addvisible: false,
      editvisible: false,
      record: {},
      gysData: []
    }
  }

  componentDidMount() {
    this.loadData()
  }

  loadData = () => {
    //查看
    const {dispatch, sddcId} = this.props;
    dispatch({
      type: `khgj/getGysList`,
      payload: {
        'sddcId.equals': sddcId,
        page: 0,
        size: 10000
      }
    }).then(({success, data}) => {
      if (success && data) {
        this.setState({
          gysData: data
        })
      }
    })
  };

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
    }, {
      title: '操作',
      dataIndex: 'xq',
      width: '100px',
      key: 'xq',
      render: (text, record) => {
        return (
          <span>
            <Link onClick={() => {
              this.edit(record)
            }} icon='form'>编辑</Link>
            <Divider type='vertical'/>
          <Popconfirm title="确认要删除该供应商吗？" onConfirm={() => this.delete(record)} okText="是" cancelText="否">
            <Link icon='delete' type='danger'>删除</Link>
          </Popconfirm>
          </span>
        )
      }
    }];
    return columns;
  };

  add = () => {
    this.setState({
      addvisible: true,
    })
  };

  edit = (record) => {
    this.setState({
      editvisible: true,
      record: record
    });
  };

  delete = (record) => {
    const {gysData} = this.state;
    const _gysData = _.cloneDeepWith(gysData);
    _.remove(_gysData, item => item.id === record.id);
    this.setState({
      gysData: _gysData
    });
  };

  //新增供应商确定按钮回调
  handleAddOk = (formData) => {
    const {gysData} = this.state;
    const _gysData = _.cloneDeep(gysData);
    _gysData.push(formData);
    this.setState({
      addvisible: false,
      gysData: _gysData
    });
  };

  //编辑供应商信息确定按钮回调
  handleEditOk = (formData) => {
    const {record, gysData} = this.state;
    _.remove(gysData, item => item.id === record.id);
    const _gysData = _.cloneDeep(gysData);
    _gysData.push(formData);

    this.setState({
      editvisible: false,
      gysData: _gysData
    });
  };

  handleAddCancel = () => {
    this.setState({
      addvisible: false,
    })
  };

  handleEditCancel = () => {
    this.setState({
      editvisible: false,
    })
  };

  onSave = () => {
    const {dispatch, sddcId, id} = this.props;
    const {gysData} = this.state;
    if (id || (!_.isEmpty(gysData) && gysData[0].id.split('-').length <2)) {
      gysData && gysData.map(item => {
        item.rownumber && delete item.rownumber;
        if (item.id && item.id.split('-').length > 2) {
          _.set(item, 'id', null)
        }
      });
      //修改
      dispatch({
        type: `khgj/editGys`,
        payload: {
          gysData,
          sddcId: sddcId
        }
      }).then(({success, data}) => {
        if (success && data) {
          message.success('保存成功');
          this.loadData();
        }
      })
    } else {
      //新增
      gysData && gysData.map(item => {
        if (item.id && item.id.split('-').length > 2) {
          item.rownumber && delete item.rownumber;
          _.set(item, 'id', null)
        }
      });
      dispatch({
        type: `khgj/addGys`,
        payload: {
          gysData,
          sddcId: sddcId
        }
      }).then(({success, data}) => {
        if (success && data) {
          message.success('保存成功');
          this.loadData();
        }
      })
    }
  };

  jumpDetail = () => {
    const {dispatch, sddcId, customerId} = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/customer/customerDetail`,
        query: {id: customerId}
      })
    )
  };

  render() {
    const {addvisible, editvisible, record, gysData} = this.state;
    const {sddcId} = this.props;
    let _list = [];
    if (gysData) {
      _list = gysData.map((d, idx) => {
        d.rownumber = idx + 1;
        return d;
      });
    }

    return (
      <div>
        <div>
          <Table
            dataSource={ _list}
            columns={this.getDataColumns()}
            pagination={false}
            rowKey={record => record.id || Math.random()}
            bordered
          />
          <Button
            size="small"
            type='primary'
            style={{marginTop: '10px'}}
            icon={'plus'}
            ghost
            onClick={() => this.add()}>新增供应商</Button>
        </div>
        <div className={styles.btnGroup}>
          <Button type="primary" size="small" onClick={() => {
            this.props.changeStep(2)
          }}>上一页</Button>
          <Button
            className={styles.btn}
            type="primary"
            size="small"
            icon="save"
            onClick={() => {
              this.onSave();
              this.jumpDetail()
            }}>保存</Button>
        </div>
        <AddGys visible={addvisible}
                    sddcId={sddcId}
                    title='新增供应商'
                    add={this.handleAddOk}
                    onCancel={this.handleAddCancel}/>
        <EditGys visible={editvisible}
                   record={record}
                   sddcId={sddcId}
                   title='编辑供应商信息'
                   edit={this.handleEditOk}
                   onCancel={this.handleEditCancel}/>
      </div>
    )
  }
}
