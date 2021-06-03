import React, { Component } from "react";
import { message,  Tabs} from "antd";
import { getToken } from "../../utils/cookies";
import { UserInfoApi } from "../../api/users";
import { GetUserListApi } from "../../api/users";
import PersonalAssetListTable from "../assets/components/PersonalAssetList";
import PersonalInfo from "./components/personalInfo";
import { AppstoreOutlined, UserOutlined} from '@ant-design/icons';
import "./index.scss";
const { TabPane } = Tabs;

class About extends Component {
    constructor(){
        super();
        this.state = {
            userInfo: [],
            userList: []
        };
    }
    // 生命周期，多一层接口请求
    componentDidMount(){ this.loadData(); }
    // 求数据
    loadData = () => {
        const data = {"token": getToken()};
        UserInfoApi(data).then(response => {
            if(response.data.code === 0) {
                this.setState({ userInfo: response.data.user });
            }
        }).catch(error=>{message.error(error.toString());})

        const temp = [];
        GetUserListApi(data).then(response => {
            if(response.data.code === 0) {
                for (let i = 0; i < response.data.data.length; i = i + 1) {
                    temp.push({"key": response.data.data[i].unique_id, 
                                "display_name": response.data.data[i].display_name});
                }
                this.setState({userList: temp})
            }
        }).catch(error=>{ message.error(error.toString());});
    }    
    
    render(){
        const { userInfo, userList} = this.state;
        return (
            <div className="user-info-layout">
                <Tabs defaultActiveKey="1">
                    <TabPane tab={<span> <UserOutlined/> 个人用户信息 </span>} key="1">
                        <PersonalInfo userInfo={userInfo}></PersonalInfo>
                    </TabPane>
                    <TabPane tab={<span> <AppstoreOutlined/> 个人资产列表 </span>} key="2" >
                        <PersonalAssetListTable userInfo={userInfo}
                            userList={userList}></PersonalAssetListTable>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
export default About;