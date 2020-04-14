import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import ReactEcharts from 'echarts-for-react';
import { message } from 'antd';

@connect((state) => ({
  home: state.home,
}))
export default class BusinessSpread extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getBusinessSpread',
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
    let legened = [];
    data.map(item => {
      const key = item.name;
      legened.push(key);
    });

    const option = {
      title: {
        text: '商机分布图',
        x: 'left',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}：{c}',
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        data: legened,
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          label: {
            normal: {
              formatter: '{c}',
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
          },
          itemStyle: {
            normal: {
              color: (params) => {
                //自定义颜色
                const colorList = ['#594C9D', '#F9B56D', '#F78662', '#7ACA4D', '#1AB0F3', '#9D8A59'];
                return colorList[params.dataIndex];
              },
            },
          },
          data: data,
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
