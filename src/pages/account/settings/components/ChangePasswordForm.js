import React, { PureComponent } from 'react';
import { Form, Button, Input, Col, Row, Modal } from 'antd';
import JSEncrypt from 'jsencrypt';
import PageLayout from '@/layouts/PageLayout';
import _ from 'lodash';
import { router } from 'umi';

@Form.create({
  mapPropsToFields(props) {
    return _.mapValues(props.model, (v, k) => Form.createFormField({ k, value: v }));
  },
})
export default class ChangePasswordForm extends PureComponent {

  state = {
    visible: false,
    confirmDirty: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.visible === nextProps.visible) {
      return null;
    }
    return {
      ...nextProps,
      confirmDirty: false,
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'login/pk',
    }).then(({ data }) => {
      this.publicKey = data;
    });
  }


  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  successCountDown = () => {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: '密码修改成功',
      content: `系统将于 ${secondsToGo} 秒后重新登录。`,
      okText: '立即登录',
      onOk: () => {
        clearInterval(this.timer);
        router.push('/passport/sign-in');
      },
    });
    this.timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: `系统将于 ${secondsToGo} 秒后重新登录。`,
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(this.timer);
      modal.destroy();
      router.push('/passport/sign-in');
    }, secondsToGo * 1000);
  };

  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(this.publicKey);
      values.password = encrypt.encrypt(values.password);

      dispatch({
        type: 'api/changePassword',
        payload: values,
      }).then(({ success, data }) => {
        if (success) {
          this.successCountDown();
          this.close();
        }
      });
    });
  };

  close = () => {
    this.props.onClose && this.props.onClose();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <PageLayout>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Row>
            <Col span={16}>
              <Form.Item label="新密码" hasFeedback>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '请输入新密码',
                    },
                    {
                      validator: this.validateToNextPassword,
                    },
                  ],
                })(<Input.Password/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <Form.Item label="确认新密码" hasFeedback>
                {getFieldDecorator('confirm', {
                  rules: [
                    {
                      required: true,
                      message: '请输入新密码确认!',
                    },
                    {
                      validator: this.compareToFirstPassword,
                    },
                  ],
                })(<Input.Password onBlur={this.handleConfirmBlur}/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" style={{ marginRight: 5 }}>
                  修改
                </Button>
                <Button onClick={this.close}>
                  取消
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </PageLayout>
    );
  }
}
