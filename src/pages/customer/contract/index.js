import React, { PureComponent } from 'react';
import { Form, Row, Col, message, Select } from 'antd';
import { connect } from 'dva';
import PageLayout from '@/layouts/PageLayout';
import styles from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
@Form.create()
@connect((customer) => ({
  customer,
}))
export default class Contract extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { dispatch, location: { query: { id } } } = this.props;
    dispatch({
      type: 'customer/detailInfo',
      payload: { id: id },
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({ data });
      } else {
        message.error('数据获取失败');
      }
    });
  };

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { data } = this.state;
    const breadcrumbs = [
      { icon: 'home', path: '/' },
      { label: '客户信息', path: '/customer' },
      { label: '客户信息详情', path: `/customer/customerDetail?id=${data.id}` },
      { label: '关联合同' },
    ];
    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.contain}>
          <div className={styles.content}>
            <Row gutter={16}>
              {
                _.map(data.crmContractdtos, item => {
                  return (
                    <Col key={item.id} span={6}>
                      <div className={styles.text}>
                        <p className={styles.title}>{item.b6}</p>
                        <Row className={styles.ercontent}>
                          <Col span={24}>
                            <FormItem label={<span className={styles.label}>合同编号</span>} labelCol={{ span: 8 }}
                                      wrapperCol={{ span: 16 }}>
                              <span>{item.b1}</span>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <FormItem label={<span className={styles.label}>协议编号</span>} labelCol={{ span: 8 }}
                                      wrapperCol={{ span: 16 }}>
                              <span>{item.b4}</span>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <FormItem label={<span className={styles.label}>客户名</span>} labelCol={{ span: 8 }}
                                      wrapperCol={{ span: 16 }}>
                              <span>{item.b12}</span>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <FormItem label={<span className={styles.label}>供货方</span>} labelCol={{ span: 8 }}
                                      wrapperCol={{ span: 16 }}>
                              <span>{item.b14}</span>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <FormItem label={<span className={styles.label}>采购总额</span>} labelCol={{ span: 8 }}
                                      wrapperCol={{ span: 16 }}>
                              <span>{item.b20}</span>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <FormItem label={<span className={styles.label}>销售总额</span>} labelCol={{ span: 8 }}
                                      wrapperCol={{ span: 16 }}>
                              <span>{item.b34}</span>
                            </FormItem>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  );
                })
              }
            </Row>
          </div>
        </div>
      </PageLayout>
    );
  }
}
