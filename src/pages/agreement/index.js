import React, { PureComponent } from 'react';
import { Button, Table } from 'antd';
import PageLayout from '@/layouts/PageLayout';
import LineWrap from '@/components/LineWrap';
import { connect } from 'dva';
import _ from 'lodash';
import styles from './index.less';
import { AdvancedSearch, ToolBar } from 'casic-common';

const breadcrumbs = [
  { icon: 'home', path: '/' },
  { label: '合同管理', path: '/agreement' },
];
@connect((state) => ({
  agreement: state.agreement,
  loading: state.loading.effects['agreement/getDataLIst'],
}))
export default class Agreement extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      page: 0,
      pageSize: 10,
      total: 0,
      current: 1,
      params: {},
    };
  }

  componentDidMount() {
    const params = {
      page: 0,
      size: 10,
    };
    this.loadData(params);
  }

  loadData = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'agreement/getDataLIst',
      payload: params,
    }).then(({ success, data, page }) => {
      if (success && data) {
        this.setState({
          params,
          dataList: data,
          total: page ? page.total : 0,
          current: params && params.page ? parseInt(params.page) + 1 : 1,
          pageSize: params && params.size ? parseInt(params.size) : 10,
        });
      }
    });
  };

  getDataColumns = () => {
    const column = [{
      title: '合同类型描述',
      dataIndex: 'b6',
      width: 130,
      onCell: () => {
        return {
          style: {
            maxWidth: 140,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      fixed: 'left',
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '采购合同',
      dataIndex: 'b2',
      width: 80,
      onCell: () => {
        return {
          style: {
            maxWidth: 80,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '销售合同',
      dataIndex: 'b3',
      width: 80,
      onCell: () => {
        return {
          style: {
            maxWidth: 80,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '外部协议号',
      dataIndex: 'b4',
      width: 90,
      onCell: () => {
        return {
          style: {
            maxWidth: 90,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '合同类型',
      dataIndex: 'b5',
      width: 90,
      onCell: () => {
        return {
          style: {
            maxWidth: 90,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '贸易合同号',
      dataIndex: 'b1',
      width: 90,
      onCell: () => {
        return {
          style: {
            maxWidth: 90,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '合同创建日期',
      dataIndex: 'b7',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '销售组织',
      dataIndex: 'b8',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '销售组织描述',
      dataIndex: 'b9',
      width: 110,
      onCell: () => {
        return {
          style: {
            maxWidth: 110,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '公司代码',
      dataIndex: 'b10',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '客户编码',
      dataIndex: 'b11',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '客户名称',
      dataIndex: 'b12',
      width: 200,
      onCell: () => {
        return {
          style: {
            maxWidth: 200,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '供应商编码',
      dataIndex: 'b13',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '供应商名称',
      dataIndex: 'b14',
      width: 200,
      onCell: () => {
        return {
          style: {
            maxWidth: 200,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '采购组织',
      dataIndex: 'b15',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '采购组织描述',
      dataIndex: 'b16',
      width: 110,
      onCell: () => {
        return {
          style: {
            maxWidth: 110,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '采购组',
      dataIndex: 'b17',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '采购组描述',
      dataIndex: 'b18',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '采购订单',
      dataIndex: 'b19',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '采购订单含税总额',
      dataIndex: 'b20',
      width: 90,
      onCell: () => {
        return {
          style: {
            maxWidth: 90,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '采购订单税额',
      dataIndex: 'b21',
      width: 90,
      onCell: () => {
        return {
          style: {
            maxWidth: 90,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '采购订单净值',
      dataIndex: 'b22',
      width: 90,
      onCell: () => {
        return {
          style: {
            maxWidth: 90,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '采购订单货币',
      dataIndex: 'b23',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '采购入库过账日期',
      dataIndex: 'b24',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '采购入库发票凭证号',
      dataIndex: 'b25',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '采购入库金额',
      dataIndex: 'b26',
      width: 90,
      onCell: () => {
        return {
          style: {
            maxWidth: 90,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '发票预制含税金额',
      dataIndex: 'b27',
      width: 90,
      onCell: () => {
        return {
          style: {
            maxWidth: 90,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '发票预制退税额',
      dataIndex: 'b28',
      width: 100,
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '发票过账会计凭证号',
      dataIndex: 'b29',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '采购发票过账日期',
      dataIndex: 'b30',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '发票过账含税总额',
      dataIndex: 'b31',
      width: 100,
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '发票过账退税总额',
      dataIndex: 'b32',
      width: 100,
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '销售订单号',
      dataIndex: 'b33',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '销售订单含税总额',
      dataIndex: 'b34',
      width: 100,
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '销售订单税额',
      dataIndex: 'b35',
      width: 100,
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '销售订单净值',
      dataIndex: 'b36',
      width: 100,
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '销售订单货币',
      dataIndex: 'b37',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '销售出库过账日期',
      dataIndex: 'b38',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '销售出库会计凭证',
      dataIndex: 'b39',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '销售出库金额',
      dataIndex: 'b40',
      width: 100,
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '销售开票申请含税金额',
      dataIndex: 'b41',
      width: 100,
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '销售开票申请税额',
      dataIndex: 'b42',
      width: 100,
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '销售开票申请净值',
      dataIndex: 'b43',
      width: 100,
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '销售开票过账日期',
      dataIndex: 'b44',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '销售开票会计凭证',
      dataIndex: 'b45',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '销售开票原币含税金额',
      dataIndex: 'b46',
      width: 100,
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '销售开票对应人民币金额',
      dataIndex: 'b47',
      width: 100,
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '销售开票税额',
      dataIndex: 'b48',
      width: 100,
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '入库出库差异',
      dataIndex: 'b49',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '金税发票号码',
      dataIndex: 'b50',
      width: 100,
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '认证日期',
      dataIndex: 'b51',
      width: 80,
      onCell: () => {
        return {
          style: {
            maxWidth: 80,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '认证金额',
      dataIndex: 'b52',
      width: 100,
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '认证税额',
      dataIndex: 'b53',
      width: 100,
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '认证结果',
      dataIndex: 'b54',
      width: 90,
      onCell: () => {
        return {
          style: {
            maxWidth: 90,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '实际退税金额',
      dataIndex: 'b55',
      width: 100,
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '收汇认领金额',
      dataIndex: 'b56',
      width: 100,
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '收汇认领货币',
      dataIndex: 'b57',
      width: 70,
      onCell: () => {
        return {
          style: {
            maxWidth: 70,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '天浩回款金额',
      dataIndex: 'b58',
      width: 100,
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '结算客户',
      dataIndex: 'b59',
      width: 100,
      onCell: () => {
        return {
          style: {
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    },{
      title: '结算客户名称',
      dataIndex: 'b60',
      width: 200,
      onCell: () => {
        return {
          style: {
            maxWidth: 200,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={1}/>
      }
    }];
    return column;
  };

  handleTableChange = ({ current, pageSize }) => {
    const { params } = this.state;
    this.loadData({
      ...params,
      page: current - 1,
      size: pageSize,
    });
  };

  render() {
    const { loading } = this.props;
    const { dataList, total, pageSize, current } = this.state;
    const searchFields = [];

    let _list = [];
    if (dataList) {
      _list = dataList.map((d, idx) => {
        d.key = idx;
        d.rownumber = pageSize * (current - 1) + idx + 1;
        return d;
      });
    }

    const paginationProps = {
      showSizeChanger: true,
      total, pageSize, current,
      showTotal: (total, range) => `当前-${range[0]}-${range[1]}, 共${total}条`,
    };

    return (
      <PageLayout breadcrumb={breadcrumbs} className={styles.default}>
        <div className={styles.contain}>
          <div className={styles.content}>
            <ToolBar search={<AdvancedSearch useFilter={false} onSearch={this.handleSearch} fields={searchFields}/>}/>
            <Table
              dataSource={_list}
              pagination={paginationProps}
              columns={this.getDataColumns()}
              loading={loading}
              rowKey={(record) => record.id}
              rowClassName={(record, index) => index % 2 === 0 ? styles.lel : ''}
              bordered
              onChange={this.handleTableChange}
              scroll={{x: 1500}}
            />
          </div>
        </div>
      </PageLayout>
    );
  }
}
