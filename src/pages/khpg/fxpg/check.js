import React, { PureComponent } from 'react';
import { Col, Row, Table, Collapse, Button, Form } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import PageLayout from '@/layouts/PageLayout';
import styles from './index.less';

const FormItem = Form.Item;
const { Panel } = Collapse;
@Form.create()
@connect((state) => ({
  khpg: state.khpg,
  loading: state.loading.effects['khpg/getFxpgData'],
}))

export default class Fxpg extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},    //表格数据
    };
  }

  componentDidMount() {
    const { dispatch, location: { query: { id } } } = this.props;
    //查看
    dispatch({
      type: 'khpg/getFxpgData',
      payload: { id: id },
    }).then((result) => {
      const { success, data, message } = result;
      !_.isEmpty(message) && message.error('数据获取失败!');
      if (success && data) {
        this.setState({ data });
      }
    });
  }

  edit = () => {
    const { dispatch, location: { query: { id, khdm, khmc } } } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/khpg/fxpg',
        query: {
          id: id,
          khdm: khdm,
          khmc: khmc,
          modify: true,
        },
      }),
    );
  };

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  renderSearchForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { location: { query: { khmc } } } = this.props;
    const { data } = this.state;

    return (
      <Form layout="inline" style={{marginLeft: 10}}>
        <Row>
          <Col span={8}>
            <FormItem label='客户名称：'>
              {getFieldDecorator('khmc', {})(
                <span>{khmc && khmc}</span>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='评估时间：'>
              {getFieldDecorator('pgsj', {})(
                <span>{data.pgsj && moment(data.pgsj).format('YYYY-MM-DD')}</span>,
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  renderQyCell = () => {
    const { getFieldDecorator } = this.props.form;
    const columns = [{
      title: '评分项',
      dataIndex: 'gz',
      render: (value, row) => {
        return (
          <span>{row.items.pgx}</span>
        );
      },
    }, {
      title: '总分',
      dataIndex: 'zf',
      render: (value, row) => {
        return (
          <span>{row.items.zf}</span>
        );
      },
    }, {
      title: '评分内容与评分标准',
      dataIndex: 'item',
      render: (value, row) => {
        return (
          <div>
            {row.items.mx.map((o, i) => {
              return (
                <span key={o}>
                  {'（'}{i + 1}{'）、'}{o}
                  {i + 1 === row.items.mx.length ? '' : <br/>}
                </span>
              );
            })}
          </div>
        );
      },
    }, {
      title: '业务评分',
      dataIndex: 'ywpf',
      width: '100px',
      render: (value, row) => {
        return (
          <FormItem>
            {getFieldDecorator(`${row.items.pgx}-qyywpf`, {
              initialValue: row.ywpf && row.ywpf,
              rules: [{
                message: '请输入正确的分数',
                pattern: new RegExp(/^\d*$/),
              }],
            })(
              <span>{row.ywpf && row.ywpf}</span>,
            )}
          </FormItem>
        );
      },
    }, {
      title: '最终评分',
      dataIndex: 'zgpf',
      width: '100px',
      render: (value, row) => {
        return (
          <FormItem>
            {getFieldDecorator(`${row.items.pgx}-qyzgpf`, {
              initialValue: row.zgpf && row.zgpf,
              rules: [{
                message: '请输入正确的分数',
                pattern: new RegExp(/^\d*$/),
              }],
            })(
              <span>{row.zgpf && row.zgpf}</span>,
            )}
          </FormItem>
        );
      },
    }];
    return columns;
  };

  //加法函数
  accAdd = (arg1, arg2) => {
    let r1, r2, m;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
  };

  renderQyFooter = (tableData, groupby) => {
    const { data } = this.state;
    let ywpf = null;
    tableData && tableData.map(item => {
      ywpf = this.accAdd(ywpf, _.toNumber(item.ywpf));
    });

    // 最终评分
    let zzpf = null;
    tableData && tableData.map(item => {
      zzpf = this.accAdd(zzpf, _.toNumber(item.zgpf));
    });

    // 总计业务评分
    let zlYwpf = null;
    data.crmLsfxItemdtos && data.crmLsfxItemdtos.map(item => {
      zlYwpf = this.accAdd(zlYwpf, _.toNumber(item.ywpf));
    });

    // 总计最终评分
    let zlzzpf = null;
    data.crmLsfxItemdtos && data.crmLsfxItemdtos.map(item => {
      zlzzpf = this.accAdd(zlzzpf, _.toNumber(item.zgpf));
    });

    return (
      <div>
        <Row>
          <Col span={6} offset={2}>
            <span>小计</span>
          </Col>
          <Col span={3} offset={11}>
            <span>{ywpf}</span>
          </Col>
          <Col span={1}>
            <span>{zzpf}</span>
          </Col>
        </Row>
        {
          groupby === '生产经营管理水平' ?
            <Row>
              <Col span={6} offset={2}>
                <span>总计</span>
              </Col>
              <Col span={3} offset={11}>
                <span>{zlYwpf}</span>
              </Col>
              <Col span={1}>
                <span>{zlzzpf}</span>
              </Col>
            </Row> : null
        }
      </div>
    );
  };

  render() {
    const { location: { query: { id } }, loading } = this.props;
    const { data } = this.state;
    const _data = _.groupBy(data.crmLsfxItemdtos, 'groupby');
    Number.prototype.add = function(arg) {
      return accAdd(arg, this);
    };
    const breadcrumbs = [
      { icon: 'home', path: '/' },
      { label: '客户信息', path: '/customer' },
      { label: '客户信息详情', path: `/customer/customerDetail?id=${id}` },
      { label: '风险评估查看' },
    ];

    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.step}>
          <div className={styles.apply}>
            <Button type='primary' icon={'edit'} size="small" onClick={() => this.edit()}
                    style={{ marginBottom: '10px', marginRight: '10px' }}>
              修改
            </Button>
            {this.renderSearchForm()}
            <Collapse defaultActiveKey={['企业的基本情况', '贸易经营水平', '财税情况', '生产经营管理水平']}>
              {
                _.map(_data, (v, k) => {
                  return (
                    <Panel header={k} key={k}>
                      <Table columns={this.renderQyCell()}
                             dataSource={v}
                             loading={loading}
                             pagination={false}
                             rowClassName={(record, index) => index % 2 === 0 ? styles.lel : ''}
                             footer={(v) => this.renderQyFooter(v, k)}
                             bordered/>
                    </Panel>
                  );
                })
              }
            </Collapse>
          </div>
        </div>
      </PageLayout>
    );
  }
}
