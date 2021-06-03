import cookies from "react-cookies";

const token = "adminToken";
const username = "username";

export function setToken(value) {
    cookies.save(token, value);
}

export function getToken() {
    return cookies.load(token);
}

export function setUsername(value){
    cookies.save(username,value);
}

export function getUsername(){
    return cookies.load(username);
}

export function removeTokenCookie(value) {
    cookies.remove(token);
}

export function removeUserCookie(value) {
    cookies.remove(username);
}

