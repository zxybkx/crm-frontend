import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import ReactEcharts from 'echarts-for-react';
import { message } from 'antd';

@connect((state) => ({
  home: state.home,
}))
export default class BusinessNumber extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getBusinessNumber',
      payload: {
        startDate: '2019-01-01',
        endDate: '2019-12-31',
      },
    }).then(({ success, data, message }) => {
      if (success && data) {
        this.setState({
          data,
        });
      } else {
        message.error(message);
      }
    });
  }

  render() {
    const { data } = this.state;
    let xAxis = [];
    let yAxis = [];

    data.map((item) => {
      const key = _.keys(item);
      xAxis.push(key[0]);
      const value = item[key];
      yAxis.push(value);
    });
    const option = {
      title: {
        text: '商机数量',
        left: 'left',
      },
      tooltip: {
        trigger: 'axis',
        formatter: '数量：{c}',
      },
      legend: {
        data: ['当月增长数量'],
      },
      xAxis: {
        type: 'category',
        data: xAxis,
        axisLabel: {
          // interval: 0,
          // rotate: 60,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [{
        name: '当月数量',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                { offset: 0, color: '#13BCFF' },
                { offset: 0.5, color: '#448AFF' },
              ],
            ),
          },
        },
        data: yAxis,
        type: 'bar',
      }],
    };
    return (
      <ReactEcharts
        style={{ background: '#fff',height: '100%' }}
        option={option}
        notMerge={true}/>
    );
  }
}
