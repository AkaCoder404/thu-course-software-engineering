import React, { Component } from "react";
import { Avatar, Descriptions, Form } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { colors } from "../../../utils/colors" 

class PersonalInfo extends Component {
    constructor(props){
        super();
        this.state = {};
    }

    componentDidMount = () => { this.loadData(); }
    loadData = () => {};

    render() {
        return (
            <div>
                <div className = "user-info-TabPane">
                    <Avatar className="user-avatar" 
                        style={{backgroundColor: colors[this.props.userInfo.group]}}
                        size={100}  
                        icon={<UserOutlined/>} />
                    <br></br>
                    <br></br>
                    <Descriptions title={this.props.userInfo.display_name} layout="vertical"></Descriptions>
                </div>
                <div className="user-info-display">               
                    <Form >
                        <Form.Item> {<UserOutlined/>} 用户账号: {this.props.userInfo.username} </Form.Item>
                        <Form.Item> {<UserOutlined/>} 部门名字: {this.props.userInfo.department}</Form.Item>
                        <Form.Item> {<UserOutlined/>} 用户分类: {this.props.userInfo.group} </Form.Item>
                        {/* <Form.Item> {<UserOutlined/>} Remark: </Form.Item> */}
                    </Form>
                </div>
            </div>
        );
    }
}
export default PersonalInfo;