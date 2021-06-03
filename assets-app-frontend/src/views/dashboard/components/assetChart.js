// reusable code for asset chart
import { message } from "antd";
import { ListAssets } from "../../../api/assets";
import { getToken } from "../../../utils/cookies";

export async function loadAllAssets() {
    const data = {"token": getToken()};
    var assetStatus = [0, 0, 0, 0, 0, 0, 0, 0];
    await ListAssets(data).then(response => {
        if ( response.data.code === 0 ) {
            for (let i = 0; i < response.data.data.length; i = i + 1) {
                switch(response.data.data[i].status_name) {
                    case "未使用": { assetStatus[0] = assetStatus[0] + 1; break;}
                    case "使用中": { assetStatus[1] = assetStatus[1] + 1; break;}
                    case "领用待确认": {assetStatus[2] = assetStatus[2] + 1; break;} 
                    case "已清退": {assetStatus[3] = assetStatus[3] + 1; break;} 
                    case "退库待确认": {assetStatus[4] = assetStatus[4] + 1; break;}
                    case "转移待取人" : {assetStatus[5] = assetStatus[5] + 1; break;}
                    case "维保申请" : {assetStatus[6] = assetStatus[6] + 1; break;}
                    default : assetStatus[7] = assetStatus[7] + 1;
                }
            }
        }
        else { message.error(response.data.message);}
    }).catch(error=> {message.error(error.toString());});  
    return assetStatus;
}