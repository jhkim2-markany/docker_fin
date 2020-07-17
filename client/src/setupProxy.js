const { createProxyMiddleware } = require('http-proxy-middleware');
const ip = require("ip");

module.exports = function(app) {
  app.use(
    '/api',
    
    createProxyMiddleware({ //프론트엔드 포트번호 3000번에서 5000으로 주겠다
      target: `http://${ip.address()}:5000`,   //도커용?
      // target: 'http://192.168.99.100:5000',
      // target: 'http://localhost:5000',      //로컬용
      changeOrigin: true,
    })
  );
};


