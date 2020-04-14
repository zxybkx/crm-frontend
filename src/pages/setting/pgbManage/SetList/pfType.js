import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Button, Radio, Popconfirm, message } from 'antd';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import PageLayout from '@/layouts/PageLayout';
import PfbModal from '../components/PfbModal';

const FormItem = Form.Item;
const {Group: Group} = Radio;
const {TextArea} = Input;
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
      visible: false,
      payTypeIsYfk: true,           //付款类型是预付款
    };
  }

  componentDidMount() {
    const { dispatch, location: { query: { id } } } = this.props;

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
        { label: '配置列表修改' },

      ],
    }) : this.setState({
      breadcrumbs: [
        { icon: 'home', path: '/' },
        { label: '系统管理', path: '/setting' },
        { label: '评分表', path: '/setting/pgbManage' },
        { label: '配置列表新增' },
      ],
    });

    // 判断付款类型，改变状态
  }

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

  relatedPfb = () => {
    this.setState({
      visible: true
    })
  };

  handleOk = () => {
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  payTypeChange = (e) => {
    if(e.target.value === '后付款') {
      this.setState({
        payTypeIsYfk: false
      })
    }else {
      this.setState({
        payTypeIsYfk: true
      })
    }
  };

  render() {
    const { form: { getFieldDecorator }, location: { query: { id } } } = this.props;
    const { breadcrumbs, visible, payTypeIsYfk } = this.state;
    const formItemLayout = {
      labelCol: {span: 10},
      wrapperCol: {span: 14}
    };

    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.addDiv}>
          <Form style={{paddingTop: 10}}>
            <Row>
              <Col span={24}>
                <FormItem label='客户类型'  {...formItemLayout}>
                  {
                    getFieldDecorator('khlx',{
                      initialValue: '供应商类'
                    })(
                      <Group>
                        <Radio value='供应商类'>供应商类</Radio>
                        <Radio value='客户类'>客户类</Radio>
                        <Radio value='其他（如招标）'>其他（如招标）</Radio>
                      </Group>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label='业务类型' {...formItemLayout}>
                  {
                    getFieldDecorator('ywlx',{
                      initialValue: '进口'
                    })(
                      <Group>
                        <Radio value='进口'>进口</Radio>
                        <Radio value='出口'>出口</Radio>
                        <Radio value='内贸'>内贸</Radio>
                      </Group>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label='业务范围' {...formItemLayout}>
                  {
                    getFieldDecorator('ywfw',{
                      initialValue: '国内'
                    })(
                      <Group>
                        <Radio value='国内'>国内</Radio>
                        <Radio value='国外'>国外</Radio>
                      </Group>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label='付款类型' {...formItemLayout}>
                  {
                    getFieldDecorator('fklx',{
                      initialValue: '预付款'
                    })(
                      <Group onChange={this.payTypeChange}>
                        <Radio value='预付款'>预付款</Radio>
                        <Radio value='后付款'>后付款</Radio>
                      </Group>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            {
              payTypeIsYfk ?
                <Row>
                  <Col span={24}>
                    <FormItem label='评分算法' {...formItemLayout}>
                      {
                        getFieldDecorator('pfsf',{
                          initialValue: '1'
                        })(
                          <Group>
                            <Radio value='1'>无</Radio>
                            <Radio value='2'>表1值*表2值再开方</Radio>
                          </Group>
                        )
                      }
                    </FormItem>
                  </Col>
                </Row> : null
            }
            <Row>
              <Col span={24}>
                <FormItem label='备注' labelCol={{span: 10}} wrapperCol={{span: 5}}>
                  {
                    getFieldDecorator('khlx',{
                      initialValue: ''
                    })(
                      <TextArea rows={3}/>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} offset={9}>
                <a onClick={this.relatedPfb}>关联评分表</a>
              </Col>
            </Row>
          </Form>
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
        <PfbModal visible={visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}/>
      </PageLayout>
    );
  }
}
