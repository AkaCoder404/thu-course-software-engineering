import service from "../utils/service";

export function DepartmentCreateApi(data) {
    return service.request({
        url: "/department/create/",
        method: "post",
        data, 
    });
}

export function DepartmentDeleteApi(data) {
    return service.request({
        url: "/department/delete/",
        method: "post",
        data, 
    });
}

export function DepartmentInfoApi(data) {
    return service.request({
        url: "/department/info/",
        method: "post", 
        data,
    })
}

export function DepartmentModifyApi(data) {
    return service.request({
        url: "/department/modify/",
        method: "post",
        data,
    })
}


export function DepartmentAllApi(data) {
    return service.request({
        url: "/department/all/",
        method: "post",
        data,
    })
}