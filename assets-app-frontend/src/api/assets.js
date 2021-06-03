import service from "../utils/service";

/*
获取资产列表接口
*/
export function ListAssets(data) {
    return service.request({
        url: "/asset_list/",
        method: "post",     
        data,          
    });
}

/*
获取简略资产列表接口
*/
export function AssetsLittleList(data) {
    return service.request({
        url: "/asset_list_title_value/",
        method: "post",     
        data,          
    });
}

/*
资产清退接口
*/
export function AssetsDelete(data) {
    return service.request({
        url: "/assets_delete/",
        method: "post",     
        data,          
    });
}


/*
获取单个资产信息接口
*/
export function AssetsInfo(data) {
    return service.request({
        url: "/asset_info/",
        method: "post",     
        data:data,          
    });
}
/*
搜索资产接口
*/
export function SearchAssets(data) {
    return service.request({
        url: "/search_assets/",
        method: "post",     
        data:data,          
    });
}

/*
获取单个资产信息接口
*/
export function ModifyAsset(data) {
    return service.request({
        url: "/modify_asset/",
        method: "post",     
        data:data,          
    });
}

/*
获取资产分类接口
*/
export function AssetsGroupTree(data) {
    return service.request({
        url: "/get_all_asset_group/",
        method: "post",     
        data:data,          
    });
}

/*
添加资产接口
*/
export function AssetsAdd(data) {
    return service.request({
        url: "/add_assets/",
        method: "post",     
        data:data,          
    });
}

/*
资产审批列表获取接口
*/
export function AssetsPendingList(data) {
    return service.request({
        url: "/asset_pending_list/",
        method: "post",     
        data:data,          
    });
}

/*
资产退库确认接口
*/
export function AssetsReturnAgree(data) {
    return service.request({
        url: "/assets_return/confirm/",
        method: "post",     
        data:data,          
    });
}

/*
资产转移确认接口
*/
export function AssetsTransferAgree(data) {
    return service.request({
        url: "/assets_transfer_to/confirm/",
        method: "post",     
        data:data,          
    });
}

/*
资产转移确认接口
*/
export function AssetsApplyAgree(data) {
    return service.request({
        url: "/assets_apply/confirm/",
        method: "post",     
        data:data,          
    });
}

/*
资产领用申请接口
*/
export function AssetsApply(data) {
    return service.request({
        url: "/assets_apply/",
        method: "post",     
        data:data,          
    });
}


export function StaffAssetApi(data) {
    return service.request({
        url: "/assets_of_staff_list/",
        method: "post",
        data:data
    })
}


export function SingleAssetHistoryApi(data) {
    return service.request({
        url: "/single_asset_history/",
        method: "post",
        data:data, 
    })
}

export function SearchAssetHistoryApi(data) {
    return service.request({
        url: "/search_assets_history/",
        method: "post",
        data:data, 
    })
}

export function ReturnAssetApi(data) {
    return service.request({
        url: "/assets_return_apply/",
        method: "post",
        data:data
    })
}

export function TransferAssetApi(data) {
    return service.request({
        url: "/assets_transfer_to_apply/",
        method: "post",
        data: data
    })
}

export function MaintainAssetRequestApi(data) {
    return service.request({
        url: "/assets_return_apply/",
        method: "post",
        data: data
    })
}

export function ManipulateAssetGroupApi(data) {
    return service.request({
        url: "/asset_group_tree/",
        method: "post",
        data:data
    })
}

export function RepairAssetApplyApi(data) {
    return service.request({
        url: "/assets_repair_apply/",
        method: "post",
        data: data
    })
}

export function RepairAssetFinishApi(data) {
    return service.request({
        url: "/asset_repair_finish/",
        method: "post",
        data: data
    })
}