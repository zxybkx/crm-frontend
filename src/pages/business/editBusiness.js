import React, { PureComponent } from 'react';
import { Card, Row, Col, Divider, Form, Select, Input, DatePicker, Icon, Popconfirm, message, Button } from 'antd';
import LineWrap from '@/components/LineWrap';
import PageLayout from '@/layouts/PageLayout';
import GenHexBGColorAvatar from '@/components/GenHexBGColorAvatar';
import { OrganizationSelect, session, UserSelector } from 'casic-common';
import GlcpTable from './components/GlcpTable';
import GjjlTable from './components/GjjlTable';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'casic-common';
import styles from './index.less';
import _ from 'lodash';

const breadcrumbs = [
  { icon: 'home', path: '/' },
  { label: '商机管理', path: '/business' },
  { label: '查看商机' },
];
const Option = Select.Option;
const { Item: FormItem } = Form;
const TextArea = Input.TextArea;
@Form.create()
@connect((state) => ({
  business: state.business,
}))
export default class EditBusiness extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      cpData: [],
      gjjlData: [],
      lxrData: [],
      sjzt: [],                  //商机状态
      data: {},
      tableEdit: false,
    };
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.loadData();
    //商机状态
    dispatch({
      type: 'business/categories',
      payload: {
        name: 'sj-zt',
      },
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          sjzt: data,
        });
      }
    });
  }

  loadData = () => {
    const { dispatch, location: { query: { id } } } = this.props;
    //商机数据
    dispatch({
      type: 'business/getBusinessData',
      payload: id,
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          data,
          cpData: data.productdtoList,
          gjjlData: data.followdtoList,
          lxrData: data.crmCustomerLxrdtos,
        });
      } else {
        message.error('数据获取失败！');
      }
    });
  };

  editInfo = () => {
    this.setState({
      edit: true,
    });
  };

  onCancel = () => {
    this.setState({
      edit: false,
    });
  };

  disabledDate = (current) => {
    return current && current < moment().startOf('day');
  };

  renderForm = () => {
    const { form: { getFieldDecorator } } = this.props;
    const { edit, sjzt, data } = this.state;
    const sjsyr = [{
      'username': data.sjsyr,
      'label': data.sjsyr,
      'name': data.sjsyr,
      'key': data.id,
    }];

    const sjsyrdw = [{
      label: data.sjsyrdw && data.sjsyrdw.split('-')[0],
      value: data.sjsyrdw && data.sjsyrdw.split('-')[1],
    }];
    const zt = data.sjzt && _.find(sjzt, item => item.useName === data.sjzt);
    return (
      <Form>
        <Row>
          <Col span={8}>
            <FormItem label="客户名称" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
              {
                getFieldDecorator('customerId', {
                  initialValue: data.crmCustomerdto && data.crmCustomerdto.khmc,
                })(
                  <span>
                    {data.crmCustomerdto && data.crmCustomerdto.khmc}
                  </span>,
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="结束时间" labelCol={{ span: 10 }} wrapperCol={{ span: 10 }}>
              {getFieldDecorator('jsrq', {
                initialValue: data.jsrq && moment(data.jsrq) || moment(),
              })(
                edit ? <DatePicker disabledDate={this.disabledDate} getCalendarContainer={triggerNode => triggerNode.parentNode}/> :
                  <span>{data.jsrq ? moment(data.jsrq).format('YYYY-MM-DD') : '无'}</span>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="预计金额(元)" labelCol={{ span: 11 }} wrapperCol={{ span: 10 }}>
              {getFieldDecorator('yjje', {
                initialValue: data.yjje && data.yjje,
                rules: [
                  {
                    pattern: new RegExp(/^([0-9]{1,10}(\.\d{1,2})?)$/),
                    message: '请输入正确的预计金额',
                  },
                ],
              })(
                edit ? <Input placeholder="预计金额"/> : <span>{data.yjje && data.yjje || '无'}</span>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem label="商机创建人" labelCol={{ span: 9 }} wrapperCol={{ span: 10 }}>
              <span>{data.createdName && data.createdName}</span>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="创建人单位" labelCol={{ span: 10 }} wrapperCol={{ span: 10 }}>
              {
                getFieldDecorator('sjcjrdw', {
                  initialValue: data.sjcjrdw && data.sjcjrdw,
                })(
                  <span>{data.sjcjrdw && data.sjcjrdw}</span>,
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="商机状态" labelCol={{ span: 11 }} wrapperCol={{ span: 10 }}>
              {getFieldDecorator('sjzt', {
                initialValue: data.sjzt && data.sjzt,
              })(
                edit ?
                  <Select style={{ width: '100%' }} placeholder="商机状态" getPopupContainer={triggerNode => triggerNode.parentElement}>
                    {sjzt && sjzt.map((o, i) => {
                      return (
                        <Option key={o.useName}>{o.name}</Option>
                      );
                    })}
                  </Select> : <span>{zt && zt.name || '无'}</span>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem label="商机所有人" labelCol={{ span: 9 }} wrapperCol={{ span: 10 }}>
              {getFieldDecorator('sjsyr', {
                initialValue: sjsyr && sjsyr,
              })(
                edit ? <UserSelector clearable/> : <span>{data.sjsyr && data.sjsyr || session.get().name}</span>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="所有人单位" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
              {
                getFieldDecorator('sjsyrdw', {
                  initialValue: sjsyrdw,
                })(
                  edit ? <OrganizationSelect multiple={false} labelInValue/> :
                    <LineWrap title={data.sjsyrdw && data.sjsyrdw.split('-')[0]}
                              lineClampNum={1}/>,
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem label="说明" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
              {getFieldDecorator('remark', {
                initialValue: data.remark && data.remark,
              })(
                edit ? <TextArea row={3} placeholder="说明"/> : <span>{data.remark && data.remark || '无'}</span>,
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  changeGlcpData = (data) => {
    this.setState({
      cpData: data,
    });
  };

  changeGjjlData = (data) => {
    this.setState({
      gjjlData: data,
    });
  };

  changeEditState = (value) => {
    this.setState({
      tableEdit: value,
    });
  };

  renderInfoTopRight = () => {
    const { edit } = this.state;
    if (edit) {
      return (
        <div>
          <Link onClick={() => {
            this.onSave();
          }} icon='save'>保存</Link>
          <Divider type='vertical'/>
          <Popconfirm title="确认取消吗？" onConfirm={() => this.onCancel()} okText="是" cancelText="否">
            <Link icon='close-circle' type='danger'>取消</Link>
          </Popconfirm>
        </div>
      );
    } else {
      return (
        <span>
            <Link onClick={() => {
              this.editInfo();
            }} icon='edit'>修改</Link>
          </span>
      );
    }
  };

  onSave = () => {
    const { form: { validateFields }, dispatch, location: { query: { id } } } = this.props;
    const { data } = this.state;
    validateFields((errs, fields) => {
      let dwmc = [];
      fields.sjsyrdw && fields.sjsyrdw.map(item => {
        _.forEach(item, (v, k) => {
          dwmc.push(v);
        });
      });

      dispatch({
        type: 'business/saveBasicInfo',
        payload: {
          ...fields,
          sjcjrdw: session.get().orgName,
          sjsyrdw: _.join(dwmc, '-'),
          sjsyr: fields.sjsyr && fields.sjsyr[0].name,
          sjmc: data.sjmc,
          id,
          customerId: data.customerId,
        },
      }).then(({ success, data }) => {
        this.setState({
          edit: false,
          tableEdit: false
        });
        if (success && data) {
          message.success('保存成功');
          this.loadData();
        } else {
          message.error('保存失败！');
        }
      });
    });
  };

  render() {
    const { location: { query: { id } } } = this.props;
    const { cpData, gjjlData, lxrData, sjzt, data, tableEdit } = this.state;
    const glcp = {
      cpData,
      tableEdit,
      loadData: this.loadData,
      businessId: id,
      changeGlcpData: this.changeGlcpData,
      changeEditState: this.changeEditState,
    };
    const gjjl = {
      gjjlData,
      tableEdit,
      businessId: id,
      loadData: this.loadData,
      changeGjjlData: this.changeGjjlData,
      sjzt,
      changeEditState: this.changeEditState,
    };
    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.container}>
          <div className={styles.contain}>
            <div>
              <span className={styles.gsmc}>商机名称：{data.sjmc}</span>
            </div>
            <Divider style={{ margin: '10px 0' }}/>
            <Row gutter={{ md: 25, lg: 25, xl: 25 }}>
              <Col span={17} className={styles.left}>
                <Row>
                  <Col xl={24} lg={24} md={24} sm={24}>
                    <Card size="small" title="基础资料"
                          extra={this.renderInfoTopRight()}>
                      {this.renderForm()}
                    </Card>
                  </Col>
                </Row>
                <GlcpTable {...glcp}/>
                <GjjlTable {...gjjl}/>
              </Col>
              <Col span={7}>
                <Row>
                  <Col xl={24} lg={24} md={24} sm={24}>
                    <Card size="small">
                      <div>
                        <Icon type="phone" style={{ color: '#1890ff', transform: 'rotate(90deg)' }}/>
                        <span style={{ fontWeight: 'bold', marginLeft: 10 }}>联系人</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </div>
                      <Divider style={{ margin: '10px 0' }}/>
                      {
                        !_.isEmpty(lxrData) ? lxrData.map((item, i) => {
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
              </Col>
            </Row>
          </div>
        </div>
      </PageLayout>
    );
  }
}
