import React, { PureComponent } from 'react';
import { Select, Input, message, Button, Form, Row, Col } from 'antd';
import { PictureUploader, OrganizationSelect, session } from 'casic-common';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import PageLayout from '@/layouts/PageLayout';
import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;
const { Item: FormItem } = Form;
@Form.create()
@connect((state) => ({
  product: state.product,
}))
export default class Add extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbs: [],
      deployData: [],         //配置数据
      data: {},
      pinyin: {},                //产品名称拼音
    };
  }

  componentDidMount() {
    const { location: { query: { id } }, dispatch } = this.props;
    //获取配置数据
    if (id) {
      dispatch({
        type: 'product/checkProduct',
        payload: { id },
      }).then(({ success, data }) => {
        if (success && data) {
          this.setState({
            data,
            breadcrumbs: [
              { icon: 'home', path: '/' },
              { label: '产品管理', path: '/product' },
              { label: '修改' },
            ],
          });
          this.getPinYin(data.cpmc);
        } else {
          message.error('数据获取失败');
        }
      });
    } else {
      this.setState({
        breadcrumbs: [
          { icon: 'home', path: '/' },
          { label: '产品管理', path: '/product' },
          { label: '新增' },
        ],
      });
    }
    dispatch({
      type: 'product/deployData',
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          deployData: data,
        });
      }
    });
  }

  onSave = () => {
    const { dispatch, form: { validateFields }, location: { query: { id } } } = this.props;
    const { data, pinyin } = this.state;
    validateFields((errs, fields) => {
      if (errs) return;
      let photo = [];
      fields.fileList && fields.fileList.map(o => {
        const item = {
          'fileId': o.id,
          'fileName': o.name,
        };
        photo.push(item);
      });
      // let dwmcValue = [];
      // fields.dwmc && fields.dwmc.map(item => {
      //   _.forEach(item, (v, k) => {
      //     dwmcValue.push(v);
      //   });
      // });

      if (id) {
        //  修改
        const oldPhoto = data.fileList;
        const finalPhoto = [];
        photo && photo.forEach(o => {
          const index = _.findIndex(oldPhoto, x => x.fileId === o.fileId);
          if (index >= 0) {
            finalPhoto.push(oldPhoto[index]);
          } else {
            finalPhoto.push(o);
          }
        });
        dispatch({
          type: 'product/editProduct',
          payload: {
            ...fields,
            dwmc: fields.dwmc[0] && fields.dwmc[0].label,
            unitId: fields.dwmc[0] && fields.dwmc[0].value,
            fileList: finalPhoto,
            initial: pinyin && pinyin.initial,
            pinyin: pinyin && pinyin.pinyin,
            id,
          },
        }).then(({ success, data }) => {
          if (success && data) {
            message.success('保存成功');
            dispatch(
              routerRedux.push({
                pathname: 'check',
                query: {
                  id: data.id,
                },
              }),
            );
          } else {
            message.error('保存失败');
          }
        });
      } else {
        //  新增
        dispatch({
          type: 'product/addProduct',
          payload: {
            ...fields,
            dwmc: fields.dwmc[0] && fields.dwmc[0].label,
            unitId: fields.dwmc[0] && fields.dwmc[0].value,
            fileList: photo,
            initial: pinyin && pinyin.initial,
            pinyin: pinyin && pinyin.pinyin,
          },
        }).then(({ success, data }) => {
          if (success && data) {
            message.success('保存成功');
            dispatch(
              routerRedux.push({
                pathname: 'check',
                query: {
                  id: data.id,
                },
              }),
            );
          } else {
            message.error('保存失败');
          }
        });
      }
    });
  };

  validateDwmc = (rule, value, callback) => {
    if (!value[0].label) {
      callback('请选择单位名称');
    }
    callback();
  };

  getPinYin = (text) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'product/getPinYin',
      payload: {text}
    }).then(({success, data}) => {
      if(success && data) {
        this.setState({
          pinyin: data
        })
      }
    })
  };

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { breadcrumbs, data, deployData } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 9 },
      },
    };
    const longItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    const type = _.filter(deployData, item => item.categoryName === 'cp-lx');
    const jlUnit = _.filter(deployData, item => item.categoryName === 'cp-jldw');
    const cpzt = _.filter(deployData, item => item.categoryName === 'cp-zt');
    let photos = [];
    data.fileList && data.fileList.map((item) => {
      let _item = {};
      _.set(_item, 'id', item.fileId);
      _.set(_item, 'name', item.fileName);
      _.set(_item, 'url', `/gateway/fileservice/api/file/view/${item.fileId}`);
      photos.push(_item);
    });
    const dwmcList = [{ label: data.dwmc && data.dwmc || session.get().orgName, value: data.unitId && data.unitId || session.get().id }];

    return (
      <PageLayout breadcrumb={breadcrumbs}>
        <div className={styles.content}>
          <div className={styles.prodMain}>
            <Form>
              <Row>
                <Col span={8}>
                  <FormItem label='所属单位' {...formItemLayout}>
                    {
                      getFieldDecorator('dwmc', {
                        initialValue: dwmcList,
                        rules: [
                          {
                            required: true,
                            message: '请选择单位名称',
                          },
                          { validator: this.validateDwmc },
                        ],
                      })(
                        <OrganizationSelect onChange={value => console.log(value)} multiple={false} labelInValue
                                            allowClear={false}/>,
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label='产品类型' {...formItemLayout}>
                    {
                      getFieldDecorator('type', {
                        initialValue: data && data.type,
                        rules: [{
                          required: true,
                          message: '请选择产品类型',
                        }],
                      })(
                        <Select placeholder='产品类型' getPopupContainer={triggerNode => triggerNode.parentElement}>
                          {
                            type && type.map(item => {
                              return (<Option key={item.useName}>{item.name}</Option>);
                            })
                          }
                        </Select>,
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label='产品名称' {...formItemLayout}>
                    {
                      getFieldDecorator('cpmc', {
                        initialValue: data && data.cpmc,
                        rules: [{
                          required: true,
                          message: '请输入产品名称',
                        }],
                      })(
                        <Input placeholder='产品名称' maxLength={50} onBlur={(e) => this.getPinYin(e.target.value)}/>,
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem label='单价' {...formItemLayout}>
                    {
                      getFieldDecorator('dj', {
                        initialValue: data && data.dj,
                        rules: [{
                          pattern: new RegExp(/^([0-9]{1,10}(\.\d{1,2})?)$/),
                          message: '请输入正确的单价',
                        }],
                      })(
                        <Input placeholder='单价' addonAfter={'元'}/>,
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label='库存数量' {...formItemLayout}>
                    {
                      getFieldDecorator('kcsl', {
                        initialValue: data && data.kcsl,
                        rules: [{
                          pattern: new RegExp(/^(\d{1,10})$/),
                          message: '请输入正确的库存数量',
                        }],
                      })(
                        <Input placeholder='库存数量'/>,
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label='计量单位' {...formItemLayout}>
                    {
                      getFieldDecorator('jldw', {
                        initialValue: data && data.jldw,
                      })(
                        <Select placeholder='计量单位' getPopupContainer={triggerNode => triggerNode.parentElement}>
                          {
                            jlUnit && jlUnit.map(item => {
                              return (<Option key={item.useName}>{item.name}</Option>);
                            })
                          }
                        </Select>,
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem label='供应周期' {...formItemLayout}>
                    {
                      getFieldDecorator('gyzq', {
                        initialValue: data && data.gyzq,
                        rules: [{
                          pattern: new RegExp(/^(\d{1,3})$/),
                          message: '请输入正确的供应周期',
                        }],
                      })(
                        <Input placeholder='供应周期' addonAfter={'天'}/>,
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label='折扣' {...formItemLayout}>
                    {
                      getFieldDecorator('zk', {
                        initialValue: data && data.zk,
                        rules: [{
                          pattern: new RegExp(/^([0-9](\.\d{1,2})?|10)$/),
                          message: '请输入正确的折扣',
                        }],
                      })(
                        <Input placeholder='折扣' addonAfter={'折'}/>,
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label='折扣条件' {...formItemLayout}>
                    {
                      getFieldDecorator('zktj', {
                        initialValue: data && data.zktj,
                      })(
                        <Input placeholder='折扣条件'/>,
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem label='产品状态' {...formItemLayout}>
                    {
                      getFieldDecorator('zt', {
                        initialValue: data && data.zt || '1',
                      })(
                        <Select placeholder='产品状态' getPopupContainer={triggerNode => triggerNode.parentElement}>
                          {
                            cpzt && cpzt.map(item => {
                              return (<Option key={item.useName}>{item.name}</Option>);
                            })
                          }
                        </Select>,
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label='图片(最多上传5张)' {...longItemLayout}>
                    {
                      getFieldDecorator('fileList', {
                        initialValue: photos,
                      })(
                        <PictureUploader maxSize={5}/>,
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label='产品概述' {...longItemLayout}>
                    {
                      getFieldDecorator('cpgs', {
                        initialValue: data && data.cpgs,
                      })(
                        <TextArea rows={3} placeholder="产品概述"/>,
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label='功能说明' {...longItemLayout}>
                    {
                      getFieldDecorator('gnsm', {
                        initialValue: data && data.gnsm,
                      })(
                        <TextArea rows={3} placeholder="功能说明"/>,
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label='备注' {...longItemLayout}>
                    {
                      getFieldDecorator('bz', {
                        initialValue: data && data.bz,
                      })(
                        <TextArea rows={3} placeholder="备注"/>,
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <div className={styles.footerBtn}>
              <Button onClick={() => {
                this.onSave();
              }} type='primary' icon={'save'} size={'small'}>保存</Button>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
}
