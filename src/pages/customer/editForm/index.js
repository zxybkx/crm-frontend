import React, { PureComponent } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
  message,
  Icon,
  Cascader,
  Collapse,
  DatePicker,
  Radio,
  Tooltip,
  AutoComplete,
} from 'antd';
import styles from '../index.less';
import Shareholder from './shareholder';
import { routerRedux } from 'dva/router';
import { UserSelector } from 'casic-common';
import RegionCascader from 'casic-common/src/lib/Forms/RegionCascader';
import PageLayout from '@/layouts/PageLayout';
import moment from 'moment';
import { connect } from 'dva';
import Lxr from './lxr';
import KhlbCascader from '../components/KhlvCascader';
import _ from 'lodash';

const { Group } = Radio;
const { Panel } = Collapse;
const FormItem = Form.Item;
const Option = Select.Option;
const { Search } = Input;
const TextArea = Input.TextArea;

@Form.create()
@connect((customer) => ({
  customer,
}))

export default class BasicInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      basicInfo: {},
      customerData: {},
      gdData: [],        //股东信息数据
      showNbkh: '',     //是否展示内部客户
      selectData: {},
      lxrData: [],      //联系人数据
      dataSource: [],         //客户选项
      selectedData: {},       //选中的客户的信息
      breadcrumbs: [],
      khxzOptions: [],
      khlbOptions: [],
      cascaderValue: [],
    };
  }

  componentDidMount() {
    const { location: { query: { id } }, dispatch } = this.props;

    //企业类型选项
    dispatch({
      type: 'customer/getOptions',
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          selectData: data,
        });
      }
    });

    // 客户性质选项
    dispatch({
      type: 'customer/getKhzzOptions',
      payload: {
        name: 'khxx-khxz',
      },
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          khxzOptions: data,
        });
      }
    });

    // 客户性质选项
    // dispatch({
    //   type: 'customer/getKhlbOptions',
    //   payload: {
    //     'level.equals': 2,
    //     'activated.equals': 'T',
    //     'enabled.equals': 'T',
    //     'parentCode.equals': '13',
    //   },
    // }).then(({ success, data }) => {
    //   if (success && data) {
    //     this.setState({
    //       khxzOptions: data,
    //     });
    //   }
    // });

    //客户信息
    if (id) {
      dispatch({
        type: 'customer/editCustomer',
        payload: { id: id },
      }).then(({ success, data }) => {
        if (success && data) {
          this.setState({
            customerData: data,
            showNbkh: data.sfNbkh,
            gdData: data.crmCustomerGdxxes,
            lxrData: data.crmCustomerLxrdtos,
            breadcrumbs: [
              { icon: 'home', path: '/' },
              { label: '客户信息', path: '/customer' },
              { label: '修改' },
            ],
          });
        }
      });
    } else {
      this.setState({
        breadcrumbs: [
          { icon: 'home', path: '/' },
          { label: '客户信息', path: '/customer' },
          { label: '新增' },
        ],
      });
    }
  };

  onSave = () => {
    const { dispatch, location: { query: { id } }, form: { validateFieldsAndScroll } } = this.props;
    const { gdData, lxrData, customerData } = this.state;

    validateFieldsAndScroll((errs, fields) => {
      if (errs) return;
      //去掉新增股东时前台生成的id
      gdData && gdData.map((item) => {
        if (item.id.indexOf('-') > -1) {
          delete item.id;
        }
      });

      //去掉新增联系人时前端生产的id
      lxrData && lxrData.map((item) => {
        if (item.id.indexOf('-') > -1) {
          delete item.id;
        }
      });

      const _gj = fields['gj'];
      const _zcdzgj = fields['zcdzgj'];
      // 通讯地址的code和name
      _.set(fields, 'sf', _gj.codePath ? _gj.codePath : '');
      _.set(fields, 'cs', _gj.namePath ? _gj.namePath : '');
      // 注册地址的code和name
      _.set(fields, 'zcdzsf', _zcdzgj.codePath ? _zcdzgj.codePath : '');
      _.set(fields, 'zcdzcs', _zcdzgj.namePath ? _zcdzgj.namePath : '');
      _.set(fields, 'gj', '');
      _.set(fields, 'zcdzgj', '');
      // 客户类别
      _.set(fields, 'khlb', fields.khlbl ? fields.khlbl.codePath : '');
      _.set(fields, 'khlbmc', fields.khlbl ? fields.khlbl.namePath: '');
      // 客户性质
      _.set(fields, 'khxz', fields.khxzl.key);
      _.set(fields, 'khxzmc', fields.khxzl.label);
      delete fields.khlbl;
      delete fields.khxzl;
      if (id) {
        // 修改
        _.set(fields, 'id', id);
        dispatch({
          type: 'customer/saveEditCustomer',
          payload: {
            ...fields,
            khdm: customerData.khdm,
            crmCustomerGdxxes: gdData,
            crmCustomerLxrdtos: lxrData,
          },
        }).then(({ success, data }) => {
          if (success && data) {
            message.success('保存成功');
            dispatch(
              routerRedux.push({
                pathname: `/customer/customerDetail`,
                query: {
                  id: data.id,
                },
              }),
            );
          }
        });
      } else {
        //  新增
        let crmKhgjdto = {};
        //客户方重要与会人
        const khfzyyhr = {
          type: 1,
          userName: fields['khfzyyhr'],
          zw: fields['zw'],
        };

        //我方参与人员
        let wfcyryArr = [];
        fields.wfcyry && fields.wfcyry.map(o => {
          let wfcyryObj = {};
          _.set(wfcyryObj, 'type', 2);
          _.set(wfcyryObj, 'userName', o.name);
          _.set(wfcyryObj, 'zw', null);
          wfcyryArr.push(wfcyryObj);
        });

        //客户方参与人员
        let khfcyryArr = [];
        fields.khfcyry && fields.khfcyry.map(o => {
          let khfcyryObj = {};
          _.set(khfcyryObj, 'type', 3);
          _.set(khfcyryObj, 'userName', o);
          _.set(khfcyryObj, 'zw', null);
          khfcyryArr.push(khfcyryObj);
        });

        _.set(crmKhgjdto, 'gjmd', fields['gjmd']);
        _.set(crmKhgjdto, 'gjrq', fields['gjrq']);
        _.set(crmKhgjdto, 'qtqk', fields['qtqk']);
        _.set(crmKhgjdto, 'crmKhgjRies', [khfzyyhr, ...wfcyryArr, ...khfcyryArr]);
        _.set(crmKhgjdto, 'type', '1');

        dispatch({
          type: 'customer/getKhbm',
          payload: {
            name: fields['khmc'],
            type: fields['khxz'],
          },
        }).then((response) => {
          if (response) {
            const { success, data } = response;
            if (success && data) {
              dispatch({
                type: 'customer/saveAddCustomer',
                payload: {
                  ...fields,
                  khdm: data,
                  crmCustomerGdxxes: gdData,
                  crmCustomerLxrdtos: lxrData,
                  crmKhgjdto: crmKhgjdto,
                },
              }).then(({ success, data }) => {
                if (success && data) {
                  message.success('保存成功');
                  dispatch(
                    routerRedux.push({
                      pathname: `/customer/customerDetail`,
                      query: {
                        id: data.id,
                      },
                    }),
                  );
                }else{
                  message.error('保存失败');
                }
              });
            }
          }else {
            message.error('数据异常');
          }
        }).catch((error) => {
          message.error('服务器发生错误!');
        });
      }
    });
  };

  //验证客户名称是否重复
  handleKhmcRepeat = (rule, value, callback) => {
    const { dispatch, location: { query: { id } } } = this.props;
    dispatch({
      type: 'customer/validateKhmc',
      payload: {
        id: id,
        khmc: value,
      },
    }).then(({ success, data }) => {
      if (success && data) {
        if (data.isRepeated) {
          callback('该用户已存在');
        }
        callback();
      }
    });
  };

  //改变股东信息数据
  changeGdxx = (data) => {
    this.setState({
      gdData: data,
    });
  };

  //改变联系人信息数据
  changeLxr = (data) => {
    this.setState({
      lxrData: data,
    });
  };

  showNbkh = (e) => {
    this.setState({
      showNbkh: e.target.value,
    });
  };

  //根据客户中文名称获取客户信息
  getKhxxFromName = (name) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/getKhxxFromName',
      payload: {
        name: name,
      },
    }).then(({ success, data }) => {
      if (success && data) {
        if (_.isEmpty(data.content)) {
          message.info('没有搜索到该客户信息');
        } else {
          this.setState({
            dataSource: data.content,
          });
        }
      }
    });
  };

  onSelect = (value) => {
    const { form: { setFieldsValue } } = this.props;
    const { dataSource } = this.state;
    const info = _.find(dataSource, item => item.name === value);
    this.setState({
      selectedData: info,
    });
    _.forEach(info, (v, k) => {
      if (v === 'N/A') {
        delete info[k];
      }
    });

    const zzjgdm = info && info.code.substring(9, 17);
    setFieldsValue({
      ['khmc']: value,
      ['fddbr']: info && info.legalRepresentative,
      ['extraZczb']: info && info.capital,
      ['shxydm']: info && info.code,
      ['extraGsClsj']: info && info.registrationDay && moment(info.registrationDay, 'YYYY-MM-DD'),
      ['extraJyfw']: info && info.businessScope,
      ['zcdzsf']: info && info.province,
      ['zcdzcs']: info && info.city,
      ['extraZcdz']: info && info.address,
      ['nsdjh']: info && info.code,
      ['zzjgdm']: zzjgdm,
    });
  };

  onSearch = (value) => {
    this.getKhxxFromName(value);
  };

  //加法函数
  accAdd = (arg1, arg2) => {
    let r1, r2, m;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
  };

  //减法函数
  accSub = (arg1, arg2) => {
    let r1, r2, m;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m - arg2 * m) / m;
  };

  render() {
    const { form: { getFieldDecorator }, dispatch, location: { query: { id } } } = this.props;
    const { customerData, selectData, dataSource, gdData, lxrData, showNbkh, breadcrumbs, khxzOptions } = this.state;
    Number.prototype.add = function(arg) {
      return accAdd(arg, this);
    };

    let totalPoint = 0;
    gdData && gdData.map(item => {
      if (item && item.czbl) {
        totalPoint = this.accAdd(totalPoint, _.toNumber(item.czbl));
      }
    });

    const surplus = this.accSub(100, totalPoint);
    const shareholder = {
      dispatch,
      gdData,
      surplus,
      changeGdxx: this.changeGdxx,
    };
    const lxr = {
      changeLxr: this.changeLxr,
      dispatch,
      lxrData,
    };

    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.content}>
          {/*---------基本信息一*/}
          <div className={styles.apply}>
            <div style={{ float: 'right', padding: '11px 24px 0 0' }}>
              <span style={{ color: '#F8142E' }}>*</span>为必填项
            </div>
            <Row>
              <Col span={8}>
                <FormItem label="客户名称" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                  {
                    getFieldDecorator('khmc', {
                      initialValue: customerData && customerData.khmc,
                      rules: [{
                        required: true,
                        message: '请输入客户名称',
                        // pattern: new RegExp(/^\D*$/),
                      }, {
                        validator: this.handleKhmcRepeat,
                      }],
                    })(
                      <AutoComplete
                        dataSource={
                          dataSource && dataSource.map(o => {
                            return (
                              <Option key={o.name}>{o.name}</Option>
                            )
                          })
                        }
                        style={{width: '100%'}}
                        onSelect={this.onSelect}
                        placeholder="客户名称"
                      >
                        <Search
                          enterButton
                          allowClear
                          onSearch={value => this.onSearch(value)}
                        />
                      </AutoComplete>,
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="客户性质" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                  {
                    getFieldDecorator('khxzl', {
                      initialValue: customerData.khxz && {key: customerData.khxz, label: customerData.khxzmc} || { key: '1', label: '企业客户' },
                    })(
                      <Select style={{ width: '100%' }} labelInValue disabled>
                        {
                          _.map(khxzOptions, item => {
                            return (
                              <Option key={item.useName}>{item.name}</Option>
                            );
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
                <FormItem label="客户类别" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                  {
                    getFieldDecorator('khlbl', {
                      initialValue: {
                        codePath: customerData && customerData.khlb,
                        namePath: customerData && customerData.khlbmc,
                      },
                    })(
                      <KhlbCascader labelInValue/>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Collapse defaultActiveKey='1'>
              {
                id ? null :
                  <Panel header="客户拜访" key="1">
                    <Row>
                      <Col span={16}>
                        <FormItem label="跟进目的" labelCol={{ span: 6 }} wrapperCol={{ span: 15 }}>
                          {
                            getFieldDecorator('gjmd', {})(
                              <TextArea rows={2} placeholder="跟进目的"/>,
                            )
                          }
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={16}>
                        <FormItem label="洽谈情况" labelCol={{ span: 6 }} wrapperCol={{ span: 15 }}>
                          {
                            getFieldDecorator('qtqk', {})(
                              <TextArea rows={2} placeholder="洽谈情况"/>,
                            )
                          }
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={16}>
                        <FormItem label="我方参与人员" labelCol={{ span: 6 }} wrapperCol={{ span: 15 }}>
                          {
                            getFieldDecorator('wfcyry', {
                              // rules: [{
                              //   message: '请输入不包含数字的名称',
                              //   pattern: new RegExp(/^\D*$/),
                              // }],
                            })(
                              <UserSelector multiple clearable/>,
                            )
                          }
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={16}>
                        <FormItem label="客户方参与人员" labelCol={{ span: 6 }} wrapperCol={{ span: 15 }}>
                          {
                            getFieldDecorator('khfcyry', {
                              // rules: [{
                              //   message: '请输入不包含数字的名称',
                              //   pattern: new RegExp(/^\D*$/),
                              // }],
                            })(
                              <Select mode="tags" style={{ width: '100%' }}
                                      getPopupContainer={triggerNode => triggerNode.parentElement}/>,
                            )
                          }
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8}>
                        <FormItem label="客户方重要与会人" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                          {
                            getFieldDecorator('khfzyyhr', {})(
                              <Input/>,
                            )
                          }
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem label="职务" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                          {
                            getFieldDecorator('zw', {})(
                              <Input/>,
                            )
                          }
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8}>
                        <FormItem label="拜访时间" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                          {
                            getFieldDecorator('gjrq', {
                              initialValue: moment(),
                            })(
                              <DatePicker disabledDate={this.disabledDate}
                                          style={{ width: '100%' }}/>,
                            )
                          }
                        </FormItem>
                      </Col>
                    </Row>
                  </Panel>
              }
              <Panel header="联系人" key={id ? '1' : '2'}>
                <Row>
                  <Col span={10} offset={4}>
                    <FormItem>
                      <Lxr {...lxr}/>
                    </FormItem>
                  </Col>
                </Row>
              </Panel>
              <Panel header="基本信息" key={id ? '2' : '3'}>
                <Row>
                  <Col span={8}>
                    <FormItem label="英文名称" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('khywm', {
                          initialValue: customerData && customerData.khywm,
                          // rules: [{
                          //   message: '请输入正确的客户英文名',
                          //   pattern: new RegExp(/^[A-Za-z~!！$@#￥%^&*\s]+$/)
                          // }],
                        })(
                          <Input placeholder="英文名称"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="企业简称" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                      {
                        getFieldDecorator('khjc', {
                          initialValue: customerData && customerData.khjc,
                          // rules: [{
                          //   message: '请输入不包含数字的客户简称',
                          //   pattern: new RegExp(/^\D*$/),
                          // }],
                        })(
                          <Input placeholder="企业简称"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="企业性质" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('extraQyxz', {
                          initialValue: customerData && customerData.extraQyxz,
                        })(
                          <Select style={{ width: '100%' }} placeholder="企业性质"
                                  getPopupContainer={triggerNode => triggerNode.parentElement}>
                            <Option value="民企">民企</Option>
                            <Option value="国企">国企</Option>
                            <Option value="政府部门">政府部门</Option>
                            <Option value="事业单位">事业单位</Option>
                            <Option value="其他">其他</Option>
                          </Select>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="公司网址" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                      {
                        getFieldDecorator('extraGsWz', {
                          initialValue: customerData && customerData.extraGsWz,
                          rules: [{
                            message: '示例：http://www.baidu.com',
                            pattern: new RegExp(/^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})www\.(([A-Za-z0-9]+)\.)+([A-Za-z0-9])+$/),
                          }],
                        })(
                          <Input placeholder="公司网址"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="通讯地址" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('gj', {
                          initialValue: {
                            codePath: customerData && customerData.sf,
                            namePath: customerData && customerData.cs,
                          },
                        })(
                          <RegionCascader labelInValue/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={16}>
                    <FormItem label="详细地址" labelCol={{ span: 6 }} wrapperCol={{ span: 15 }}>
                      {
                        getFieldDecorator('txdz', {
                          initialValue: customerData && customerData.txdz,
                        })(
                          <TextArea rows={2} placeholder="详细地址"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
              </Panel>
              <Panel header="工商信息" key={id ? '3' : '4'}>
                <Row>
                  <Col span={8}>
                    <FormItem label="法人代表" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('fddbr', {
                          initialValue: customerData && customerData.fddbr,
                          // rules: [{
                          //   message: '请输入不包含数字的名称',
                          //   pattern: new RegExp(/^\D*$/),
                          // }],
                        })(
                          <Input placeholder="法人代表"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="注册资本" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                      {
                        getFieldDecorator('extraZczb', {
                          initialValue: customerData && customerData.extraZczb,
                        })(
                          <Input placeholder="注册资本"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="统一社会编码" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('shxydm', {
                          initialValue: customerData && customerData.shxydm,
                          rules: [{
                            message: '请输入正确的统一社会编码',
                            pattern: new RegExp(/^[A-Z0-9]*$/),
                          }],
                        })(
                          <Input placeholder="统一社会编码"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="成立日期" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                      {
                        getFieldDecorator('extraGsClsj', {
                          initialValue: customerData && customerData.extraGsClsj && moment(customerData.extraGsClsj),
                        })(
                          <DatePicker style={{ width: '100%' }}
                                      disabledDate={this.disabledDate}
                          />,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="营业执照注册码" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('yyzzZch', {
                          initialValue: customerData && customerData.yyzzZch,
                          rules: [{
                            message: '请输入正确的营业执照注册号',
                            pattern: new RegExp(/^[0-9]*$/),
                          }],
                        })(
                          <Input placeholder="营业执照注册码"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label='纳税登记号' labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                      {
                        getFieldDecorator('nsdjh', {
                          initialValue: customerData && customerData.nsdjh,
                          rules: [{
                            message: '请输入正确的纳税登记号',
                            pattern: new RegExp(/^[A-Z0-9]*$/),
                          }],
                        })(
                          <Input placeholder="纳税登记号"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="组织机构代码" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('zzjgdm', {
                          initialValue: customerData && customerData.zzjgdm,
                          // rules: [{
                          //   message: '请输入正确的组织机构代码',
                          //   pattern: new RegExp(/^[A-Z0-9]{9}?$/)
                          // }],
                        })(
                          <Input placeholder="组织机构代码"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label='行业' labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                      {
                        getFieldDecorator('hylb', {
                          initialValue: customerData && customerData.hylb,
                        })(
                          <Input placeholder="行业"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="营业执照年审日期" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('extraYyzzNsrq', {
                          initialValue: customerData && customerData.extraYyzzNsrq && moment(customerData.extraYyzzNsrq),
                        })(
                          <DatePicker style={{ width: '100%' }} disabledDate={this.disabledDate}/>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="企业类型" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                      {
                        getFieldDecorator('extraQylx', {
                          initialValue: customerData && customerData.extraQylx,
                        })(
                          <Select getPopupContainer={triggerNode => triggerNode.parentElement}
                                  placeholder="企业类型"
                                  style={{ width: '100%' }}>
                            {
                              _.map(selectData, (v, k) => {
                                if (k === 'mdDictionaryItems') {
                                  return (
                                    v.map((item) => {
                                      if (item.code === 'enterprise_type') {
                                        return (
                                          <Option key={item.itemValue}>
                                            {item.itemName}
                                          </Option>
                                        );
                                      }
                                    })
                                  );
                                }
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
                    <FormItem label="一般纳税人成立日期" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('extraYbnsrClsj', {
                          initialValue: customerData && customerData.extraYbnsrClsj && moment(customerData.extraYbnsrClsj),
                        })(
                          <DatePicker style={{ width: '100%' }} disabledDate={this.disabledDate}/>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="员工人数" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                      {
                        getFieldDecorator('extraYgrs', {
                          initialValue: customerData && customerData.extraYgrs,
                          rules: [{
                            pattern: new RegExp(/^[1-9][0-9]*$/), message: '请输入正确的人数',
                          }],
                        })(
                          <Input addonAfter={'人'} placeholder="员工人数"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={16}>
                    <FormItem label="经营范围" labelCol={{ span: 6 }} wrapperCol={{ span: 15 }}>
                      {
                        getFieldDecorator('extraJyfw', {
                          initialValue: customerData && customerData.extraJyfw,
                        })(
                          <TextArea rows={4} placeholder="经营范围"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="注册地址" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('zcdzgj', {
                          initialValue: {
                            codePath: customerData && customerData.zcdzsf,
                            namePath: customerData && customerData.zcdzcs,
                          },
                        })(
                          <RegionCascader labelInValue/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={16}>
                    <FormItem label="详细地址" labelCol={{ span: 6 }} wrapperCol={{ span: 15 }}>
                      {
                        getFieldDecorator('extraZcdz', {
                          initialValue: customerData && customerData.extraZcdz,
                        })(
                          <TextArea rows={2} placeholder="详细地址"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
              </Panel>
              <Panel header="股东信息" key={id ? '4' : '5'}>
                <Row>
                  <Col span={10} offset={4}>
                    <FormItem>
                      <Shareholder {...shareholder}/>
                    </FormItem>
                  </Col>
                </Row>
              </Panel>
              <Panel header="其他信息" key={id ? '5' : '6'}>
                <Row>
                  <Col span={8}>
                    <FormItem label="总经理" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('extraZjl', {
                          initialValue: customerData && customerData.extraZjl,
                          // rules: [{
                          //   message: '请输入不包含数字的名称',
                          //   pattern: new RegExp(/^\D*$/),
                          // }],
                        })(
                          <Input placeholder="总经理"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="联系电话" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                      {
                        getFieldDecorator('lxdh', {
                          initialValue: customerData && customerData.lxdh,
                          // rules: [{
                          //   message: '请输入正确的联系电话',
                          //   pattern: new RegExp(/^(\(\d{3,4}\)|\d{3,4}-)?\d{7,14}$/),
                          // }],
                        })(
                          <Input placeholder="联系电话"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="账户名称" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('zhmc', {
                          initialValue: customerData && customerData.zhmc,
                        })(
                          <Input placeholder="账户名称"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="账户号码" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                      {
                        getFieldDecorator('zhhm', {
                          initialValue: customerData && customerData.zhhm,
                          // rules: [{
                          //   message: '请输入正确的的账户号码',
                          //   pattern: new RegExp(/^[0-9]*$/)
                          // }],
                        })(
                          <Input placeholder="账户号码"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="开户银行" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('khyhmc', {
                          initialValue: customerData && customerData.khyhmc,
                          // rules: [{
                          //   message: '请输入不包含数字的名称',
                          //   pattern: new RegExp(/^\D*$/)
                          // }],
                        })(
                          <Input placeholder="开户银行"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="传真" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                      {
                        getFieldDecorator('cz', {
                          initialValue: customerData && customerData.cz,
                          // rules: [{
                          //   message: '请输入正确的传真',
                          //   pattern: new RegExp(/^[0-9~!！$@#￥%^&*]+$/)
                          // }],
                        })(
                          <Input placeholder="传真"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="邮编" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('yb', {
                          initialValue: customerData && customerData.yb,
                          // rules: [{
                          //   message: '请输入正确的邮编',
                          //   pattern: new RegExp(/^[0-9]{6}?$/)
                          // }],
                        })(
                          <Input placeholder="邮编"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="邮箱" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                      {
                        getFieldDecorator('email', {
                          initialValue: customerData && customerData.email,
                          rules: [{ type: 'email', message: '请输入正确的邮箱' }],
                        })(
                          <Input placeholder="邮箱"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="业务主办人" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('extraYwzbr', {
                          initialValue: customerData && customerData.extraYwzbr,
                          // rules: [{
                          //   message: '请输入不包含数字的名称',
                          //   pattern: new RegExp(/^\D*$/),
                          // }],
                        })(
                          <Input placeholder="业务主办人"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="厂房情况" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                      {
                        getFieldDecorator('extraCfqk', {
                          initialValue: customerData && customerData.extraCfqk,
                        })(
                          <Select style={{ width: '100%' }}
                                  getPopupContainer={triggerNode => triggerNode.parentElement}
                                  placeholder="请选择厂房情况">
                            <Option value="租用">租用</Option>
                            <Option value="自有">自有</Option>
                          </Select>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="集团战略客户" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('sfJtzlkh', {
                          initialValue: customerData && customerData.sfJtzlkh,
                        })(
                          <Group>
                            <Radio value="是">是</Radio>
                            <Radio value="否">否</Radio>
                          </Group>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="客户隶属" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                      {
                        getFieldDecorator('khls', {
                          initialValue: customerData && customerData.khls,
                        })(
                          <Input placeholder="客户隶属"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="单位类别" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('dwlb', {
                          initialValue: customerData && customerData.dwlb,
                        })(
                          <Input placeholder="单位类别"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="信用类别" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                      {
                        getFieldDecorator('xylb', {
                          initialValue: customerData && customerData.xylb,
                        })(
                          <Input placeholder="信用类别"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="邓氏编码" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('dsbm', {
                          initialValue: customerData && customerData.dsbm,
                          // rules: [{
                          //   required: true,
                          //   message: '请输入正确的的邓氏编码',
                          //   pattern: new RegExp(/^[0-9]{9}?$/)
                          // }],
                        })(
                          <Input placeholder="邓氏编码"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="数据密级" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                      {
                        getFieldDecorator('sjmj', {
                          initialValue: customerData && customerData.sjmj,
                        })(
                          <Input placeholder="数据密级"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label={<Tooltip title="办公场所或厂房占地面积"><span>办公场所或厂房占地面积</span></Tooltip>}
                              labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('extraZdmj', {
                          initialValue: customerData && customerData.extraZdmj,
                          rules: [{
                            pattern: new RegExp(/^([1-9]\d*)(\.[0-9]\d*)?$/),
                            message: '请输入正确的面积',
                          }],
                        })(
                          <Input addonAfter={'㎡'} placeholder="办公场所或厂房占地面积"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="主资产是否抵押" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                      {
                        getFieldDecorator('extraZyzcSfdy', {
                          initialValue: customerData && customerData.extraZyzcSfdy,
                        })(
                          <Group>
                            <Radio value="是">是</Radio>
                            <Radio value="否">否</Radio>
                          </Group>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="内部客户" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('sfNbkh', {
                          initialValue: customerData && customerData.sfNbkh,
                        })(
                          <Group onChange={this.showNbkh}>
                            <Radio value="是">是</Radio>
                            <Radio value="否">否</Radio>
                          </Group>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                {
                  showNbkh === '是' ?
                    <div>
                      <Row>
                        <Col span={8}>
                          <FormItem label="所属三级单位" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                            {
                              getFieldDecorator('lbkhSssjdw', {
                                initialValue: customerData && customerData.lbkhSssjdw,
                              })(
                                <Input placeholder="所属三级单位"/>,
                              )
                            }
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem label="所属二级单位" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                            {
                              getFieldDecorator('lbkhSsejdw', {
                                initialValue: customerData && customerData.lbkhSsejdw,
                              })(
                                <Input placeholder="所属二级单位"/>,
                              )
                            }
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}>
                          <FormItem label="机构代码" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                            {
                              getFieldDecorator('lbkhJgdm', {
                                initialValue: customerData && customerData.lbkhJgdm,
                                // rules: [{
                                //   message: '请输入正确的机构代码',
                                //   pattern: new RegExp(/^[A-Z0-9]{9}?$/)
                                // }],
                              })(
                                <Input placeholder="机构代码"/>,
                              )
                            }
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem label="是否军品客户" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                            {
                              getFieldDecorator('lbkhSfJpkh', {
                                initialValue: customerData && customerData.lbkhSfJpkh,
                              })(
                                <Group>
                                  <Radio value="是">是</Radio>
                                  <Radio value="否">否</Radio>
                                </Group>,
                              )
                            }
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}>
                          <FormItem label="顺序码" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                            {
                              getFieldDecorator('lbkhSxm', {
                                initialValue: customerData && customerData.lbkhSxm,
                              })(
                                <Input placeholder="顺序码"/>,
                              )
                            }
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={16}>
                          <FormItem label="其他经营地址" labelCol={{ span: 6 }} wrapperCol={{ span: 15 }}>
                            {
                              getFieldDecorator('extraJydz', {
                                initialValue: customerData && customerData.extraJydz,
                              })(
                                <TextArea rows={2} placeholder="其他经营地址"/>,
                              )
                            }
                          </FormItem>
                        </Col>
                      </Row>
                    </div> : null
                }
              </Panel>
            </Collapse>
            <div className={styles.btnGroup}>
              <Button
                size="small"
                className={styles.btn}
                type={'primary'}
                icon="save"
                style={{ marginBottom: '10px' }}
                onClick={() => this.onSave()}>
                保存
              </Button>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
}
