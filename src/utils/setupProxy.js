const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://angelboo.store/', // 백엔드 API 서버 주소
      changeOrigin: true,
    })
  );
};