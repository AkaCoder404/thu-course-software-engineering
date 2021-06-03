import service from "../utils/service";

// add user
export function UserAddApi(data) {
    return service.request({
        url: "/user_manage/create_new_staff/",
        method: "post",
        data
    });
}

// get user info
export function UserInfoApi(data) {
    return service.request({
        url: "/staff_info/",
        method: "post",
        data
    });
}

// 连接到接口get user list 
export function GetUserListApi(data) {
    return service.request({
        url: "/staff_list/",
        method: "post",
        data
    });
}

// 连接到接口delete a user
export function DeleteUserApi(data) {
    return service.request({
        url:"/user_manage/delete_staff/",
        method:"post",
        data
    });
}
// lock/unlock user
export function LockUserApi(data) {
    return service.request({
        url: "/user_manage/locked_staff/",
        method: "post",
        data
    });
}

// change user password
export function ChangePasswordApi(data) {
    return service.request({
        url: "/user_manage/change_staff_password/",
        method: "post",
        data
    });
}

// change user group
export function ChangeGroupApi(data) {
    return service.request({
        url: "/user_manage/set_character/",
        method: "post",
        data
    });
}

