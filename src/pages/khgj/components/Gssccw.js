/**
 * 公司生产和财务
 */
import React, {Component} from 'react'
import {Button, Input, message, Radio, Collapse, Col, Row, Form} from 'antd';
import {connect} from 'dva'
import _ from 'lodash';
import PageLayout from '@/layouts/PageLayout'
import styles from './Jbxx.less';

const {Item: FormItem} = Form;
const {Panel} = Collapse;
const {Group} = Radio;

@Form.create()
@connect(({khgj}) => ({
  khgj
}))

export default class Gssccw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: [],
      saveId: '',        //保存返回的id
    }
  }

  componentDidMount() {
    this.lodaData()
  }

  lodaData = () => {
    const {dispatch, sddcId} = this.props;
    dispatch({
      type: 'khgj/getGscwData',
      payload: {
        'sddcId.equals': sddcId
      }
    }).then(({success, data}) => {
      if (success && data) {
        this.setState({
          formData: data
        })
      }
    })
  };

  onSave() {
    const {dispatch, form: {validateFields}, sddcId, id} = this.props;
    const {saveId, formData} = this.state;
    validateFields((errs, fields) => {
      if (errs) return;
      if (id || !_.isEmpty(saveId)) {
        //修改
        const payload = _.assign(formData[0], fields);
        dispatch({
          type: 'khgj/editGscw',
          payload: {
            payload,
            sddcId: sddcId
          }
        }).then(({success, data}) => {
          if(success && data) {
            message.success('保存成功');
            this.setState({
              saveId: data.id
            }, () => {this.lodaData()});
          }
        })
      } else {
        //新增
        dispatch({
          type: 'khgj/addGscw',
          payload: {
            fields,
            sddcId: sddcId
          }
        }).then(({success, data}) => {
          if(success && data) {
            message.success('保存成功');
            this.setState({
              saveId: data.id
            }, () => {this.lodaData()});
          }
        })
      }
    });
  }

  render() {
    const {form: {getFieldDecorator}} = this.props;
    const {formData} = this.state;

    return (
      <div>
        <div className={styles.formContent}>
          <Collapse defaultActiveKey='1'>
            <Panel header="生产情况" key="1">
              <Row>
                <Col span={8}>
                  <FormItem label="生产线" labelCol={{span: 12}} wrapperCol={{span: 12}}>
                    {
                      getFieldDecorator('scx', {
                        initialValue: formData[0] && formData[0].scx,
                      })(
                        <Input placeholder="生产线"/>
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="月均产能" labelCol={{span: 12}} wrapperCol={{span: 12}}>
                    {
                      getFieldDecorator('yjcn', {
                        initialValue: formData[0] && formData[0].yjcn,
                      })(
                        <Input placeholder="月均产能"/>
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem label="年产值" labelCol={{span: 12}} wrapperCol={{span: 12}}>
                    {
                      getFieldDecorator('ncz', {
                        initialValue: formData[0] && formData[0].ncz,
                      })(
                        <Input placeholder="年产值" addonAfter={'万元'}/>
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="采购周期" labelCol={{span: 12}} wrapperCol={{span: 12}}>
                    {
                      getFieldDecorator('cgzq', {
                        initialValue: formData[0] && formData[0].cgzq,
                      })(
                        <Input placeholder="采购下单至物料入库" addonAfter={'天'}/>
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem label="外发加工情况" labelCol={{span: 12}} wrapperCol={{span: 12}}>
                    {
                      getFieldDecorator('wfjgqk', {
                        initialValue: formData[0] && formData[0].wfjgqk,
                      })(
                        <Input placeholder="外发加工情况"/>
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="生产周期" labelCol={{span: 12}} wrapperCol={{span: 12}}>
                    {
                      getFieldDecorator('sczq', {
                        initialValue: formData[0] && formData[0].sczq,
                      })(
                        <Input placeholder="物料出库至产品入库" addonAfter={'天'}/>
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem label="销售周期" labelCol={{span: 12}} wrapperCol={{span: 12}}>
                    {
                      getFieldDecorator('xszq', {
                        initialValue: formData[0] && formData[0].xszq,
                      })(
                        <Input placeholder="产品出库至销售回款" addonAfter={'天'}/>
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="公司水电费情况(年)" labelCol={{span: 12}} wrapperCol={{span: 12}}>
                    {
                      getFieldDecorator('gssdf', {
                        initialValue: formData[0] && formData[0].gssdf,
                      })(
                        <Input placeholder="公司水电费情况"/>
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
            </Panel>
            <Panel header="财务情况" key="2">
              <Row>
                <Col span={8}>
                  <FormItem label="财务人员情况" labelCol={{span: 12}} wrapperCol={{span: 12}}>
                    {
                      getFieldDecorator('cwry', {
                        initialValue: formData[0] && formData[0].cwry,
                      })(
                        <Input placeholder="财务人员情况"/>
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="是否处理过函调" labelCol={{span: 12}} wrapperCol={{span: 12}}>
                    {
                      getFieldDecorator('hd', {
                        initialValue: formData[0] && formData[0].hd,
                      })(
                        <Group>
                          <Radio value="是">是</Radio>
                          <Radio value="否">否</Radio>
                        </Group>
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem label="对供应商的管理" labelCol={{span: 12}} wrapperCol={{span: 12}}>
                    {
                      getFieldDecorator('gysgl', {
                        initialValue: formData[0] && formData[0].gysgl,
                      })(
                        <Input placeholder="对供应商的管理"/>
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="与主管税局的交流" labelCol={{span: 12}} wrapperCol={{span: 12}}>
                    {
                      getFieldDecorator('sjjl', {
                        initialValue: formData[0] && formData[0].sjjl,
                      })(
                        <Input placeholder="与主管税局的交流"/>
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem label="其他财务情况" labelCol={{span: 12}} wrapperCol={{span: 12}}>
                    {
                      getFieldDecorator('qt', {
                        initialValue: formData[0] && formData[0].qt,
                      })(
                        <Input placeholder="其他财务情况"/>
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </div>
        <aside className={styles.btnGroup}>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              this.props.changeStep(1)
            }}>
            上一页
          </Button>
          <Button
            className={styles.btn}
            type="primary"
            size="small"
            icon="save"
            onClick={() => {
              this.onSave()
            }}>
            保存
          </Button>
          <Button className={styles.btn}
                  type="primary"
                  size="small"
                  onClick={() => {
                    this.onSave();
                    this.props.changeStep(3)
                  }}>
            下一页
          </Button>
        </aside>
      </div>
    )
  }
}
