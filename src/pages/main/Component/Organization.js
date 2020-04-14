import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import ReactEcharts from 'echarts-for-react';
import { message } from 'antd';

@connect((state) => ({
  home: state.home,
}))
export default class Organization extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getOrganization',
    }).then(({ success, data, message }) => {
      if (success && data) {
        this.setState({ data });
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
      xAxis.push(item.value);
      yAxis.push(item.name);
    });
    const option = {
      title: {
        text: '部门产品数量',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        x: 120,
        y: 40,
        x2: 20,
        y2: 30
      },
      xAxis: {
        type: 'value',
      },
      barWidth: 40,
      yAxis: {
        type: 'category',
        data: yAxis,
      },
      series: [
        {
          type: 'bar',
          data: xAxis,
          itemStyle: {
            color: '#657796',
          },
        },
      ],
    };
    return (
      <ReactEcharts
        style={{ background: '#fff', height: '100%' }}
        option={option}
        notMerge={true}/>
    );
  }
}
