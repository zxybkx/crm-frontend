/**
 * Created by sam on 2019/7/1.
 */
import React, {PureComponent} from 'react';
import {Form, Table, Row, Col, Input, DatePicker, Button, message, Icon} from 'antd';
import {connect} from 'dva';
import moment from 'moment';
import _ from 'lodash';
import {routerRedux} from 'dva/router';
import PageLayout from '@/layouts/PageLayout';
import styles from'../index.less';

const {Item: FormItem} = Form;
const {TextArea} = Input;
const breadcrumbs = [
  {icon: 'home', path: '/'},
  {label: '客户评估', path: '/khpg'},
  {label: '实地调研评估', path: '/khpg'},
  {label: '新增'}
];
@Form.create()
@connect((khpg) => ({
  khpg
}))

export default class Sddy extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      data: {},
      sddyId: '',
      dataList: [],
      total: 0,
      current: 1,
      pageSize: 10,
    }
  }

  componentDidMount() {
    const {location: {query: {customerId}}} = this.props;
    const payload = {
      'customerId.equals': customerId,
      'enabled.equals': 'T',
      'type.equals': 2,
      current: 1,
      pageSize: 10
    };
    this.loadData();
    this.tableData(payload);
  };

  tableData = (params = {}) => {
    const {dispatch, location: {query: {customerId}}} = this.props;
    const {current, pageSize: size} = params;

    dispatch({
      type: 'khpg/getSddyTableData',
      payload: {
        'customerId.equals': customerId,
        'enabled.equals': 'T',
        'type.equals': 2,
        page: current - 1,
        size
      }
    }).then(({success, data, page}) => {
      if (success && data) {
        this.setState({
          dataList: data,
          total: page ? page.total : 0,
          current: current ? current : 1,
          pageSize: size ? size : 10,
        })
      }
    })
  };

  loadData = () => {
    const {dispatch} = this.props;
    const {sddyId} = this.state;
    if (sddyId !== '') {
      dispatch({
        type: 'khpg/getSddy',
        payload: {
          id: sddyId
        }
      }).then(({success, data}) => {
        if (success && data) {
          this.setState({
            data: data,
          })
        }
      })
    }
  };

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  renderInitial = () => {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form layout="inline">
        <Row>
          <Col span={6}>
            <FormItem label='调查人员'>
              {getFieldDecorator('dcry', {})(
                <Input placeholder="调查人员"/>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label='调查时间：'>
              {getFieldDecorator('dcsj', {
                initialValue: moment()
              })(
                <DatePicker disabledDate={this.disabledDate}/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  renderFinal = () => {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form layout="inline">
        <Row>
          <Col span={6}>
            <FormItem label='评价人'>
              {getFieldDecorator('pjr', {})(
                <Input placeholder="调查人员"/>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label='评估时间：'>
              {getFieldDecorator('pgsj', {
                initialValue: moment()
              })(
                <DatePicker disabledDate={this.disabledDate}/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  //初评保存
  onCpSave = () => {
    const {form: {validateFields}, location: {query: {customerId, id}}, dispatch} = this.props;
    const {data} = this.state;
    validateFields((errs, fields) => {
      if (errs) return;
      _.set(fields, 'customerId', customerId);
      _.set(fields, 'type', '1');
      if (id) {
        //修改
        // _.set(fields, 'id', data.id || id);
        // dispatch({
        //   type: 'khpg/editSddy',
        //   payload: {
        //     ...fields,
        //   }
        // }).then(({success, data}) => {
        //   if (success && data) {
        //     message.success('保存成功');
        //   }
        // });
      } else {
        //新增
        dispatch({
          type: 'khpg/addSddy',
          payload: fields
        }).then(({success, data}) => {
          if (success && data) {
            message.success('保存成功');
            this.setState({
              isShow: true,
              sddyId: data.id
            }, () => {
              this.loadData();
            })
          }
        });
      }
    })
  };

  //终评保存
  onZpSave = () => {
    const {location: {query: {customerId}}, form: {validateFields}, dispatch} = this.props;
    const {data} = this.state;
    validateFields((errs, fields) => {
      if (errs) return;
      _.set(fields, 'customerId', customerId);
      _.set(fields, 'type', '1');
      //修改
      _.set(fields, 'id', data.id);
      dispatch({
        type: 'khpg/editSddy',
        payload: {
          ...fields,
        }
      }).then(({success, data}) => {
        if (success && data) {
          message.success('保存成功');
          dispatch(
            routerRedux.push({
              pathname: '/khpg/sddy/check',
              query: {
                id: data.id,
                customerId: customerId
              }
            })
          )
        }
      });
    })
  };

  checkKhgj = (record) => {
    const {dispatch} = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/khgj/sddcDetail`,
        query: {
          id: record.id,
        }
      })
    )
  };

  getColumns = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: 'rownumber',
        key: 'rownumber',
      },{
        title: '调研时间',
        dataIndex: 'createdDate',
        key: 'createdDate',
        render: (text, record) => {
          if (record.createdDate) {
            const date = moment(record.createdDate).format('YYYY-MM-DD');
            return (<span>{date}</span>)
          }
        }
      },  {
        title: '调研人',
        dataIndex: 'createdName',
        key: 'createdName',
      },{
        title: '操作',
        dataIndex: 'cz',
        key: 'cz',
        render: (text, record) => {
          return (
            <div>
              <a onClick={() => {
                this.checkKhgj(record)
              }}
              ><Icon type="file" style={{marginRight: 2}}/>查看</a>
            </div>
          )
        }
      }
    ];
    return columns;
  };

  handleTableChange = ({current, pageSize}) => {
    this.tableData({
      current, pageSize
    });
  };

  render() {
    const {form: {getFieldDecorator}} = this.props;
    const {isShow, data, dataList, pageSize, total, current} = this.state;
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

    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.content}>
          <div className={styles.apply}>
            <p>实地调查人员初评：</p>
            <div style={{marginBottom: '10px'}}>
              {this.renderInitial()}
            </div>
            <FormItem>
              {getFieldDecorator('cpjy', {
                initialValue: data && data.cpjy,
                rules: [{
                  required: true,
                  message: '请输入初评'
                }]
              })(
                <TextArea rows={6}/>
              )}
            </FormItem>
            {
              !isShow ?
                <div className={styles.btnGroup}>
                  <Button icon={'save'}
                          type="primary"
                          size="small"
                          onClick={() => this.onCpSave()}>保存
                  </Button>
                </div> : null
            }
            {
              isShow ?
                <div className={styles.final}>
                  <p>实地调查人员终评：</p>
                  <div style={{marginBottom: '10px'}}>
                    {this.renderFinal()}
                  </div>
                  <FormItem>
                    {getFieldDecorator('pjxq', {
                      initialValue: data && data.pjxq,
                      rules: [{
                        required: true,
                        message: '请输入终评'
                      }]
                    })(
                      <TextArea rows={6}/>
                    )}
                  </FormItem>
                  <div className={styles.btnGroup}>
                    <Button icon={'save'}
                            type="primary"
                            size="small"
                            onClick={() => this.onZpSave()}>保存
                    </Button>
                  </div>
                </div> : null
            }
          </div>
          <p style={{marginTop: '10px'}}>历史实地调研记录</p>
          <Table style={{marginTop: '10px'}}
                 dataSource={_list}
                 pagination={paginationProps}
                 columns={this.getColumns()}
                 rowClassName={(record, index) => index % 2 === 0 ? styles.lel : ''}
                 bordered
                 onChange={this.handleTableChange}
          />
        </div>
      </PageLayout>
    )
  }
}
