import React, {PureComponent} from 'react';
import {Input, Modal, Form, Row, Col, Select, Button} from 'antd';
import uuidV4 from 'uuid/v4';

const FormItem = Form.Item;
@Form.create()

export default class AddLxr extends PureComponent {

  handleOk = () => {
    const {form: {validateFields, resetFields}} = this.props;
    const itemId = uuidV4();
    validateFields((err, values) => {
      if (err) return;
      _.set(values, 'id', itemId);
      this.props.addLxr && this.props.addLxr(values);
      resetFields();
    });
  };

  onCancel = () => {
    const {form: {resetFields}} = this.props;
    this.props.onCancel();
    resetFields();
  };

  render() {
    const {visible, title} = this.props;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 16},
    };

    return (
      <Modal title={title}
             visible={visible}
             maskClosable={false}
             onCancel={this.onCancel}
             footer={[
               <Button size='small' type='primary' onClick={this.handleOk}>确定</Button>,
               <Button size='small' onClick={this.onCancel}>取消</Button>,
             ]}>
        <Form>
          <Row>
            <Col span={24}>
              <FormItem label='姓名' {...formItemLayout}>
                {getFieldDecorator('xm', {
                  rules: [{
                    required: true,
                    message: '请输入联系人姓名',
                  }],
                })(
                  <Input placeholder={`姓名`}/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label='职务' {...formItemLayout}>
                {getFieldDecorator('zw', {})(
                  <Input placeholder={`职务`}/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label='联系电话' {...formItemLayout}>
                {getFieldDecorator('lxdh', {
                  // rules: [{
                  //   message: '请输入正确的联系电话',
                  //   pattern: new RegExp(/^[0-9~!！$@#￥%^&*]+$/),
                  // }],
                })(
                  <Input placeholder={`联系电话`}/>,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
