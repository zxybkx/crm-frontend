import React from 'react';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import {Exception} from 'casic-common';

export default () => (
  <Exception
    type="500"
    linkElement={Link}
    desc={formatMessage({ id: 'app.exception.description.500' })}
    backText={formatMessage({ id: 'app.exception.back' })}
  />
);
