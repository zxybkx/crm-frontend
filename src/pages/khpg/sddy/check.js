/**
 * Created by sam on 2019/7/1.
 */
import React, {PureComponent} from 'react';
import {Form, Table, Row, Col, Card, Button, Icon} from 'antd';
import {connect} from 'dva';
import moment from 'moment';
import {routerRedux} from 'dva/router';
import PageLayout from '@/layouts/PageLayout';
import styles from'../index.less';

const {Item: FormItem} = Form;
const breadcrumbs = [
  {icon: 'home', path: '/'},
  {label: '客户评估', path: '/khpg'},
  {label: '实地调研评估', path: '/khpg'},
  {label: '查看'}
];
@Form.create()
@connect((khpg) => ({
  khpg
}))

export default class Sddy extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      dataList: [],
      total: 0,
      current: 1,
      pageSize: 10,
    }
  }

  componentDidMount() {
    const {dispatch, location: {query: id, customerId}} = this.props;
    const payload = {
      'customerId.equals': customerId,
      'enabled.equals': 'T',
      'type.equals': 2,
      current: 1,
      pageSize: 10
    };
    this.tableData(payload);
    dispatch({
      type: 'khpg/getSddy',
      payload: id
    }).then(({success, data}) => {
      if (success && data) {
        this.setState({
          data: data
        })
      }
    })
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

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  renderInitial = () => {
    const {form: {getFieldDecorator}} = this.props;
    const {data} = this.state;
    return (
      <Form layout="inline">
        <Row>
          <Col span={6}>
            <FormItem label='调查人员'>
              {getFieldDecorator('dcry', {})(
                <span>{data && data.dcry}</span>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label='调查时间：'>
              {getFieldDecorator('dcsj', {})(
                <span>{data.dcsj ? moment(data.dcsj).format('YYYY-MM-DD') : ''}</span>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  renderFinal = () => {
    const {getFieldDecorator} = this.props.form;
    const {data} = this.state;
    return (
      <Form layout="inline">
        <Row>
          <Col span={6}>
            <FormItem label='评价人'>
              {getFieldDecorator('pjr', {})(
                <span>{data && data.pjr}</span>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label='评估时间：'>
              {getFieldDecorator('pgsj', {})(
                <span>{data.pgsj ? moment(data.pgsj).format('YYYY-MM-DD') : ''}</span>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  edit = () => {
    const {dispatch, location: {query: {id,customerId}}} = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/khpg/sddy/edit',
        query: {id, customerId}
      })
    )
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
    const {data, dataList, pageSize, total, current} = this.state;

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
            <Button
              type='primary'
              size={'small'}
              icon={'edit'}
              onClick={() => this.edit()}
              className={styles.editBtn}>
              修改
            </Button>
            <Card title="实地调查人员初评" size="small">
              <div style={{marginBottom: '10px'}}>
                {this.renderInitial()}
              </div>
              <FormItem>
                {getFieldDecorator('cpjy', {})(
                  <div>
                    <span>初评内容：</span>
                    <span>{data && data.cpjy}</span>
                  </div>
                )}
              </FormItem>
            </Card>
            <Card className={styles.final} title="实地调查人员终评" size="small">
              <div >
                <div style={{marginBottom: '10px'}}>
                  {this.renderFinal()}
                </div>
                <FormItem>
                  {getFieldDecorator('pjxq', {})(
                    <div>
                      <span>终评内容：</span>
                      <span>{data && data.pjxq}</span>
                    </div>
                  )}
                </FormItem>
              </div>
            </Card>
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
