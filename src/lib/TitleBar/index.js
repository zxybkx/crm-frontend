import React, { PureComponent } from 'react';
import { Icon} from 'antd';
import styles from './index.less';


export default class TitleBar extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      style = {},
      title,
      showIcon = false,
      icon = { icon: 'bars', color: '#0096ff' },
    } = this.props;

    return (
      <div className={styles.default} style={style}>
        {
          showIcon &&
          <div className={styles.icon} style={{ background: icon.color, borderColor: icon.color }}>
            <Icon type={icon.icon}/>
          </div>
        }
        <div className={styles.title}>{title}</div>
      </div>
    );
  }

}
