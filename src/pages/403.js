import React from 'react';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import {Exception} from 'casic-common';

export default () => (
  <Exception
    type="403"
    linkElement={Link}
    redirect={'/passport/sign-in'}
    desc={formatMessage({ id: 'app.exception.description.403' })}
    backText={formatMessage({ id: 'app.exception.login' })}
  />
);
