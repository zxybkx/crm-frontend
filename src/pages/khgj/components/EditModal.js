import React, {PureComponent} from 'react';
import {Input, Modal, Form, Row, Col, Select, Button} from 'antd';

const FormItem = Form.Item;
@Form.create()

export default class EditShareholder extends PureComponent {

  handleOk = () => {
    const {validateFields, resetFields} = this.props.form;
    const {record, sddcId} = this.props;
    validateFields((err, values) => {
      if (err) return;
      _.set(values, 'id', record.id);
      _.set(values, 'sddcId', sddcId);
      this.props.editCp && this.props.editCp(values);
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
             onCancel={onCancel}
             footer={[
               <Button size='small' type='primary' onClick={this.handleOk}>确定</Button>,
               <Button size='small' onClick={onCancel}>取消</Button>
             ]}>
        <Form>
          <Row>
            <Col span={24}>
              <FormItem label="产品类别" {...formItemLayout}>
                {getFieldDecorator('type', {
                  initialValue: record && record.type,
                  rules: [{required: true, message: '请输入产品类别'}],
                })(
                  <Input placeholder={`产品类别`}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label='产品名称' {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: record && record.name,
                  rules: [{required: true, message: '请输入产品名称'}],
                })(
                  <Input placeholder={`产品名称`}/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label='销售价格(元)' {...formItemLayout}>
                {getFieldDecorator('xsjg', {
                  initialValue: record && record.xsjg,
                  rules: [{
                    required: true,
                    pattern: new RegExp(/^[0-9]*(\.\d+)?$/),
                    message: '请输入正确的销售价格'
                  }],
                })(
                  <Input placeholder={`销售价格`}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label='产品毛利(%)' {...formItemLayout}>
                {getFieldDecorator('cpml', {
                  initialValue: record && record.cpml,
                  rules: [{
                    required: true,
                    pattern: new RegExp(/^[0-9]{1,3}(\.\d+)?$/),
                    message: '请输入正确的产品毛利',
                  }],
                })(
                  <Input placeholder={`产品毛利`}/>,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}
