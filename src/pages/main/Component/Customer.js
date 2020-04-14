import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import ReactEcharts from 'echarts-for-react';
import { message } from 'antd';

@connect((state) => ({
  home: state.home,
}))
export default class Customer extends PureComponent{
  constructor(props){
    super(props);
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'home/getCustomerNumber',
      payload: {
        startDate: '2019-01-01',
        endDate: '2019-12-31'
      }
    }).then(({success, data, message}) => {
      if(success && data) {
        this.setState({
          data
        })
      }else{
        message.error(message)
      }
    })
  }

  render() {
    const {data} = this.state;
    let xAxis = [];
    let yAxis = [];

    data.map((item) => {
      const key = _.keys(item);
      xAxis.push(key[0]);
      const value = item[key];
      yAxis.push(value)
    });

    const option = {
      title: {
        text: '客户增长情况',
        left: 'left',
      },
      tooltip: {
        trigger: 'axis',
        formatter: '月增：{c}',
      },
      legend: {
        data: ['当月增长数量']
      },
      xAxis: {
        type: 'category',
        data: xAxis,
        axisLabel: {
          // interval: 0,
          // fontSize: 10
          // rotate: 60
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: '当月增长数量',
        itemStyle: {
          color: '#47CC7C'
        },
        data: yAxis,
        type: 'bar'
      }]
    };
    return(
      <ReactEcharts
        style={{ background: '#fff', height: '100%' }}
        option={option}
        notMerge={true}/>
    )
  }
}
