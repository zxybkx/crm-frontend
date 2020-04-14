import React, { PureComponent } from 'react';
import { Form, Select, Input, Row, Col, DatePicker, Button, message, Modal, Collapse, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import Product from './Product';
import Qygys from'./Qygys';
import styles from '../../khgj/components/Jbxx.less';
import { UserSelector } from 'casic-common';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const { Panel } = Collapse;
const { Group } = Radio;

@Form.create()
@connect(state => ({
  customer: state.customer,
  khgj: state.khgj,
}))

export default class Sddc extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      khxx: [],
      jcxxId: '',
      edit: false,
      productData: [],
      gysData: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'khgj/getCustomersList',
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          khxx: data,
        });
      }
    });
  }

  handleOk = () => {
    const { form: { validateFields, resetFields } } = this.props;
    validateFields((err, values) => {
      if (err) return;
      this.props.sddcOk && this.props.sddcOk(values);
      resetFields();
    });
  };

  handleCancel = () => {
    const { form: { resetFields } } = this.props;
    this.setState({
      jcxxId: ''
    });
    this.props.onCancel();
    resetFields();
  };

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  onSave = () => {
    const { dispatch, form: { validateFields } } = this.props;
    const { jcxxId, productData, gysData } = this.state;

    validateFields((errs, fields) => {
      if (errs) return;
      if (_.isEmpty(jcxxId)) {
        // 基础信息保存
        //拜访人员
        let bfryArr = [];
        fields.bfry && fields.bfry.map(o => {
          let bfryObj = {};
          _.set(bfryObj, 'type', 1);
          _.set(bfryObj, 'userName', o.name);
          bfryArr.push(bfryObj);
        });

        //接待人员
        let jdryArr = [];
        fields.jdry && fields.jdry.map(o => {
          let jdryObj = {};
          _.set(jdryObj, 'type', 2);
          _.set(jdryObj, 'userName', o);
          jdryArr.push(jdryObj);
        });

        //重要人员
        const zyry = {
          type: 3,
          userName: fields['zyry'],
          zw: fields['zw'],
          lxdh: fields['dh'],
        };
        const payload = {
          customerId: fields['customerId'],
          gjrq: fields['bfsj'],
          khsy: fields['khsy'],
          khxy: fields['khxy'],
          type: '2',
          crmKhgjRies: [
            zyry, ...jdryArr, ...bfryArr,
          ],
        };
        dispatch({
          type: `khgj/saveAddRcgj`,
          payload: payload,
        }).then(({ success, data }) => {
          if (success && data) {
            message.success('保存成功');
            this.setState({
              jcxxId: data.id,
            });
          }
        });
      } else {
        const {dispatch} = this.props;
        dispatch({
          type: 'khgj/saveSddcOntherModal',
          payload: {
            crmSddcGscpdtos: productData,
            crmSddcQygysdtos: gysData,
            crmSddcSccwdtos: fields,
            sddcId: jcxxId
          }
        });
        this.handleCancel();
        this.props.loadData();
      }
    });
  };

  changeEdit = (value) => {
    this.setState({
      edit: value,
    });
  };

  changeProductData = (data) => {
    this.setState({
      productData: data,
    });
  };

  changeGysData = (data) => {
    this.setState({
      gysData: data
    })
  };

  render() {
    const { visible, title, form: { getFieldDecorator }, id } = this.props;
    const { khxx, jcxxId, edit, productData, gysData } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };
    return (
      <Modal title={title}
             visible={visible}
             maskClosable={false}
             width={'60%'}
             onCancel={this.handleCancel}
             footer={[
               <Button size='small' onClick={this.handleCancel}>取消</Button>,
             ]}>
        {
          _.isEmpty(jcxxId) ?
            <Form {...formItemLayout} style={{ display: _.isEmpty(jcxxId) ? 'block' : 'none' }}>
              <FormItem label={'客户名称'} className={styles.inputBtm}>
                {getFieldDecorator('customerId', {
                  initialValue: id,
                })(
                  <Select style={{ width: '100%' }}
                          disabled
                          getPopupContainer={triggerNode => triggerNode.parentElement}>
                    {
                      khxx && khxx.map((item) => {
                        return (
                          <Option key={item.id}>{item.khmc}</Option>
                        );
                      })
                    }
                  </Select>,
                )}
              </FormItem>
              <FormItem label={'拜访时间'} className={styles.inputBtm}>
                {getFieldDecorator('bfsj', {
                  initialValue: moment(),
                })(
                  <DatePicker style={{ width: '100%' }} disabledDate={this.disabledDate}/>,
                )}
              </FormItem>
              <FormItem label={'拜访人员'} className={styles.inputBtm}>
                {getFieldDecorator('bfry', {})(
                  <UserSelector multiple clearable/>,
                )}
              </FormItem>
              <FormItem label={'接待人员'} className={styles.inputBtm}>
                {getFieldDecorator('jdry', {})(
                  <Select mode="tags" style={{ width: '100%' }}
                          getPopupContainer={triggerNode => triggerNode.parentElement}/>,
                )}
              </FormItem>
              <FormItem label={'重要人员'} className={styles.inputBtm}>
                {getFieldDecorator('zyry', {})(
                  <Input/>,
                )}
              </FormItem>
              <FormItem label={'职务'} className={styles.inputBtm}>
                {getFieldDecorator('zw', {})(
                  <Input/>,
                )}
              </FormItem>
              <FormItem label={'电话'} className={styles.inputBtm}>
                {getFieldDecorator('dh', {})(
                  <Input/>,
                )}
              </FormItem>
              <FormItem label={'客户上游'} className={styles.inputBtm}>
                {getFieldDecorator('khsy', {})(
                  <TextArea placeholder="客户上游"/>,
                )}
              </FormItem>
              <FormItem label={'客户下游'} className={styles.inputBtm}>
                {getFieldDecorator('khxy', {})(
                  <TextArea placeholder="客户下游"/>,
                )}
              </FormItem>
            </Form> :
            <Collapse defaultActiveKey='1'>
              <Panel header={'公司产品'} key={'1'}>
                <Product
                  edit={edit}
                  productData={productData}
                  changeProductData={this.changeProductData}
                  changeEdit={this.changeEdit}/>
              </Panel>
              <Panel header={'公司生产及财务'} key={'2'}>
                <Row>
                  <Col span={8}>
                    <FormItem label="生产线" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('scx', {})(
                          <Input placeholder="生产线"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="月均产能" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('yjcn', {})(
                          <Input placeholder="月均产能"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="年产值" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('ncz', {})(
                          <Input placeholder="年产值" addonAfter={'万元'}/>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="采购周期" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('cgzq', {})(
                          <Input placeholder="采购下单至物料入库" addonAfter={'天'}/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="外发加工情况" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('wfjgqk', {})(
                          <Input placeholder="外发加工情况"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="生产周期" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('sczq', {})(
                          <Input placeholder="物料出库至产品入库" addonAfter={'天'}/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="销售周期" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('xszq', {})(
                          <Input placeholder="产品出库至销售回款" addonAfter={'天'}/>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="公司水电费情况(年)" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('gssdf', {})(
                          <Input placeholder="公司水电费情况"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="财务人员情况" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('cwry', {})(
                          <Input placeholder="财务人员情况"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="是否处理过函调" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('hd', {})(
                          <Group>
                            <Radio value="是">是</Radio>
                            <Radio value="否">否</Radio>
                          </Group>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="对供应商的管理" labelCol={{span: 12}} wrapperCol={{span: 12}}>
                      {
                        getFieldDecorator('gysgl', {})(
                          <Input placeholder="对供应商的管理"/>
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="与主管税局的交流" labelCol={{span: 12}} wrapperCol={{span: 12}}>
                      {
                        getFieldDecorator('sjjl', {})(
                          <Input placeholder="与主管税局的交流"/>
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="其他财务情况" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('qt', {})(
                          <Input placeholder="其他财务情况"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
              </Panel>
              <Panel header={'企业供应商'} key={'3'}>
                <Qygys
                  edit={edit}
                  gysData={gysData}
                  changeGysData={this.changeGysData}
                  changeEdit={this.changeEdit}/>
              </Panel>
            </Collapse>
        }
        <div className={styles.btnGroup}>
          <Button
            icon="save"
            type='primary'
            onClick={() => {
              this.onSave();
            }}
            size="small"
          >
            保存
          </Button>
        </div>
      </Modal>
    );
  }
}
