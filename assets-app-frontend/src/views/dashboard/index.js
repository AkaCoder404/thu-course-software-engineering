import React, { Component, Fragment } from "react";
import { Divider,Space, message} from 'antd';
import { getToken } from "../../utils/cookies";
import { UserInfoApi} from "../../api/users";
import CardUserDistribution from "./components/cardUserDistribution";
import CardAssetStatusDistribution from "./components/cardAssetStatusDistribution";
import ApproveList from "./components/approveList"
import "./index.scss"

class Dashboard extends Component {
    constructor(){
        super();
        this.state = {
            userInfo: [],
            userListInfo: [],
        };
    }

    componentDidMount() { this.loadData(); };

    loadData = () => {
        const token = {"token" : getToken()};      
        UserInfoApi(token).then(response => {
            if(response.data.code === 0) {
                this.setState({ userInfo: response.data.user,});                      
            }
        }).catch(error => { message.error(error.toString()); });
    };

    render(){
        return (
            <Fragment>
                <ApproveList/>
                <Divider></Divider>
                
                <Space className= "chart-display-row" 
                    direction="horizontal" size={12} >
                    <CardUserDistribution
                        title={"用户分类比例"}
                        popContent={"Card 1"}>
                    </CardUserDistribution>
                    {/* <CardAssetDistribution
                        title={"资产分类比例"}
                        popContent={"Card 2"}>
                    </CardAssetDistribution> */}
                    <CardAssetStatusDistribution
                        title={"资产状态分类"}
                        popContent={"Card 3"}>
                    </CardAssetStatusDistribution>
                </Space>
            </Fragment>
        );
    }
}
export default Dashboard;


