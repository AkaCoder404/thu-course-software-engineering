import axios from "axios";
import { getToken, getUsername } from "./cookies";

//1. 创建实例 create instance
const service = axios.create({
    baseURL: "/devApi", //配置你要求的服务器地址
    timeout: 5000,
});

//2. 求拦截 interceptors, Add a request interceptor
service.interceptors.request.use(function (config) {
    // request之前的设置 token, username
    config.headers["Token"]= getToken();
    config.headers["Username"] = getUsername();
    return config;
    }, function (error) {
    // 收到error干什么
    return Promise.reject(error);
});

//3. 响应拦截 interceptors, Add a response interceptor
service.interceptors.response.use(function (response) {
    // 判断response是否正确的格式
    return response;
    }, function (error) {
    // 收到error干什么
    return Promise.reject(error);
});

export default service; 