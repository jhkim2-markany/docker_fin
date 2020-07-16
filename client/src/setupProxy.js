const { createProxyMiddleware } = require('http-proxy-middleware');
const ip = require("ip");

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({ //프론트엔드 포트번호 3000번에서 5000으로 주겠다
      target: `http://${ip.address()}:5000`,   //이거 일단 못받음
      // target: 'http://192.168.99.100:5000',
      // target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};