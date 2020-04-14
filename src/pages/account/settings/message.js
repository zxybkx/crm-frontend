import { PureComponent, Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import { Switch, List, Card } from 'antd';
import PageLayout from '@/layouts/PageLayout';

const breadcrumbs = [
  { icon: 'home', path: '/' },
  { label: '个人设置', path: '/account/settings' },
  { label: '通知设置' },
];
export default class Message extends PureComponent {

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
        title: "我的日程",
        description: '日程提示的消息将以站内信的形式通知',
        actions: [Action],
      },
      {
        title: formatMessage({ id: 'app.settings.notification.messages' }, {}),
        description: formatMessage({ id: 'app.settings.notification.messages-description' }, {}),
        actions: [Action],
      },
      {
        title: formatMessage({ id: 'app.settings.notification.todo' }, {}),
        description: formatMessage({ id: 'app.settings.notification.todo-description' }, {}),
        actions: [Action],
      },
    ];
  };

  render() {
    return (
      <PageLayout breadcrumb={breadcrumbs}>
        <Card title='新消息通知'>
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
      </PageLayout>

    );
  }
}
