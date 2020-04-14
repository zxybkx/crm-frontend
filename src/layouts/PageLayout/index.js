import React from 'react';
import classNames from 'classnames';
import {GlobalBreadcrumb} from 'casic-common';
import styles from './index.less';

export default class PageLayout extends React.Component{
  render(){
    const {style = {}, children, className = '', breadcrumb = []} = this.props;
    return (
      <div className={classNames(styles.default, className)} style={style}>
        {
          !_.isEmpty(breadcrumb) && <GlobalBreadcrumb items={breadcrumb}/>
        }
        {children}
      </div>
    );
  }
}
