// 安全性的登录
const tokenAdmin = "adminToken";

export function setSessionToken(value) {
    sessionStorage.setItem(tokenAdmin, value)
}

export function getSessionToken() {
    return sessionStorage.getItem(tokenAdmin);
}