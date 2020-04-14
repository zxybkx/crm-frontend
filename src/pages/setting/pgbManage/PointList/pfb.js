import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Button, Divider, Popconfirm, message } from 'antd';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import styles from './pfb.less';
import PageLayout from '@/layouts/PageLayout';
import PfxTable from '../components/PfxTable';

const FormItem = Form.Item;

@Form.create()
@connect((khpg) => ({
  khpg,
}))
export default class AddPgb extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pgbTypes: [],        //评估表类型
      pfbData: {},           //评分表数据
      pfxData: [],           //评分项数据
      edit: false,
    };
  }

  componentDidMount() {
    const { dispatch, location: { query: { id } } } = this.props;
    dispatch({
      type: 'khpg/getPgbType',
      payload: {
        name: 'fxpg-pgblx',
      },
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          pgbTypes: data,
        });
      }
    });

    if (id) {
      dispatch({
        type: 'khpg/editTemplate',
        payload: { id },
      }).then(({ success, data }) => {
        if (success && data) {
          this.setState({
            pfbData: data,
            pfxData: data.crmTemplateItems,
          });
        }
      });
    }
    id ? this.setState({
      breadcrumbs: [
        { icon: 'home', path: '/' },
        { label: '系统管理', path: '/setting' },
        { label: '评分表', path: '/setting/pgbManage' },
        { label: '评分列表修改' },

      ],
    }) : this.setState({
      breadcrumbs: [
        { icon: 'home', path: '/' },
        { label: '系统管理', path: '/setting' },
        { label: '评分表', path: '/setting/pgbManage' },
        { label: '评分列表新增' },
      ],
    });
  }

  //新增分类-确定回调
  handleTypeOk = () => {
    const { pfxData, edit } = this.state;
    const { form: { validateFields } } = this.props;
    let total = 0;
    pfxData && pfxData.map(item => {
      if (item.item && item.item.zf) {
        total = total + item.item.zf;
      }
    });

    validateFields((errs, fields) => {
      if (errs) return;
      const _pfxData = _.cloneDeepWith(pfxData);
      if (edit) {
        message.warning('请先完成当前分类操作');
      } else {
        if (total === 100) {
          message.warning('总分已到达100');
        } else {
          const item = {
            groupby: '',
          };
          _pfxData.push(item);
          this.setState({
            pfxData: _pfxData,
            edit: true,
          });
        }
      }
    });
  };

  changeData = (data) => {
    this.setState({
      pfxData: data,
    });
  };

  changeEdit = (value) => {
    this.setState({
      edit: value,
    });
  };

  //删除整个类型
  onDeleteType = (groupby) => {
    const { pfxData } = this.state;
    const _pfxData = _.cloneDeep(pfxData);
    _.remove(_pfxData, item => item.groupby === groupby);
    this.setState({
      edit: false,
      pfxData: _pfxData,
    });
  };

  save = () => {
    const { form: { validateFields }, location: { query: { id } }, dispatch } = this.props;
    const { pfxData, pfbData } = this.state;
    const _pfxData = _.cloneDeep(pfxData);
    _pfxData && _pfxData.map(item => {
      item.item = JSON.stringify(item.items);
      item.id.indexOf('-') > -1 && delete item.id;
    });
    validateFields((errs, fields) => {
      if (errs) return;
      const payload = {
        cnName: fields['name'],
        enName: 'lsfx',
        crmTemplateItems: _pfxData,
      };
      if (id) {
        //  修改
        dispatch({
          type: 'khpg/editSave',
          payload: {
            ...pfbData,
            ...payload,
          },
        }).then(({ success, data }) => {
          if (success && data) {
            dispatch(
              routerRedux.push({
                pathname: '/setting/pgbManage/PointList/pfbmb',
                query: {
                  id: data.id,
                },
              }),
            );
          } else {
            message.error('保存失败');
          }
        });
      } else {
        //  新增
        dispatch({
          type: 'khpg/addTemplate',
          payload: payload,
        }).then(({ success, data }) => {
          if (success && data) {
            dispatch(
              routerRedux.push({
                pathname: '/setting/pgbManage/PointList/pfbmb',
                query: {
                  id: data.id,
                },
              }),
            );
          } else {
            message.error('保存失败');
          }
        });
      }
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

  render() {
    const { form: { getFieldDecorator }, location: { query: { id } } } = this.props;
    const { breadcrumbs, pfxData, pfbData } = this.state;
    const _pfxData = _.groupBy(pfxData, 'groupby');
    let index = 0;
    let total = 0;
    pfxData && pfxData.map(item => {
      if (item.items && item.items.zf) {
        total = this.accAdd(total, _.toNumber(item.items.zf));
      }
    });
    const pfx = {
      changeData: this.changeData,
      changeEdit: this.changeEdit,
      pfxData,
      total,
      id,
    };

    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.addDiv}>
          <Row>
            <Col span={12}>
              <FormItem label={'评估表名称：'} labelCol={{ span: 6 }} wrapperCol={{ span: 6 }}>
                {getFieldDecorator('name', {
                  initialValue: pfbData && pfbData.cnName,
                  rules: [{ required: true, message: '请输入评估表名称' }],
                })(
                  <Input placeholder="请输入评估表名称" allowClear/>,
                )}
              </FormItem>
            </Col>
          </Row>
          {
            _.map(_pfxData, (v, k) => {
              index = index + 1;
              return (
                <div key={index}>
                  <div style={{ padding: '0 10px 0 10px' }}>
                    <Divider style={{ marginBottom: '10px' }}/>
                  </div>
                  <Row>
                    <Col span={2} offset={2} className={styles.contentTitle}>
                      <span>{`评分类型${index}`}</span>
                    </Col>
                    <Col span={2}>
                      <Popconfirm title="确定要删除该类型吗？" onConfirm={() => {
                        this.onDeleteType(k);
                      }} okText="是" cancelText="否">
                        <a type='primary'>删除</a>
                      </Popconfirm>
                    </Col>
                  </Row>
                  <PfxTable {...pfx} k={k} v={v} idx={index}/>
                </div>
              );
            })
          }
          <Row style={{ marginTop: 10 }}>
            <Col span={15} offset={3}>
              <p>总计<span style={{ fontSize: 18, color: '#0EC352' }}>{total}</span>分<span
                style={{ fontSize: 14, color: '#666666' }}>（100分制，请平衡分数值）</span></p>
            </Col>
          </Row>
          <Row style={{ marginTop: 10 }}>
            <Col span={15} offset={3}>
              <Button type='primary'
                      icon="plus"
                      onClick={this.handleTypeOk}
                      style={{ marginBottom: 10 }}
                      ghost>
                新增评分类型
              </Button>
            </Col>
          </Row>
          <Divider/>
          <div className={styles.btnGroup}>
            <Button
              size="small"
              className={styles.btn}
              icon="save"
              type={'primary'}
              onClick={() => this.save()}>
              保存
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }
}
