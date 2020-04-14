import React, { PureComponent } from 'react';
import { Card, Row, Col, Table, Divider, Icon, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import LineWrap from '@/components/LineWrap';
import PageLayout from '@/layouts/PageLayout';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import GenHexBGColorAvatar from './components/GenHexBGColorAvatar';
import LxrModal from './components/LxrModal';
import RcgjModal from './components/RcgjModal';
import SddcModal from './components/SddcModal';
import router from 'umi/router';
import styles from './customerDetail.less';

const breadcrumbs = [
  { icon: 'home', path: '/' },
  { label: '客户信息', path: '/customer' },
  { label: '客户信息详情' },
];
@connect((state) => ({
  customer: state.customer,
  lxr: state.lxr,
}))

export default class CustomerInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      customerdata: {},
      lxrVisible: false,
      rcgjVisible: false,
      sddcVisible: false,
      contractVisible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.loadData();
    dispatch({
      type: 'customer/getAreaOptions',
      payload: {
        parentCode: '',
        parentLevel: '0',
      },
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          provinceData: data,
        });
      }
    });
  }

  loadData = () => {
    const { dispatch, location: { query: { id } } } = this.props;
    dispatch({
      type: 'customer/detailInfo',
      payload: { id: id },
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          customerdata: data,
        });
      } else {
        message.error('数据获取失败');
      }
    });
  };

  //客户信息详情
  basicInfo = () => {
    const { dispatch } = this.props;
    const { customerdata } = this.state;
    const path = `/customer/detailForm`;
    dispatch(
      routerRedux.push({
        pathname: path,
        query: {
          id: customerdata.id,
        },
      }),
    );
  };

  //信用评估详情
  fxpgInfo = () => {
    const { dispatch } = this.props;
    const { customerdata } = this.state;

    const addpath = '/khpg/fxpg';
    const checkpath = `/khpg/fxpg/check`;
    dispatch(
      routerRedux.push({
        pathname: (customerdata.crmLsfx && customerdata.crmLsfx.grade) ? checkpath : addpath,
        query: {
          id: customerdata.id,
          khdm: customerdata.khdm,
          khmc: customerdata.khmc,
          modify: (customerdata.crmLsfx && customerdata.crmLsfx.grade) ? true : false,
        },
      }),
    );
  };

  //综合评估详情
  zhpgInfo = () => {
    const { dispatch } = this.props;
    const { customerdata } = this.state;
    const addpath = `/khpg/zhpg`;
    const checkpath = '/khpg/zhpg/check';
    dispatch(
      routerRedux.push({
        pathname: customerdata.crmZhpg ? checkpath : addpath,
        query: {
          id: customerdata.id,
          khdm: customerdata.khdm,
          khmc: customerdata.khmc,
          zhpg: customerdata.crmZhpg ? true : false,
        },
      }),
    );
  };

  //联系人主页
  lxrInfo = () => {
    const { dispatch } = this.props;
    const { customerdata } = this.state;
    const path = '/customer/newLxr';
    dispatch(
      routerRedux.push({
        pathname: path,
        query: {
          id: customerdata.id,
          khmc: customerdata.khmc,
        },
      }),
    );
  };

  //客户资质详情
  zzInfo = () => {
    const { dispatch } = this.props;
    const { customerdata } = this.state;
    const khzz = customerdata.crmKhzz && _.groupBy(customerdata.crmKhzz.crmKhzzItemdtos, 'groupby');
    const addpath = `/khpg/zzpg`;
    const checkpath = '/khpg/zzpg/check';
    dispatch(
      routerRedux.push({
        pathname: khzz ? checkpath : addpath,
        query: {
          id: customerdata.id,
          khdm: customerdata.khdm,
          khmc: customerdata.khmc,
          zzxx: khzz ? true : false,
        },
      }),
    );
  };

  //客户跟进主页
  getKhgjInfo = (type) => {
    const { dispatch } = this.props;
    const { customerdata } = this.state;
    const path = '/khgj';
    dispatch(
      routerRedux.push({
        pathname: path,
        query: {
          type: type,
          id: customerdata.id,
        },
      }),
    );
  };

  renderRcgjHeader = () => {
    return (
      <div className={styles.tableContent}>
        <span>日常跟进信息</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a onClick={this.addRcgj}>新增</a>
        <a style={{ float: 'right' }} onClick={() => {
          this.getKhgjInfo('1');
        }}>更多</a>
      </div>
    );
  };

  renderSddyHeader = () => {
    return (
      <div className={styles.tableContent}>
        <span>实地调研记录</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a onClick={this.addSddc}>新增</a>
        <a style={{ float: 'right' }} onClick={() => {
          this.getKhgjInfo('2');
        }}>更多</a>
      </div>
    );
  };

  //客户跟进每条具体详情
  checkRcgj = (record) => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/khgj/ckjl',
        query: {
          id: record.customerId,
          khgjId: record.id,
        },
      }),
    );
  };

  //实地调查每条具体信息
  checkSddc = (record) => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/khgj/sddcDetail`,
        query: {
          id: record.customerId,
          khgjId: record.id,
        },
      }),
    );
  };

  renderRcgjCell = () => {
    const columns = [{
      title: '记录日期',
      dataIndex: 'jlrq',
      key: 'jlrq',
      width: '100px',
      render: (text, record) => {
        if (record.createdDate) {
          const date = moment(record.createdDate).format('YYYY-MM-DD');
          return (<span>{date}</span>);
        }
      },
    }, {
      title: '跟进目的',
      dataIndex: 'gjmd',
      key: 'gkmd',
      render: (text, record) => {
        return (
          <LineWrap title={text} lineClampNum={1}/>
        );
      },
    }, {
      title: '客户与会人',
      dataIndex: 'khyhr',
      key: 'khyhr',
      width: '130px',
      render: (text, record) => {
        let khfcyryNames = [];
        if (record.crmKhgjRies) {
          record.crmKhgjRies.map((item) => {
            if (item && item.type === 3) {
              khfcyryNames.push(item.userName);
            }
          });
        }
        return (
          khfcyryNames && khfcyryNames.map((o, i) => {
            return (<span>{o}{i + 1 === khfcyryNames.length ? '' : '、'}</span>);
          })
        );
      },
    }, {
      title: '记录人',
      dataIndex: 'createdName',
      key: 'createdName',
      width: '100px',
      render: (text, record) => {
        return (<span>{record.createdName && record.createdName}</span>);
      },
    }, {
      title: '操作',
      dataIndex: 'xq',
      key: 'xq',
      width: '50px',
      render: (text, record) => {
        return (
          <a onClick={() => {
            this.checkRcgj(record);
          }}>查看</a>
        );
      },
    }];
    return columns;
  };

  renderSddyCell = () => {
    const columns = [{
      title: '记录日期',
      dataIndex: 'jlrq',
      key: 'jlrq',
      render: (text, record) => {
        if (record.createdDate) {
          const date = moment(record.createdDate).format('YYYY-MM-DD');
          return (<span>{date}</span>);
        }
      },
    }, {
      title: '调研人',
      dataIndex: 'gjmd',
      key: 'gkmd',
      render: (text, record) => {
        let dyrNames = [];
        if (record.crmKhgjRies) {
          record.crmKhgjRies.map((item) => {
            if (item && item.type === 1) {
              dyrNames.push(item.userName);
            }
          });
        }
        return (
          dyrNames && dyrNames.map((o, i) => {
            return (<span>{o}{i + 1 === dyrNames.length ? '' : '、'}</span>);
          })
        );
      },
    }, {
      title: '客户与会人',
      dataIndex: 'khyhr',
      key: 'khyhr',
      render: (text, record) => {
        let khfcyrNames = [];
        if (record.crmKhgjRies) {
          record.crmKhgjRies.map((item) => {
            if (item && item.type === 2) {
              khfcyrNames.push(item.userName);
            }
          });
        }
        return (
          khfcyrNames && khfcyrNames.map((o, i) => {
            return (<span>{o}{i + 1 === khfcyrNames.length ? '' : '、'}</span>);
          })
        );
      },
    }, {
      title: '记录人',
      dataIndex: 'jlr',
      key: 'jlr',
      render: (text, record) => {
        return (<span>{record.createdName && record.createdName}</span>);
      },
    }, {
      title: '操作',
      dataIndex: 'xq',
      key: 'xq',
      render: (text, record) => {
        return (
          <a onClick={() => {
            this.checkSddc(record);
          }}>查看</a>
        );
      },
    }];
    return columns;
  };

  addLxr = () => {
    this.setState({
      lxrVisible: true,
    });
  };

  lxrOk = (formData) => {
    const { dispatch } = this.props;
    const { customerdata } = this.state;
    //去掉新增联系人时前端生产的id
    if (formData.id.split('-').length > 2) {
      delete formData.id;
    }
    dispatch({
      type: 'lxr/addLxr',
      payload: {
        ...formData,
        customerId: customerdata.id,
      },
    }).then(({ success, data }) => {
      if (success && data) {
        //message.success('添加成功');
        this.setState({
          lxrVisible: false,
        });
        this.loadData();
      }
    });
  };

  lxrCancel = () => {
    this.setState({
      lxrVisible: false,
    });
  };

  addRcgj = () => {
    this.setState({
      rcgjVisible: true,
    });
  };

  addSddc = () => {
    this.setState({
      sddcVisible: true,
    });
  };

  rcgjOk = (formData) => {
    const { dispatch } = this.props;
    const { customerdata } = this.state;
    dispatch({
      type: 'khgj/saveAddRcgj',
      payload: {
        ...formData,
        customerId: customerdata.id,
        type: '1',
      },
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          rcgjVisible: false,
        });
        this.loadData();
      }
    });
  };

  rcgjCancel = () => {
    this.setState({
      rcgjVisible: false,
    });
  };

  sddcCancel = () => {
    this.setState({
      sddcVisible: false
    })
  };

  contractDetail = () => {
    const {customerdata} = this.state;
    if(!_.isEmpty(customerdata.crmContractdtos)) {
      router.push({
        pathname: '/customer/contract',
        query: {
          id:customerdata.id
        }
      })
    }else {
      message.info('暂无合作')
    }
  };

  render() {
    const { customerdata, lxrVisible, rcgjVisible, sddcVisible, contractVisible } = this.state;
    const khzz = customerdata.crmKhzz && _.groupBy(customerdata.crmKhzz.crmKhzzItemdtos, 'groupby');
    const rcgjData = _.filter(customerdata.crmKhgjs, item => item.type === '1');
    const _rcgjData = _.slice(rcgjData, 0, 3);  //取前3条数据
    const sddyData = _.filter(customerdata.crmKhgjs, item => item.type === '2');
    const _sddyData = _.slice(sddyData, 0, 3);  //取前3条数据
    const address = customerdata.cs && customerdata.cs.replace(/[/]/g, '');

    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.contain}>
          <div className={styles.content}>
            <div>
              <span className={styles.gsmc}>{customerdata.khmc}</span>
              <a style={{ float: 'right' }} onClick={() => {
                this.basicInfo();
              }}>公司详情</a>
            </div>
            <Divider style={{ margin: '10px 0' }}/>
            <Row gutter={{ md: 25, lg: 25, xl: 25 }}>
              <Col span={17} className={styles.left}>
                <Row gutter={{ md: 8, lg: 8, xl: 8 }}>
                  <Col xl={9} lg={9} md={9} sm={24} className={styles.form}>
                    <div className={styles.label}>
                      <span>企业性质</span>
                    </div>
                    <span style={{ marginTop: 5 }}>
                      <LineWrap title={customerdata.extraQyxz && customerdata.extraQyxz} lineClampNum={1}/>
                    </span>
                  </Col>
                  <Col xl={15} lg={15} md={15} sm={24} className={styles.form}>
                    <div className={styles.label}>
                      <span>公司网址</span>
                    </div>
                    <span className={styles.span}>{customerdata.extraGsWz && customerdata.extraGsWz}</span>
                  </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 8, xl: 8 }}>
                  <Col xl={9} lg={9} md={9} sm={24} className={styles.form}>
                    <div className={styles.label}>
                      <span>公司简称</span>
                    </div>
                    <span style={{ marginTop: 5 }}>
                      <LineWrap title={customerdata.khjc && customerdata.khjc} lineClampNum={1}/>
                    </span>
                  </Col>
                  <Col xl={15} lg={15} md={15} sm={24} className={styles.form}>
                    <div className={styles.label}>
                      <span>通讯地址</span>
                    </div>
                    <span style={{ marginTop: 5 }}>
                      {address}
                      {customerdata.txdz && customerdata.txdz}
                    </span>
                  </Col>
                </Row>
                <Row gutter={14} style={{ marginTop: 15 }}>
                  <Col xl={8} lg={8} md={8} sm={24}>
                    <div className={styles.diviBorder}>
                      <div className={styles.cardTileA}>
                        <span style={{ fontWeight: 'bold', marginLeft: '10px', lineHeight: '40px' }}>信用评估</span>
                        <a style={{ float: 'right', marginRight: '10px', lineHeight: '40px', color: 'white' }}
                           onClick={() => {
                             this.fxpgInfo();
                           }}>详情</a>
                      </div>
                      {
                        customerdata.crmLsfx && customerdata.crmLsfx.grade ?
                          <div style={{ textAlign: 'center', marginTop: '3%' }}>
                            <span style={{ color: '#39c93a', fontSize: '15px' }}>评估等级</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <span style={{
                              color: '#39c93a',
                              fontWeight: 'bold',
                              fontSize: '25px',
                            }}>{customerdata.crmLsfx.grade}</span><br/>
                            <span
                              style={{ color: '#c2c2c2' }}>{customerdata.crmLsfx ? customerdata.crmLsfx.pgsj ? moment(customerdata.crmLsfx.pgsj).format('YYYY-MM-DD') : null : null}</span>
                          </div> :
                          <div className={styles.lineThree}>
                            <span style={{
                              color: '#c2c2c2',
                              fontWeight: 'bold',
                              fontSize: '17px',
                            }}>未评估</span><br/>
                            <a style={{ fontSize: '17px' }} onClick={this.fxpgInfo}>去评估</a>
                          </div>
                      }
                    </div>
                  </Col>
                  <Col xl={8} lg={8} md={8} sm={24}>
                    <div className={styles.diviBorder}>
                      <div className={styles.cardTitleC}>
                        <span style={{ fontWeight: 'bold', marginLeft: '10px', lineHeight: '40px' }}>综合评估</span>
                        <a style={{ float: 'right', marginRight: '10px', lineHeight: '40px', color: 'white' }}
                           onClick={() => {
                             this.zhpgInfo();
                           }}>
                          详情
                        </a>
                      </div>
                      {
                        customerdata.crmZhpg ?
                          <div style={{ textAlign: 'center', marginTop: '3%' }}>
                            <span style={{
                              color: '#f0a527',
                              fontWeight: 'bold',
                              fontSize: '25px',
                            }}>已评估</span><br/>
                            <span
                              style={{ color: '#c2c2c2' }}>{customerdata.crmZhpg ? customerdata.crmZhpg.pgsj ? moment(customerdata.crmZhpg.pgsj).format('YYYY-MM-DD') : null : null}</span>
                          </div> :
                          <div className={styles.lineThree}>
                            <span style={{
                              color: '#c2c2c2',
                              fontWeight: 'bold',
                              fontSize: '17px',
                            }}>未评估</span><br/>
                            <a style={{ fontSize: '17px' }} onClick={this.zhpgInfo}>去评估</a>
                          </div>
                      }
                    </div>
                  </Col>
                  <Col xl={8} lg={8} md={8} sm={24}>
                    <div className={styles.diviBorder}>
                      <div className={styles.cardCom}>
                        <span style={{ fontWeight: 'bold', marginLeft: '10px', lineHeight: '40px' }}>关联合同</span>
                        <a style={{float: 'right', marginRight: '10px', lineHeight: '40px', color: 'white'}}
                        onClick={() => {this.contractDetail()}}>
                        详情
                        </a>
                      </div>
                      {
                        !_.isEmpty(customerdata.crmContractdtos) ?
                          <div style={{ textAlign: 'center', marginTop: '3%' }}>
                            <span style={{
                              color: '#f0a527',
                              fontWeight: 'bold',
                              fontSize: '25px',
                            }}>合同数{customerdata.crmContractdtos.length}</span><br/>
                          </div> :
                          <div className={styles.lineThree}>
                            <span style={{
                              color: '#c2c2c2',
                              fontWeight: 'bold',
                              fontSize: '25px',
                            }}>暂无合作</span><br/>
                          </div>
                      }
                    </div>
                  </Col>
                </Row>
                <Table style={{ marginTop: 20 }}
                       columns={this.renderRcgjCell()}
                       dataSource={_rcgjData}
                       title={this.renderRcgjHeader}
                       pagination={false}
                />
                <Table style={{ marginTop: 20, marginBottom: 30 }}
                       columns={this.renderSddyCell()}
                       dataSource={_sddyData}
                       title={this.renderSddyHeader}
                       pagination={false}
                />
              </Col>
              <Col span={7}>
                <Row>
                  <Col xl={24} lg={24} md={24} sm={24}>
                    <Card size="small">
                      <div>
                        <Icon type="phone" style={{ color: '#1890ff', transform: 'rotate(90deg)' }}/>
                        <span style={{ fontWeight: 'bold', marginLeft: 10 }}>联系人</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <a onClick={this.addLxr}>新增</a>
                        <a style={{ float: 'right' }} onClick={() => {
                          this.lxrInfo();
                        }}>更多</a>
                      </div>
                      <Divider style={{ margin: '10px 0' }}/>
                      {
                        !_.isEmpty(customerdata.crmCustomerLxrdtos) ?
                          customerdata.crmCustomerLxrdtos.map((item, i) => {
                            if (i < 7) {
                              return (
                                <Row gutter={14} key={i}>
                                  <Col xl={5} lg={5} md={5} sm={24}>
                                    <GenHexBGColorAvatar lastNameOnly text={item.xm}/>
                                  </Col>
                                  <Col xl={7} lg={7} md={7} sm={24}>
                                    <div>
                                      <span>{item.xm}</span><br/>
                                      <span style={{ color: '#c2c2c2', fontSize: '12px' }}>{item.zw}</span>
                                    </div>
                                  </Col>
                                  <Col xl={9} lg={9} md={9} sm={24}>
                                    <span style={{ lineHeight: '35px' }}>{item.lxdh}</span>
                                  </Col>
                                </Row>
                              );
                            }
                          }) :
                          <div className={styles.leftSpan}>
                          <span style={{
                            color: '#c2c2c2',
                            fontWeight: 'bold',
                            fontSize: '25px',
                          }}>未添加</span><br/>
                          </div>
                      }
                    </Card>
                  </Col>
                </Row>
                <Row style={{ marginTop: 20 }}>
                  <Col xl={24} lg={24} md={24} sm={24}>
                    <Card size="small">
                      <div>
                        <Icon type="solution" style={{ color: '#1890ff' }}/>
                        <span style={{ fontWeight: 'bold', marginLeft: 10 }}>资质</span>
                        <a style={{ float: 'right' }} onClick={() => {
                          this.zzInfo();
                        }}>详情</a>
                      </div>
                      <Divider style={{ margin: '10px 0' }}/>
                      {
                        khzz ? _.map(khzz, (v, k) => {
                            const fj = _.find(v, item => item.fileList.length > 0);
                            return (
                              <div className={styles.judge} key={k}>
                                <div className={styles.type}>
                                  <span>{k}</span>
                                  <span style={{ float: 'right', color: '#c2c2c2' }}>
                                  {
                                    fj ? '已上传' : '未上传'
                                  }
                                </span>
                                </div>
                              </div>
                            );
                          }) :
                          <div className={styles.leftSpan}>
                            <span style={{
                              color: '#c2c2c2',
                              fontWeight: 'bold',
                              fontSize: '25px',
                            }}> 未填写 </span>
                          </div>
                      }
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
        <LxrModal
          title="新增联系人"
          id={customerdata.id}
          khmc={customerdata.khmc}
          visible={lxrVisible}
          addLxr={this.lxrOk}
          onCancel={this.lxrCancel}/>
        <RcgjModal
          title="新增拜访记录"
          id={customerdata.id}
          khmc={customerdata.khmc}
          visible={rcgjVisible}
          addRcgj={this.rcgjOk}
          onCancel={this.rcgjCancel}/>
        <SddcModal
          title="新增实地调研"
          id={customerdata.id}
          khmc={customerdata.khmc}
          visible={sddcVisible}
          loadData={this.loadData}
          onCancel={this.sddcCancel}/>
      </PageLayout>
    );
  }
}
