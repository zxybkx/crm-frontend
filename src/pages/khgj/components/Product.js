import React, {PureComponent} from 'react';
import {Button, Popconfirm, Form, Divider, Table, message} from 'antd';
import _ from 'lodash';
import {connect} from 'dva'
import AddProduct from './ProductModal';
import EditModal from './EditModal';
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
      showGdTable: true,
      addvisible: false,
      editvisible: false,
      record: {},
      productData: [],
    }
  }

  componentDidMount() {
    this.loadData()
  }

  loadData = () => {
    //查看
    const {dispatch, sddcId} = this.props;
    dispatch({
      type: `khgj/getProductList`,
      payload: {
        'sddcId.equals': sddcId,
        page: 0,
        size: 10000
      }
    }).then(({success, data}) => {
      if (success && data) {
        this.setState({
          productData: data
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
          <Popconfirm title="确认要删除该产品吗？" onConfirm={() => this.deleteCp(record)} okText="是" cancelText="否">
            <Link icon='delete' type='danger'>删除</Link>
          </Popconfirm>
          </span>
        )
      }
    }];
    return columns;
  };

  addShareholder = () => {
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

  deleteCp = (record) => {
    const {productData} = this.state;
    const _productData = _.cloneDeepWith(productData);
    _.remove(_productData, item => item.id === record.id);
    this.setState({
      productData: _productData
    });
  };

  //新增产品确定按钮回调
  addCp = (formData) => {
    const {productData} = this.state;
    const _productData = _.cloneDeep(productData);
    _productData.push(formData);
    this.setState({
      addvisible: false,
      productData: _productData
    });
  };

  //编辑产品信息确定按钮回调
  editCp = (formData) => {
    const {record, productData} = this.state;
    _.remove(productData, item => item.id === record.id);
    const _productData = _.cloneDeep(productData);
    _productData.push(formData);

    this.setState({
      editvisible: false,
      productData: _productData
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
    const {productData} = this.state;
    if (id || (productData[0] && productData[0].id && productData[0].id.split('-').length <2)) {
      productData && productData.map(item => {
        item.rownumber && delete item.rownumber;
        if (item.id && item.id.split('-').length > 2) {
          _.set(item, 'id', null)
        }
      });
      //修改
      dispatch({
        type: `khgj/editProduct`,
        payload: {
          productData,
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
      productData && productData.map(item => {
        if (item.id && item.id.split('-').length > 2) {
          item.rownumber && delete item.rownumber;
          _.set(item, 'id', null)
        }
      });
      dispatch({
        type: `khgj/addProduct`,
        payload: {
          productData,
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

  render() {
    const {addvisible, editvisible, record, productData} = this.state;
    const {sddcId} = this.props;
    let _list = [];
    if (productData) {
      _list = productData.map((d, idx) => {
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
            onClick={() => this.addShareholder()}>新增产品</Button>
        </div>
        <div className={styles.btnGroup}>
          <Button type="primary" size="small" onClick={() => {
            this.props.changeStep(0)
          }}>上一页</Button>
          <Button
            className={styles.btn}
            type="primary"
            size="small"
            icon="save"
            onClick={() => {
            this.onSave()
          }}>保存</Button>
          <Button className={styles.btn}
                  type="primary"
                  size="small"
                  onClick={() => {
                    this.onSave();
                    this.props.changeStep(2);
                  }}>
            下一页
          </Button>
        </div>
        <AddProduct visible={addvisible}
                    sddcId={sddcId}
                    title='新增公司产品'
                    addCp={this.addCp}
                    onCancel={this.handleAddCancel}/>
        <EditModal visible={editvisible}
                   record={record}
                   sddcId={sddcId}
                   title='编辑产品信息'
                   editCp={this.editCp}
                   onCancel={this.handleEditCancel}/>
      </div>
    )
  }
}
