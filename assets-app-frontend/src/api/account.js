import service from "../utils/service";

/**
* 登录接口
*/
export function Login(data) {
    return service.request({
        url: "/login/",
        method: "post",
        data, 
    });
}

/**
 * 用户信息接口
*/
export function GetAccountInfo(data) {
    return service.request({
            url: "/staff_info/",
            method: "post",     
            data,         
        }
    );
}

