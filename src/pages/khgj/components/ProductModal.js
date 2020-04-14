import React, { PureComponent } from 'react';
import { Input, Modal, Form, Row, Col, Button } from 'antd';
import uuidV4 from 'uuid/v4';

const FormItem = Form.Item;
@Form.create()

export default class AddShareholder extends PureComponent {

  handleOk = () => {
    const { validateFields, resetFields} = this.props.form;
    const {sddcId} = this.props;
    const itemId = uuidV4();
    validateFields((err, values) => {
      if (err) return;
      _.set(values, 'id', itemId);
      _.set(values, 'sddcId', sddcId);
      this.props.addCp && this.props.addCp(values);
      resetFields();
    });
  };

  render() {
    const { onCancel, visible, title } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    return (
      <Modal title={title}
             visible={visible}
             maskClosable={false}
             onCancel={onCancel}
             footer={[
               <Button size='small' type='primary' onClick={this.handleOk}>确定</Button>,
               <Button size='small' onClick={onCancel}>取消</Button>,
             ]}>
        <Form>
          <Row>
            <Col span={24}>
              <FormItem label="产品类别" {...formItemLayout}>
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请输入产品类别' }],
                })(
                  <Input placeholder={`产品类别`}/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label='产品名称' {...formItemLayout}>
                {getFieldDecorator('name', {
                  rules: [{required: true, message: '请输入产品名称'}],
                })(
                  <Input placeholder={`产品名称`}/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label='销售价格' {...formItemLayout}>
                {getFieldDecorator('xsjg', {
                  rules: [{
                    required: true,
                    pattern: new RegExp(/^[0-9]*(\.\d+)?$/),
                    message: '请输入正确的销售价格'
                  }],
                })(
                  <Input placeholder={`销售价格`} addonAfter={'元'}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label='产品毛利' {...formItemLayout}>
                {getFieldDecorator('cpml', {
                  rules: [{
                    required: true,
                    pattern: new RegExp(/^[0-9]{1,3}(\.\d+)?$/),
                    message: '请输入正确的产品毛利',
                  }],
                })(
                  <Input placeholder={`产品毛利`} addonAfter={'%'}/>,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
