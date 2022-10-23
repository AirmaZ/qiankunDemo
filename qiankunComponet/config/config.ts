import { defineConfig } from 'umi';
import routes from './routes';
import moment from 'moment';
import ESLintPlugin from 'eslint-webpack-plugin';
import nunjucks from 'nunjucks';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name, version, description, author } = require('../package.json');

// 使用模板渲染
const LICENSE = nunjucks.render('LICENSE', {
  name: name,
  version: version,
  description: description,
  author: author,
  date: moment().format('YYYY-MM-DD HH:mm:ss'),
});

export default defineConfig({
  chainWebpack: (config: any, { webpack }) => {
    config.merge({
      optimization: {
        splitChunks: {
          cacheGroups: {
            // 组件库相关
            react: {
              name: 'react',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
              priority: 12,
            },
            antd: {
              name: 'antd',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
              priority: 10,
            },
          },
        },
      },
    });
    config
      .plugin('eslint')
      .use(ESLintPlugin, [
        {
          extensions: ['js', 'jsx', 'ts', 'tsx'], // 不再使用use
          fix: true,
          emitError: true,
          emitWarning: true,
        },
      ])
      .end();
    config
      .plugin('BannerPlugin')
      .use(webpack.BannerPlugin, [
        {
          banner: LICENSE,
          raw: true,
        },
      ])
      .end();
  },
  chunks: ['react', 'antd', 'umi'],
  qiankun: {
    slave: {},
  },
  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },
  // layout:{},
  // layout:
  //   process.env.NODE_ENV === 'development'
  //     ? {
  //         name: 'HIHIS医疗单',
  //       }
  //     : false,
  antd: {
    // compact: true,
  },
  routes: routes,
  history: { type: 'memory' },
  hash: true,
  fastRefresh: {},
  // dynamicImport: {},
  devtool: 'source-map',
  publicPath: './',
  // mfsu: {},
  // base:'/resources/webapp/enr',
  proxy: {
    '/api': {
      // target: 'http://10.1.0.117:10082/opdoc',
      // target: 'http://10.1.3.102:10082/opdoc',
      // target: 'http://10.10.0.25:10082/opdoc',
      // target: 'http://10.10.0.23',
      target: 'http://10.10.0.24',
      changeOrigin: true,
      // pathRewrite: { '^/api': '' },
    },
    '/mock': {
      target: 'http://10.10.0.23:8012',
      changeOrigin: true,
    },
  },
});
