import service from "../utils/service";

import {Login, GetAccountInfo} from "../api/account.js";
import {ListAssets} from "../api/assets.js";
import {UserAddApi} from "../api/users.js";
import {UserInfoApi} from "../api/users.js";
import {GetUserListApi, DeleteUserApi, LockUserApi, ChangePasswordApi, ChangeGroupApi} from "../api/users.js";


// account api
test("login api function works", () => {
    expect(Login()).toStrictEqual(service.request({
        url: "/login/",
        method: "post",
        data: "", 
    })
    );
})

test("get account info api function works", () => {
    expect(GetAccountInfo()).toStrictEqual(service.request({
        url: "/staff_info/",
        method: "post",
        data: "", 
    })
    );
})

// asset list api
test("get asset list api function works", () => {
    expect(ListAssets()).toStrictEqual(service.request({
        url: "/asset_list/",
        method: "post",
        data: "", 
    })
    );
})

// user add api 
test("add user api function works", () => {
    expect(UserAddApi()).toStrictEqual(service.request({
        url: "/user_manage/create_new_staff/",
        method: "post",
        data: "", 
    })
    );
})

// user info api
test("user info api function works", () => {
    expect(UserInfoApi()).toStrictEqual(service.request({
        url: "/staff_info/",
        method: "post",
        data: "", 
    })
    );
})

//  user list api
test("user list api function works" , () => {
    expect(GetUserListApi()).toStrictEqual(service.request({
        url: "/staff_list/",
        method: "post",
        data: "", 
    })
    );
    expect(DeleteUserApi()).toStrictEqual(service.request({
        url: "/user_manage/delete_staff/",
        method: "post",
        data: "", 
    })
    );
    expect(LockUserApi()).toStrictEqual(service.request({
        url: "/user_manage/locked_staff/",
        method: "post",
        data: "", 
    })
    );
    expect(ChangePasswordApi()).toStrictEqual(service.request({
        url: "/user_manage/locked_staff/",
        method: "post",
        data: "", 
    })
    );
    expect(ChangeGroupApi()).toStrictEqual(service.request({
        url: "/user_manage/set_character/",
        method: "post",
        data: "", 
    })
    );

})
