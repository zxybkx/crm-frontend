/**
 * 实地调查记录
 */
import React, {PureComponent} from 'react';
import {Steps, Tabs} from 'antd';
import {connect} from 'dva';
import Jbxx from './components/Jbxx';
import Gssccw from './components/Gssccw'
import Gsgys from './components/Gsgys'
import Product from './components/Product';
import PageLayout from '@/layouts/PageLayout';
import styles from './index.less';

const {Step} = Steps;
const {TabPane} = Tabs;
const steps = [
  {
    title: '基础信息',
    content: 'First-content',
  },
  {
    title: '公司产品',
    content: 'Second-content',
  },
  {
    title: '公司生产及财务',
    content: 'Last-content',
  },
  {
    title: '企业供应商',
    content: 'sLast-content',
  },
];

@connect(({khgj}) => ( {
  khgj
}))
export default class Sddc extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sddcId: '',// 客户跟进Id
      updateFormState: false,// 是否更新,默认为false,创建(即不更新)
      current: 0,
      breadcrumbs: []
    }
  }

  componentDidMount() {
    const {location: {query: {id, customerId}}} = this.props;
    if(id) {
      this.setState({
        breadcrumbs: [
          {icon: 'home', path: './customer'},
          {label: '客户信息', path: '/customer'},
          {label: '客户信息详情', path: `/customer/customerDetail?id=${customerId}`},
          {label: '客户拜访', path: `/khgj?id=${customerId}&type=2`},
          {label: '修改实地调查记录'},
        ]
      })
    } else {
      this.setState({
        breadcrumbs: [
          {icon: 'home', path: './customer'},
          {label: '客户信息', path: '/customer'},
          {label: '客户信息详情', path: `/customer/customerDetail?id=${customerId}`},
          {label: '客户拜访', path: `/khgj?id=${customerId}&type=2`},
          {label: '新增实地调查记录'},
        ]
      })
    }
  }

  changeStep = (current) => {
    this.setState({current})
  };

  render() {
    const {current, khgjId, breadcrumbs} = this.state;
    const {location: {query: {id, customerId}}} = this.props;
    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.formContent}>
          <Steps current={current} className={styles.stepBox} size="small">
            {steps.map(item => (
              <Step key={item.title} title={item.title}/>
            ))}
          </Steps>

          <div className={styles.apply}>
            <Tabs defaultActiveKey='1' activeKey={`${current + 1}`}>
              <TabPane tab="Jbxx" key="1">
                <Jbxx id={id} sddcId={khgjId} customerId={customerId} onSave={(data) => this.onSave(data)}/>
              </TabPane>
              <TabPane tab="Gscp" key="2">
                <Product id={id} sddcId={khgjId} customerId={customerId} changeStep={this.changeStep}/>
              </TabPane>
              <TabPane tab="Gssccw" key="3">
                <Gssccw id={id} sddcId={khgjId} customerId={customerId} changeStep={this.changeStep}/>
              </TabPane>
              <TabPane tab="Gsgys" key="4">
                <Gsgys id={id} sddcId={khgjId} customerId={customerId} changeStep={this.changeStep}/>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </PageLayout>
    )
  }

  /**
   * 提供给其他页面回调
   * @param data
   */
  onSave(data) {
    const {current, khgjId} = data;
    this.setState({
      current,
      khgjId
    });
  }


}
