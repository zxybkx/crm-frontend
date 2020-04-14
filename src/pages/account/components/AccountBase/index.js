import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Divider, Icon, Input, Row, Spin, Tag } from 'antd';
import styles from './index.less';

class UserInfo extends PureComponent {
  state = {
    newTags: [],
    inputVisible: false,
    inputValue: '',
  };

  componentDidMount() {
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  saveInputRef = input => {
    this.input = input;
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let { newTags } = state;
    if (inputValue && newTags.filter(tag => tag.label === inputValue).length === 0) {
      newTags = [...newTags, { key: `new-${newTags.length}`, label: inputValue }];
    }
    this.setState({
      newTags,
      inputVisible: false,
      inputValue: '',
    });
  };

  render() {
    const { newTags = [], inputVisible, inputValue } = this.state;
    const {
      currentUser = {
        tags: [],
      },
      currentUserLoading,
      projectLoading,
    } = this.props;


    return (
      <div>
        {currentUser && Object.keys(currentUser).length ? (
          <div>
            <div className={styles.avatarHolder}>
              <img alt="" src={currentUser.avatar}/>
              <div className={styles.name}>{currentUser.name}</div>
              <div>{currentUser.signature}</div>
            </div>
            <div className={styles.detail}>
              <p>
                <i className={styles.title}/>
                {currentUser.title}
              </p>
              <p>
                <i className={styles.group}/>
                {currentUser.group}
              </p>
              <p>
                <i className={styles.address}/>
              </p>
            </div>
            <Divider dashed/>
            <div className={styles.tags}>
              <div className={styles.tagsTitle}>标签</div>
              {currentUser.tags.concat(newTags).map(item => (
                <Tag key={item.key}>{item.label}</Tag>
              ))}
              {inputVisible && (
                <Input
                  ref={this.saveInputRef}
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={inputValue}
                  onChange={this.handleInputChange}
                  onBlur={this.handleInputConfirm}
                  onPressEnter={this.handleInputConfirm}
                />
              )}
              {!inputVisible && (
                <Tag
                  onClick={this.showInput}
                  style={{ background: '#fff', borderStyle: 'dashed' }}
                >
                  <Icon type="plus"/>
                </Tag>
              )}
            </div>
            <Divider style={{ marginTop: 16 }} dashed/>
            <div className={styles.team}>
              <div className={styles.teamTitle}>团队</div>
              <Spin spinning={projectLoading}>
                <Row gutter={36}>
                </Row>
              </Spin>
            </div>
          </div>
        ) : (
          'loading...'
        )}
      </div>
    );
  }
}

export default UserInfo;
