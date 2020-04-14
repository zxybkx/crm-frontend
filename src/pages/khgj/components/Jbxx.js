/**
 * 实地调查记录-基本信息
 */
import React, {PureComponent} from 'react';
import {Form, Select, Input, DatePicker, Button, message} from 'antd';
import {connect} from 'dva';
import moment from 'moment';
import _ from 'lodash';
import {UserSelector} from 'casic-common';
import styles from './Jbxx.less';

const {Item: FormItem} = Form;
const Option = Select.Option;
const TextArea = Input.TextArea;

@Form.create()
@connect(state => ({
  khgj: state.khgj,
  loading: state.loading.effects['khgj/addSddcJbxx'],
}))
export default class Jbxx extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      khxx: [],// 客户信息
      sddcData: {},
      saveId: '',      //保存返回的id
    };
  }

  componentDidMount() {
    const {dispatch, id} = this.props;
    const {saveId} = this.state;
    dispatch({
      type: 'khgj/getCustomersList',
    }).then(({success, data}) => {
      if (success && data) {
        this.setState({
          khxx: data
        });
      }
    });
    if (id || !_.isEmpty(saveId)) {
      this.loadDate();
    }
  }

  loadDate = () => {
    const {dispatch, id} = this.props;
    const {saveId} = this.state;
    dispatch({
      type: 'khgj/getRcgjData',
      payload: {
        khgjId: id || saveId
      }
    }).then(({success, data}) => {
      if (success && data) {
        this.setState({
          sddcData: data
        })
      }
    })
  };

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  //保存
  onSave() {
    const {dispatch, form: {validateFields}, id} = this.props;
    const {sddcData, saveId} = this.state;
    validateFields((err, fields) => {
      if (err) return;
      //拜访人员
      let bfryArr = [];
      fields.bfry && fields.bfry.map(o => {
        let bfryObj = {};
        _.set(bfryObj, 'type', 1);
        _.set(bfryObj, 'userName', o.name);
        bfryArr.push(bfryObj)
      });
      //接待人员
      let jdryArr = [];
      fields.jdry && fields.jdry.map(o => {
        let jdryObj = {};
        _.set(jdryObj, 'type', 2);
        _.set(jdryObj, 'userName', o);
        jdryArr.push(jdryObj)
      });
      //重要人员
      const zyry = {
        type: 3,
        userName: fields['zyry'],
        zw: fields['zw'],
        lxdh: fields['dh']
      };
      const payload = {
        customerId: fields['customerId'],
        gjrq: fields['bfsj'],
        khsy: fields['khsy'],
        khxy: fields['khxy'],
        type: '2',
        crmKhgjRies: [
          zyry, ...jdryArr, ...bfryArr
        ]
      };

      if (id || !_.isEmpty(saveId)) {
        //修改保存
        dispatch({
          type: 'khgj/saveEditRcgj',
          payload: {
            ...sddcData,
            ...payload
          }
        }).then(({success, data}) => {
          if (success && data) {
            message.success('保存成功');
            this.setState({
              saveId: data.id
            }, () => {
              this.loadDate()
            });
            this.props.onSave({
              current: 0,
              khgjId: data.id,
            });
          }
        })
      } else {
        //新增保存
        dispatch({
          type: `khgj/saveAddRcgj`,
          payload: payload
        }).then(({success, data}) => {
          if (success && data) {
            message.success('保存成功');
            this.setState({
              saveId: data.id
            }, () => {
              this.loadDate()
            });
            this.props.onSave({
              current: 0,
              khgjId: data.id,
            });
          }
        })
      }
    });
  }

  //下一步
  onNext = () => {
    const {dispatch, form: {validateFields}, id} = this.props;
    const {sddcData, saveId} = this.state;
    validateFields((err, fields) => {
      if (err) return;
      //拜访人员
      let bfryArr = [];
      fields.bfry && fields.bfry.map(o => {
        let bfryObj = {};
        _.set(bfryObj, 'type', 1);
        _.set(bfryObj, 'userName', o.name);
        bfryArr.push(bfryObj)
      });
      //接待人员
      let jdryArr = [];
      fields.jdry && fields.jdry.map(o => {
        let jdryObj = {};
        _.set(jdryObj, 'type', 2);
        _.set(jdryObj, 'userName', o);
        jdryArr.push(jdryObj)
      });
      //重要人员
      const zyry = {
        type: 3,
        userName: fields['zyry'],
        zw: fields['zw'],
        lxdh: fields['dh']
      };
      const payload = {
        customerId: fields['customerId'],
        gjrq: fields['bfsj'],
        khsy: fields['khsy'],
        khxy: fields['khxy'],
        type: '2',
        crmKhgjRies: [
          zyry, ...jdryArr, ...bfryArr
        ]
      };

      if (id || !_.isEmpty(saveId)) {
        //修改保存
        dispatch({
          type: 'khgj/saveEditRcgj',
          payload: {
            ...sddcData,
            ...payload
          }
        }).then(({success, data}) => {
          if (success && data) {
            message.success('保存成功');
            this.setState({
              saveId: data.id
            }, () => {
              this.loadDate()
            });
            this.props.onSave({
              current: 1,// 跳转到公司产品
              khgjId: data.id,
            });
          }
        })
      } else {
        //新增保存
        dispatch({
          type: `khgj/saveAddRcgj`,
          payload: payload
        }).then(({success, data}) => {
          if (success && data) {
            message.success('保存成功');
            this.setState({
              saveId: data.id
            }, () => {
              this.loadDate()
            });
            this.props.onSave({
              current: 1,// 跳转到公司产品
              khgjId: data.id,
            });
          }
        })
      }
    });
  };

  render() {
    const {form: {getFieldDecorator}, loading, customerId} = this.props;
    const {khxx, sddcData} = this.state;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 10},
      },
    };
    //拜访人员
    let bfry = [];
    _.find(sddcData.crmKhgjRies, (item) => {
      if (item && item.type === 1) {
        let perObj = {};
        _.set(perObj, 'username', item.userName);
        _.set(perObj, 'label', item.userName);
        _.set(perObj, 'name', item.userName);
        _.set(perObj, 'key', item.id);
        bfry.push(perObj)
      }
    });

    //接待人员
    let jdry = [];
    _.find(sddcData.crmKhgjRies, (item) => {
      if (item && item.type === 2) {
        jdry.push(item.userName)
      }
    });

    //重要人员
    const zyry = _.find(sddcData.crmKhgjRies, (item) => {
      return item.type === 3
    });

    return (
      <div className={styles.formContent}>
        <Form {...formItemLayout}>
          <FormItem label={'客户名称'} className={styles.inputBtm}>
            {getFieldDecorator('customerId', {
              initialValue: customerId,
              rules: [{required: true, message: '请选择客户名称'}]
            })(
              <Select style={{width: '100%'}}
                      showSearch
                      disabled
                      getPopupContainer={triggerNode => triggerNode.parentElement}
                      optionFilterProp="children">
                {
                  khxx && khxx.map((item) => {
                    return (
                      <Option key={item.id}>{item.khmc}</Option>
                    )
                  })
                }
              </Select>
            )}
          </FormItem>
          <FormItem label={'拜访时间'} className={styles.inputBtm}>
            {getFieldDecorator('bfsj', {
              initialValue: (sddcData && sddcData.gjrq && moment(sddcData.gjrq)) || moment()
            })(
              <DatePicker style={{width: '100%'}} disabledDate={this.disabledDate}/>
            )}
          </FormItem>
          <FormItem label={'拜访人员'} className={styles.inputBtm}>
            {getFieldDecorator('bfry', {
              initialValue: bfry && bfry
            })(
              <UserSelector multiple clearable />
            )}
          </FormItem>
          <FormItem label={'接待人员'} className={styles.inputBtm}>
            {getFieldDecorator('jdry', {
              initialValue: jdry && jdry
            })(
              <Select mode="tags" style={{width: '100%'}} getPopupContainer={triggerNode => triggerNode.parentElement}/>
            )}
          </FormItem>
          <FormItem label={'重要人员'} className={styles.inputBtm}>
            {getFieldDecorator('zyry', {
              initialValue: zyry && zyry.userName
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label={'职务'} className={styles.inputBtm}>
            {getFieldDecorator('zw', {
              initialValue: zyry && zyry.zw
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label={'电话'} className={styles.inputBtm}>
            {getFieldDecorator('dh', {
              initialValue: zyry && zyry.lxdh,
              // rules:[{
              //   pattern: new RegExp(/^(\(\d{3,4}\)|\d{3,4}-)?\d{7,14}$/),
              //   message: '请输入正确的电话'
              // }]
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label={'客户上游'} className={styles.inputBtm}>
            {getFieldDecorator('khsy', {
              initialValue: sddcData && sddcData.khsy
            })(
              <TextArea placeholder="客户上游"/>
            )}
          </FormItem>
          <FormItem label={'客户下游'} className={styles.inputBtm}>
            {getFieldDecorator('khxy', {
              initialValue: sddcData && sddcData.khxy
            })(
              <TextArea placeholder="客户下游"/>
            )}
          </FormItem>
        </Form>
        <div className={styles.btnGroup}>
          <Button
            loading={loading}
            icon="save"
            type='primary'
            onClick={() => {
              this.onSave();
            }}
            size="small"
          >
            保存
          </Button>
          <Button
            loading={loading}
            className={styles.btn}
            type='primary'
            onClick={() => {
              this.onNext();
            }}
            size="small"
          >
            下一页
          </Button>
        </div>
      </div>
    );
  }
}
