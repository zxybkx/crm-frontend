import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import ReactEcharts from 'echarts-for-react';
import { message } from 'antd';

@connect((state) => ({
  home: state.home,
}))
export default class ProductZb extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getProductZb',
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
        text: '产品占比',
        x: 'left',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}：{c}({d}%)',
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        data: legened,
      },
      series: [
        {
          type: 'pie',
          radius: ['30%', '70%'],
          label: {
            normal: {
              position: 'inner',
              formatter: '{d}%',
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
          },
          itemStyle: {
            normal: {
              color: (params) => {
                //自定义颜色
                const colorList = ['#F5AA3D', '#FF784E'];
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
