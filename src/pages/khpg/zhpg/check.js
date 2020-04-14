import React, { PureComponent } from 'react';
import { Button, Form, Row, Col, Table, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import PageLayout from '@/layouts/PageLayout';
import { routerRedux } from 'dva/router';
import styles from '../index.less';

const FormItem = Form.Item;

@Form.create()
@connect((khpg) => ({
  khpg,
}))

export default class Zhpg extends PureComponent {
  constructor(props) {
    super(props);
    const { location: { query: { btnName } } } = this.props;
    this.state = {
      data: {},        //表格数据
      btnName: btnName,
      modify: false,
    };
  }

  componentDidMount() {
    const { location: { query: { id } }, dispatch } = this.props;
    //查看
    dispatch({
      type: 'khpg/getZhpgData',
      payload: { customerId: id },
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          data: data,
        });
      }
    });
  }

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  renderCell = () => {
    const columns = [{
      title: '',
      colSpan: 2,
      width: 320,
      dataIndex: 'groupby',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        const start = _.findIndex(this.state.data.crmZhpgItemdtos, function(o) {
          return o.groupby === row.groupby;
        });
        const end = _.findLastIndex(this.state.data.crmZhpgItemdtos, function(o) {
          return o.groupby === row.groupby;
        });

        if (index === start) {
          obj.props.rowSpan = end - start + 1;
        }
        if (index > start && index <= end) {
          obj.props.rowSpan = 0;
        }
        return obj;
      },
    }, {
      title: '标签',
      dataIndex: 'item',
      colSpan: 0,
      width: 320,
    }, {
      title: '',
      dataIndex: 'text',
      //width: 320,
      render: (value, row) => {
        return (
          <span>{row && row.itemContent}</span>
        );
      },
    }];
    return columns;
  };

  edit = () => {
    const { location: { query: { zhpg, khdm, khmc, id } }, dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/khpg/zhpg`,
        query: {
          zhpg: zhpg,
          id: id,
          khdm: khdm,
          khmc: khmc,
        },
      }),
    );
  };

  renderSearchForm = () => {
    const {getFieldDecorator} = this.props.form;
    const {location: {query: {khmc}}} = this.props;
    const {data} = this.state;
    const pgsj = data.pgsj && moment(data.pgsj).format('YYYY-MM-DD');

    return (
      <Form layout="inline">
        <Row>
          <Col span={8}>
            <FormItem label='客户名称：'>
              {getFieldDecorator('khmc', {
                initialValue: khmc && khmc,
              })(
                <span>{khmc && khmc}</span>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='评估时间：'>
              {getFieldDecorator('pgsj', {})(
                <span>{pgsj && pgsj}</span>,
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const { data } = this.state;
    const { location: { query: {khmc, id} }, form: {getFieldDecorator} } = this.props;
    const pgsj = data.pgsj && moment(data.pgsj).format('YYYY-MM-DD');
    const breadcrumbs = [
      { icon: 'home', path: '/' },
      {label: '客户信息', path: '/customer'},
      {label: '客户信息详情', path: `/customer/customerDetail?id=${id}`},
      { label: '综合评估查看'}
    ];

    const columns = this.renderCell();
    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.content}>
          <div className={styles.apply}>
            <div>
              <Button icon={'edit'} type='primary' size='small' onClick={() => this.edit()}>
                修改
              </Button>
            </div>
            <div style={{marginBottom: '10px'}}>
              {this.renderSearchForm()}
            </div>
            <Table columns={columns}
                   style={{ marginBottom: '20px' }}
                   dataSource={data.crmZhpgItemdtos}
                   title={() => <span>综合评估</span>}
                   pagination={false}
                   showHeader={false}
                   bordered/>
          </div>
        </div>
      </PageLayout>
    );
  }
}
