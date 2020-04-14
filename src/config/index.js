import app from './application';
import dev from './application.dev';
import prod from './application.prod';

const env = process.env.NODE_ENV;

let config = {};
if(env === 'development'){
  config = Object.assign({}, app, dev);
}else{
  config = Object.assign({}, app, prod);
}

const Config = {
  get: (key) =>{
    if (key !== '/') {
      let newkey = key.replace(/\/+/g, '/');
      newkey = newkey.replace(/^\//i, '');
      newkey = newkey.replace(/\/$/, '');
      let keys = newkey.split('/');
      let value = keys.reduce(function (json, k) {
        return json[k];
      }, config);
      return value;
    }
    return '';
  },
};

export default Config;
