import React, {PureComponent}  from 'react';
import {Button, Form, Row, Col, Collapse} from 'antd';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import moment from 'moment';
import PageLayout from '@/layouts/PageLayout';
import _ from 'lodash';
import styles from '../index.less';

const {Panel} = Collapse;
const FormItem = Form.Item;

@Form.create()
@connect((khpg) => ({
  khpg
}))

export default class Zzxx extends PureComponent {
  constructor(props) {
    super(props);
    const {location: {query: {btnName}}} = this.props;
    this.state = {
      data: {},
      visible: false,
      btnName: btnName,
      modify: false,
    }
  }

  componentDidMount() {
    const {dispatch, location: {query: {id}}} = this.props;
    //查看
    dispatch({
      type: 'khpg/getKhzzData',
      payload: {id: id}
    }).then(({success, data}) => {
      if (success && data) {
        this.setState({
          data: data
        })
      }
    })
  };

  renderForm = (id, index) => {
    const {form: {getFieldDecorator}} = this.props;
    const {data} = this.state;
    const dateFormat = 'YYYY-MM-DD';
    const initialValue = _.find(data.crmKhzzItemdtos, o => {
      return o.itemId === id
    });
    const fjInitialValue = initialValue && initialValue.fileList;
    let _fjInitialValue = [];
    fjInitialValue && fjInitialValue.map((item) => {
      let _item = {};
      _.set(_item, 'id', item.fileId);
      _.set(_item, 'name', item.fileName);
      _.set(_item, 'url', `/gateway/fileservice/api/file/view/${item.fileId}`);
      _fjInitialValue.push(_item);
    });
    return (
      <Form>
        <Row>
          <Col span={11}>
            <FormItem label="颁发日期" labelCol={{span: 8}} wrapperCol={{span: 16}}>
              {
                getFieldDecorator(id ? `bfrq-${id}` : `bfrq-${index}`, {
                  initialValue: initialValue.bfrq && moment(initialValue.bfrq, dateFormat),
                })(
                  <span>{initialValue.bfrq ? moment(initialValue.bfrq).format('YYYY-MM-DD') : ''}</span>
                )
              }
            </FormItem>
          </Col>
          <Col span={11}>
            <FormItem label="有效截止日期" labelCol={{span: 8}} wrapperCol={{span: 16}}>
              {
                getFieldDecorator(id ? `yxjzrq-${id}` : `yxjzrq-${index}`, {
                  initialValue: initialValue.yxjzrq && moment(initialValue.yxjzrq, dateFormat),
                })(
                  <span>{initialValue.yxjzrq ? moment(initialValue.yxjzrq).format('YYYY-MM-DD') : ''}</span>
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <FormItem label="资质说明" labelCol={{span: 4}} wrapperCol={{span: 20}}>
              {
                getFieldDecorator(id ? `zzsm-${id}` : `zzsm-${id}`, {
                  initialValue: initialValue.zzsm && initialValue.zzsm,
                })(
                  <span>{initialValue.zzsm && initialValue.zzsm}</span>
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <FormItem label="资质附件" labelCol={{span: 8}} wrapperCol={{span: 16}}>
              {
                getFieldDecorator(id ? `fileList-${id}` : `fileList-${index}`, {
                  initialValue: _fjInitialValue,
                })(
                  <div>
                    {_fjInitialValue.length > 0 ?
                      _fjInitialValue.map((item, i) => {
                        return (
                          <a href={item.url} key={item.id} target="_blank">
                            {item.name}
                            {i + 1 === _fjInitialValue.length ? '' : '，'}
                          </a>
                        )
                      }) : null}
                  </div>
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  };

  edit = () => {
    const {dispatch, location: {query: {id, khdm, khmc}}} = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/khpg/zzpg',
        query: {
          id: id,
          khdm: khdm,
          khmc: khmc,
          zzxx: true,
        }
      })
    )
  };

  renderSearchForm = () => {
    const {getFieldDecorator} = this.props.form;
    const {location: {query: {khmc}}} = this.props;
    const {data} = this.state;
    const dateFormat = 'YYYY-MM-DD';

    return (
      <Form layout='inline'>
        <Row>
          <Col span={8}>
            <FormItem label='客户名称：'>
              {getFieldDecorator('khmc', {
                initialValue: khmc && khmc,
              })(
                <span>{khmc && khmc}</span>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='评估时间：'>
              {getFieldDecorator('pgsj', {
                initialValue: data.pgsj && moment(this.state.data.pgsj, dateFormat),
                rules: [{required: true, message: '请选择评估时间!'}]
              })(
                <span>{data.pgsj ? moment(data.pgsj).format('YYYY-MM-DD') : ''}</span>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const {location: {query: {id}}} = this.props;
    const {data} = this.state;
    const rulesObj = _.groupBy(data.crmKhzzItemdtos, 'groupby');
    const breadcrumbs = [
      {icon: 'home', path: '/'},
      {label: '客户信息', path: '/customer'},
      {label: '客户信息详情', path: `/customer/customerDetail?id=${id}`},
      {label: '资质评估查看'}
    ];

    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.content}>
          <div className={styles.apply}>
            <Button type='primary' size={'small'} icon={'edit'} onClick={() => this.edit()}
                    style={{marginRight: '10px'}}>
              修改
            </Button>
            <div style={{marginLeft: 20}}>
              {this.renderSearchForm()}
            </div>
            {
              _.map(rulesObj, (v, k) => {
                return (
                  <div style={{margin: '10px 20px 10px 20px'}} key={k}>
                    <Collapse defaultActiveKey={data.crmKhzzItemdtos[0].groupby}>
                      <Panel header={<span style={{color: '#2fb4b1'}}>{k}</span>} key={k}>
                        {
                          v.map((o, i) => {
                            return (
                              <div key={o.itemId}>
                                <div>
                                  <Row>
                                    <Col span={22} offset={2}>
                                <span style={{fontSize: 15, color: '#2fb4b1'}}>
                                  {i + 1}{'、'}{o.itemName}
                                </span>
                                    </Col>
                                  </Row>
                                  {this.renderForm(o.itemId)}
                                </div>
                              </div>
                            )
                          })
                        }
                      </Panel>
                    </Collapse>
                  </div>
                )
              })
            }
          </div>
        </div>
      </PageLayout>
    )
  }
}
