/* istanbul ignore file */
const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(createProxyMiddleware("/devApi", {
        // target: "http://39.106.73.191:38459/api", //配置后端服务器地址
        target: "https://assets-app-backend-marteam.app.secoder.net/api",
        changeOrigin:true, 
        pathRewrite: {
            "^/devApi": "",
        }  
    }))
};