import { PureComponent } from 'react';
import {Iframe, session as Session } from 'casic-common';
import { DOMAIN_HR } from '@/constant';

export default class Messages extends PureComponent{

  render() {
    const session = _.assign({}, Session.get());
    const token = session.access_token || session.token;
    const url = `${DOMAIN_HR}?_k=${token}&q=w&back_url=/employee/mine`;

    return (
      <Iframe url={url}/>
    );
  }
}

