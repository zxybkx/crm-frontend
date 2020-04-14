import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Switch, List, Card, Modal, Icon } from 'antd';
import { Link } from 'casic-common';
import PageLayout from '@/layouts/PageLayout';
import ChangePasswordForm from './components/ChangePasswordForm';

const breadcrumbs = [
  { icon: 'home', path: '/' },
  { label: '个人设置', path: '/account/settings' },
  { label: '安全设置' },
];
@connect()
export default class Security extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      changePasswordVisible: false,
    };
  }

  getData = () => {
    const Action = (
      <Switch
        checkedChildren={formatMessage({ id: 'app.settings.open' })}
        unCheckedChildren={formatMessage({ id: 'app.settings.close' })}
        defaultChecked
      />
    );
    return [
      {
        title: '账号密码',
        description: '当前密码强度： 强',
        actions: [<Link onClick={() => this.setState({ changePasswordVisible: true })}>修改</Link>],
      },
      {
        title: '手机号码',
        description: '当前手机号码未设置',
        actions: [<Link>设置</Link>],
      },
      {
        title: '邮箱',
        description: '当前邮箱未设置',
        actions: [<Link>设置</Link>],
      },
    ];
  };

  onClose = () => {
    this.setState({ changePasswordVisible: false });
  };

  renderChangePasswordWindow = () => {
    const { dispatch } = this.props;
    const { changePasswordVisible, model } = this.state;
    return (
      <Modal
        title={<span><Icon type='edit' className="color-default"/> 修改密码</span>}
        modal
        width={600}
        visible={changePasswordVisible}
        footer={null}
        onCancel={this.onClose}>
        <ChangePasswordForm visible={changePasswordVisible} dispatch={dispatch} model={model} doQuery={this.doQuery}
                            onClose={this.onClose}/>
      </Modal>
    );
  };

  render() {
    return (
      <PageLayout breadcrumb={breadcrumbs}>
        <Card title='安全设置'>
          <List
            itemLayout="horizontal"
            dataSource={this.getData()}
            renderItem={item => (
              <List.Item actions={item.actions}>
                <List.Item.Meta title={item.title} description={item.description}/>
              </List.Item>
            )}
          />
        </Card>
        {
          this.renderChangePasswordWindow()
        }
      </PageLayout>

    );
  }
}
