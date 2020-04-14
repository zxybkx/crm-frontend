import React, { PureComponent } from 'react';
import { Col, Row, Table, Collapse, Button, Form, DatePicker, message, InputNumber, Modal } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageLayout from '@/layouts/PageLayout';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
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
      breadcrumbs: [],
      visible: false,
    };
  }

  componentDidMount() {
    const { dispatch, location: { query: { modify, id } } } = this.props;
    if (modify) {
      //查看
      dispatch({
        type: 'khpg/getFxpgData',
        payload: { id: id },
      }).then((result) => {
        const { success, data, message } = result;
        !_.isEmpty(message) && message.error('数据获取失败!');
        if (success && data) {
          this.setState({
            data,
            breadcrumbs: [
              { icon: 'home', path: '/' },
              { label: '客户信息', path: '/customer' },
              { label: '客户信息详情', path: `/customer/customerDetail?id=${id}` },
              { label: '风险评估修改' },
            ],
          });
        }
      });
    } else {
      //新增
      dispatch({
        type: 'khpg/getFxpgRules',
      }).then((result) => {
        const { success, data, message } = result;
        !_.isEmpty(message) && message.error('数据获取失败!');
        if (success && data) {
          this.setState({
            data,
            breadcrumbs: [
              { icon: 'home', path: '/' },
              { label: '客户信息', path: '/customer' },
              { label: '客户信息详情', path: `/customer/customerDetail?id=${id}` },
              { label: '风险评估新增' },
            ],
          });
        }
      });
    }
  }

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  renderSearchForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { location: { query: { khmc } } } = this.props;
    const { data } = this.state;

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
              {getFieldDecorator('pgsj', {
                initialValue: (data.pgsj && moment(data.pgsj)) || moment(),
                rules: [{ required: true, message: '请选择评估时间!' }],
              })(
                <DatePicker disabledDate={this.disabledDate}/>,
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  //小计业务评分
  getQyYwpf = (title, value) => {
    const { form: { validateFields } } = this.props;
    const { data } = this.state;
    const _data = _.cloneDeepWith(data);

    validateFields((errs, fields) => {
      if (errs) return;
      let ywpf = null;
      _.forEach(fields, (v, k) => {
        if (k.split('-')[0] === title) {
          ywpf = value;
        }
      });

      _.map(_data.crmLsfxItemdtos, (item, i) => {
        if (item.items.pgx === title) {
          _.set(item, 'ywpf', ywpf);
        }
      });

      this.setState({
        data: _data,
      });
    });
  };

  //小计综合评分
  getQyZzpf = (title, value) => {
    const { form: { validateFields } } = this.props;
    const { data } = this.state;
    const _data = _.cloneDeepWith(data);

    validateFields((errs, fields) => {
      if (errs) return;
      let zzpf = null;
      _.forEach(fields, (v, k) => {
        if (k.split('-')[0] === title) {
          zzpf = value;
        }
      });

      _.map(_data.crmLsfxItemdtos, (item, i) => {
        if (item.items.pgx === title) {
          _.set(item, 'zgpf', zzpf);
        }
      });

      this.setState({
        data: _data,
      });
    });
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

  renderQyCell = () => {
    const { form: { getFieldDecorator } } = this.props;
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
            {getFieldDecorator(`${row.items.pgx}-ywpf`, {
              initialValue: row.ywpf && row.ywpf,
              rules: [{
                message: '请输入正确的分数',
                pattern: new RegExp(/^([0-9]\d*)(\.[0-9]\d*)?$/),
              }],
            })(
              <InputNumber onBlur={(e) => this.getQyYwpf(row.items.pgx, e.target.value)} min={0}
                           max={_.toNumber(row.items.zf)}/>,
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
            {getFieldDecorator(`${row.items.pgx}-zzpf`, {
              initialValue: row.zgpf && row.zgpf,
              rules: [{
                message: '请输入正确的分数',
                pattern: new RegExp(/^([0-9]\d*)(\.[0-9]\d*)?$/),
              }],
            })(
              <InputNumber onBlur={(e) => this.getQyZzpf(row.items.pgx, e.target.value)} min={0}
                           max={_.toNumber(row.items.zf)}/>,
            )}
          </FormItem>
        );
      },
    }];
    return columns;
  };

  renderQyFooter = (tableData, groupby) => {
    const { data } = this.state;
    // 业务评分
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

  onSave = () => {
    const { data } = this.state;
    const { location: { query: { id, modify } }, dispatch, form: { validateFieldsAndScroll } } = this.props;

    let pgsj;
    validateFieldsAndScroll((errs, fields) => {
      if (errs) return;
      pgsj = fields['pgsj'];
      _.set(data, 'pgsj', pgsj);
      _.set(data, 'customerId', id);

      if (modify) {
        //修改保存
        dispatch({
          type: 'khpg/editFxpgSave',
          payload: data,
        }).then(({ success, data }) => {
          if (success && data) {
            message.success('保存成功');
            dispatch(
              routerRedux.push({
                pathname: '/customer/customerDetail',
                query: {
                  id: id,
                },
              }),
            );
          }
        });
      } else {
        //新增保存
        dispatch({
          type: 'khpg/addFxpgSave',
          payload: data,
        }).then(({ success, data }) => {
          if (success && data) {
            message.success('保存成功');
            dispatch(
              routerRedux.push({
                pathname: '/customer/customerDetail',
                query: {
                  id: id,
                },
              }),
            );
          }
        });
      }
    });
  };

  judgePoint = () => {
    const { data } = this.state;

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

    const judgeSolution = (zlYwpf === null || zlzzpf === null || zlYwpf === 0 || zlzzpf === 0);
    if (judgeSolution) {
      this.setState({
        visible: true,
      });
    } else {
      this.onSave();
    }
  };

  onOk = () => {
    this.setState({
      visible: false,
    });
    this.onSave();
  };

  onCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { data, breadcrumbs, visible } = this.state;
    const { loading } = this.props;
    const _data = _.groupBy(data.crmLsfxItemdtos, 'groupby');
    Number.prototype.add = function(arg) {
      return accAdd(arg, this);
    };

    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.step}>
          <div className={styles.apply}>
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
            <div className={styles.btnGroup}>
              <Button icon={'save'}
                      type={'primary'}
                      size="small"
                      onClick={() => {
                        this.judgePoint();
                      }}>
                保存
              </Button>
            </div>
          </div>
        </div>
        <Modal
          title={'保存提示'}
          visible={visible}
          footer={[
            <Button size='small' type='primary' onClick={this.onOk}>确定</Button>,
            <Button size='small' onClick={this.onCancel}>取消</Button>,
          ]}>
          <span style={{ fontSize: '17px' }}>总计中有0分项，确定保存吗？</span>
        </Modal>
      </PageLayout>
    );
  }
}
