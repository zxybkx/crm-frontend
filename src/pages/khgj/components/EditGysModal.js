import React, {PureComponent} from 'react';
import {Input, Modal, Form, Row, Col, Button} from 'antd';

const FormItem = Form.Item;
@Form.create()

export default class EditGys extends PureComponent {

  handleOk = () => {
    const {validateFields, resetFields} = this.props.form;
    const {record, sddcId} = this.props;
    validateFields((err, values) => {
      if (err) return;
      _.set(values, 'id', record.id);
      _.set(values, 'sddcId', sddcId);
      this.props.edit && this.props.edit(values);
      resetFields();
    });
  };

  render() {
    const {onCancel, visible, title, record} = this.props;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 16},
    };

    return (
      <Modal title={title}
             visible={visible}
             maskClosable={false}
             onCancel={onCancel}
             footer={[
               <Button size='small' type='primary' onClick={this.handleOk}>确定</Button>,
               <Button size='small' onClick={onCancel}>取消</Button>
             ]}>
        <Form>
          <Row>
            <Col span={24}>
              <FormItem label="供应商名称" {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: record && record.name,
                })(
                  <Input placeholder={`供应商名称`}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label='供应产品' {...formItemLayout}>
                {getFieldDecorator('gycp', {
                  initialValue: record && record.gycp,
                })(
                  <Input placeholder={`供应产品`}/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label='产品单价' {...formItemLayout}>
                {getFieldDecorator('cpdj', {
                  initialValue: record && record.cpdj,
                  rules: [{
                    pattern: new RegExp(/^[0-9]*(\.\d+)?$/),
                    message: '请输入正确的销售价格'
                  }],
                })(
                  <Input placeholder={`产品单价`} addonAfter={'元'}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label='供应商经营资质及隐性风险核查' {...formItemLayout}>
                {getFieldDecorator('zzfx', {
                  initialValue: record && record.zzfx,
                })(
                  <Input placeholder={`供应商经营资质及隐性风险核查`}/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label='符合程度' {...formItemLayout}>
                {getFieldDecorator('fhcd', {
                  initialValue: record && record.fhcd,
                })(
                  <Input placeholder={`符合程度`}/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label='参保人数' {...formItemLayout}>
                {getFieldDecorator('cbrs', {
                  initialValue: record && record.cbrs,
                  rules: [{
                    required: true,
                    pattern: new RegExp(/^\d*$/),
                    message: '请输入正确的参保人数',
                  }],
                })(
                  <Input placeholder={`参保人数`}/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label='行政处罚和法律诉讼' {...formItemLayout}>
                {getFieldDecorator('cfss', {
                  initialValue: record && record.cfss,
                })(
                  <Input placeholder={`行政处罚和法律诉讼`}/>,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}
