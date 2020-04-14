import React, {PureComponent} from 'react';
import {Row, Col, Table, Button, Collapse} from 'antd';
import {connect} from 'dva';
import _ from 'lodash';
import {routerRedux} from 'dva/router';
import PageLayout from '@/layouts/PageLayout';
import styles from './pfbmb.less';

const {Panel} = Collapse;
const breadcrumbs = [
  { icon: 'home', path: '/' },
  { label: '系统管理', path: '/setting' },
  { label: '评分表', path: '/setting/pgbManage' },
  { label: '查看' },
];
@connect((khpg) => ({
  khpg
}))
export default class Pgbmb extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pgbData: {},       //评估表数据
    }
  }

  componentDidMount() {
    const {dispatch, location: {query: {id}}} = this.props;
    dispatch({
      type: 'khpg/editTemplate',
      payload: {id: id}
    }).then(({success, data}) => {
      if (success && data) {
        this.setState({
          pgbData: data
        })
      }
    })
  }

  getTableHeight = () => {
    const clientHeight = document.body.clientHeight;
    return clientHeight - 340;
  };

  renderCell = () => {
    const columns = [{
      title: '序号',
      dataIndex: 'rownumber',
      width: '10%'
    }, {
      title: '评分项',
      dataIndex: 'gz',
      width: '15%',
      render: (value, row) => {
        return (
          <span>{row.items.pgx}</span>
        )
      }
    }, {
      title: '总分',
      dataIndex: 'zf',
      width: '15%',
      render: (value, row) => {
        return (
          <span>{row.items.zf}</span>
        )
      }
    }, {
      title: '评分内容与评分标准',
      dataIndex: 'item',
      width: '30%',
      render: (value, row) => {
        return (
          <div>
            {row.items.mx.map((o, i) => {
              return (
                <span key={o}>
                  {'（'}{i + 1}{'）、'}{o}
                  {i + 1 === row.items.mx.length ? '' : <br/>}
                  </span>
              )
            })}
          </div>
        )
      }
    }, {
      title: '业务打分',
      dataIndex: 'ywpf',
      width: '15%',
    }, {
      title: '最终评分',
      dataIndex: 'zgpf',
    }];
    return columns;
  };

  renderTableFooter = () => {
    return (
      <div>
        <Row >
          <Col span={6}>
            <span>小计</span>
          </Col>
          <Col span={2} offset={11}>
            <span></span>
          </Col>
          <Col span={2} offset={2}>
            <span></span>
          </Col>
        </Row>
      </div>
    )
  };

  //修改
  edit = () => {
    const {dispatch} = this.props;
    const {pgbData} = this.state;
    dispatch(
      routerRedux.push({
        pathname: '/setting/pgbManage/PointList/pfb',
        query: {
          id: pgbData.id,
        }
      })
    )
  };

  render() {
    const {pgbData} = this.state;
    const tableDatas = _.groupBy(pgbData.crmTemplateItems, 'groupby');

    return (
      <PageLayout className={styles.default} breadcrumb={breadcrumbs}>
        <div className={styles.content}>
          <div>
            {
              <Button type="primary"
                      onClick={() => {
                        this.edit()
                      }}
                      size={'small'}
                      icon={'edit'}
                      className={styles.btn}>
                修改</Button>
            }
            {
              _.map(tableDatas, (v, k) => {
                const data = _.filter(v, item => {
                  if (item.items) {
                    return (item.groupby === k)
                  }
                });

                let _list = [];
                if (data) {
                  _list = data.map((d, idx) => {
                    d.rownumber = idx + 1;
                    return d;
                  });
                }

                return (
                  <div style={{padding: 6}} key={k}>
                    <Collapse defaultActiveKey={pgbData.crmTemplateItems[0].groupby===''?'1':pgbData.crmTemplateItems[0].groupby}>
                      <Panel header={<span>{!k?'---  请添加标题  ---':k}</span>} key={k===''?'1':k}>
                        <Table scroll={{y: this.getTableHeight()}}
                               dataSource={_list}
                               columns={this.renderCell()}
                               rowClassName={(record, index) => index % 2 === 0 ? styles.lel : ''}
                               pagination={false}
                               rowKey={(record) => record.id}
                               footer={this.renderTableFooter}
                               bordered/>
                      </Panel>
                    </Collapse>
                  </div>
                )
              })
            }
          </div>
        </div>
      </PageLayout>
    )
  }
}
