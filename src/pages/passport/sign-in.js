import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Icon, Checkbox, Alert } from 'antd';
import JSEncrypt from 'jsencrypt';
import {session as Session, store} from 'casic-common';
import styles from './sign-in.less';
import jwt from 'jsonwebtoken';
import { reloadAuthorized } from 'casic-common/src/utils/Authorized';

// const crypto = require('crypto');

const FormItem = Form.Item;

const SESSION_STORE = '__casic_last_login_user';

const localUser = store.get(SESSION_STORE);

@connect(({ login }) => ({
  login: login,
}))
@Form.create()
export default class SignIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      normalLogin: true,
      treeData: [],
      department: (localUser && localUser.department) || undefined,
      expandKeys: [],
      submitting: false,
      status: 'ok',
    };
    this.publicKey = null;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/pk',
    }).then(({ data }) => {
      this.publicKey = data;
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, location: { query }  } = this.props;
    this.props.form.validateFields({ force: true },
      (err, data) => {
        if (!err) {
          store.add(SESSION_STORE, {
            department: data.department,
            username: data.username,
            parentCode: data.parentCode,
          });

          //md5
          // data.password = crypto.createHash('md5').update(data.password).digest('hex');

          const encrypt = new JSEncrypt();
          encrypt.setPublicKey(this.publicKey);
          data.password = encrypt.encrypt(data.password);
          let status;
          dispatch({
            type: `login/login`,
            payload: data,
          }).then(({ success, data }) => {
            let user = {};
            if (success && data && data.id_token) {
              if (data.id_token === 'ERROR') {
                status = 'error';
              } else {
                status = 'ok';
                const decoded = jwt.decode(data.id_token);
                if (decoded) {
                  const { auth, name, username, gh } = decoded;
                  user = { name, username, gh, roles: auth.split(','), access_token: data.id_token };
                  Session.init(user);
                  dispatch({
                    type: 'user/getCurrentEmployeeDetail',
                  }).then(({data, success}) => {
                    if(success){
                      user = Object.assign({}, user, data);
                      Session.init(user);
                    }
                  });
                } else {
                  status = 'error';
                }
              }
            } else {
              status = 'error';
            }

            this.setState({ submitting: false, status }, () => {
              if (status === 'ok') {
                Session.init(user);
                dispatch({
                  type: 'user/fetchCurrent',
                });
                reloadAuthorized();
                const { back_url } = query;
                if (_.isEmpty(back_url)) {
                  dispatch(routerRedux.push({
                    pathname: '/',
                    query,
                  }));
                } else {
                  dispatch(routerRedux.push({
                    pathname: back_url,
                    query,
                  }));
                }
              }
            });
          });
        }
      },
    );
  };

  renderMessage = (message) => {
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={message}
        type="error"
        showIcon
      />
    );
  };

  renderSimpleForm = () => {
    const { form } = this.props;
    const { status, submitting } = this.state;
    const { getFieldDecorator } = form;
    const localUser = store.get(SESSION_STORE);
    return (
      <Form onSubmit={this.handleSubmit}>
        {
          status === 'error' &&
          submitting === false &&
          this.renderMessage('用户名或密码错误')
        }
        <FormItem>
          {getFieldDecorator('username', {
            initialValue: (localUser && localUser.username) || '',
            rules: [{
              required: true, message: '请输入用户名！',
            }],
          })(
            <Input
              size="large"
              prefix={<Icon type="user" className={styles.prefixIcon}/>}
              placeholder="用户名"
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: '请输入密码！',
            }],
          })(
            <Input
              size="large"
              prefix={<Icon type="lock" className={styles.prefixIcon}/>}
              type="password"
              placeholder="密码"
            />,
          )}
        </FormItem>
        <FormItem className={styles.additional}>
          {getFieldDecorator('rememberMe', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox className={styles.autoLogin}>自动登录</Checkbox>,
          )}
          <Button size="large" loading={submitting} className={styles.submit} type="primary" htmlType="submit">
            登录
          </Button>
        </FormItem>
      </Form>
    );
  };

  onChange = (value, label, extra) => {
    const { triggerNode: { props: { parent } } } = extra;
    const { setFieldsValue } = this.props.form;
    this.setState({ department: value }, () => {
      setFieldsValue({
        'parentCode': parent && parent.value ? parent.value : '',
      });
    });
  };

  render() {
    return (
      <div className={styles.main}>
        {
          this.renderSimpleForm()
        }
        <div className={styles.other}>
        </div>
        <div className={styles.tree} ref={c => this.treeContainer = c}></div>
      </div>
    );
  }
}
