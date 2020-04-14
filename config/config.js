// https://umijs.org/config/
import defaultSettings from '../src/defaultSettings';
import slash from 'slash2';
import path from 'path';

const { pwa, primaryColor } = defaultSettings;
const { APP_TYPE, TEST } = process.env;

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      routes: {
        exclude: [
          /data\//,
          /models\//,
          /services\//,
          /components\//,
        ],
      },
      locale: {
        enable: true, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './lib/PageLoading/index',
      },
      pwa: pwa
        ? {
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
          },
        }
        : false,
      ...(!TEST
        ? {
          dll: {
            include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch', 'react', 'react-dom'],
            exclude: ['@babel/runtime'],
          },
        }
        : {}),
    },
  ],
  [
    'umi-plugin-authorize',
    {
      authorize: [
        {
          guard: ['./gards/UserGard.js'],
          include: /\/.*/,
          exclude: /\/passport\/.*/,
        },
        {
          guard: ['./gards/AdminGard.js'],
          include: /\/uaa.*/,
        },
      ],
    },
  ],
];

const babel = {
  extraBabelIncludes: [path.resolve(__dirname, '../node_modules/casic-common')]
};

export default {
  // add for transfer to umi
  // history: 'hash',
  targets: {
    ie: 9,
  },
  plugins,
  ...babel,
  define: {
    APP_TYPE: APP_TYPE || '',
  },
  treeShaking: true,
  alias: {
    '@/lib': path.resolve(__dirname, '../src/lib/'),
    '@/data': path.resolve(__dirname, '../src/data/'),
    '@/utils': path.resolve(__dirname, '../src/utils/'),
    '@/layouts': path.resolve(__dirname, '../src/layouts/'),
    '@/assets': path.resolve(__dirname, '../src/assets/'),
    '@/constant': path.resolve(__dirname, '../src/constant/'),
    '@/components': path.resolve(__dirname, '../src/components/'),
    '@/services': path.resolve(__dirname, '../src/services/'),
  },
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
    'layout-header-height': '48px',
    'tabs-card-height': '30px',
    'tabs-bar-margin': 0,
    'modal-body-padding': 0
  },
  proxy: {
    '/gateway': {
      'target': 'http://gateway',
      'changeOrigin': true,
    },
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    camelCase: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        (context.resourcePath.includes('node_modules') && !context.resourcePath.includes('casic-common')) ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      if(context.resourcePath.includes('casic-common')){
        const match = context.resourcePath.match(/node_modules(.*)/);
        if (match && match[1]) {
          const casicCommon = match[1].replace('.less', '');
          const arr = slash(casicCommon)
            .split('/')
            .map(a => a.replace(/([A-Z])/g, '-$1'))
            .map(a => a.toLowerCase());
          return `__-${arr.join('-')}-${localName}`.replace(/--/g, '-');
        }
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `casic-${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  // chainWebpack: webpackPlugin,
  hash: true,
  externals: {
    '@antv/g2': 'G2',
    '@antv/data-set': 'DataSet',
    'bizcharts': 'BizCharts',
    'jquery': 'jQuery',
    '$': 'jQuery',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'moment': 'moment',
    "echarts": "echarts",
    "ztree": "ztree",
  },
};
