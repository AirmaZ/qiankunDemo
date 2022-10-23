const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/static/hihis-fe-medBill',
    createProxyMiddleware({
      target: 'http://10.10.0.23',
      changeOrigin: true,
    })
  );
};
