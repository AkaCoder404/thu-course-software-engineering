import React, { Component } from "react";
import { MenuFoldOutlined, LogoutOutlined} from "@ant-design/icons";
import {Avatar, Menu, Dropdown, message } from "antd";
import { withRouter } from 'react-router-dom';
import {UserOutlined} from '@ant-design/icons';
import { removeTokenCookie, removeUserCookie, getToken } from "../../../utils/cookies";
import { UserInfoApi } from "../../../api/users";
import { colors } from "../../../utils/colors";
import "./globalheader.scss";

class LayoutHeader extends Component {
    constructor(props){
        super(props);
        this.state = {
            collapsed: props.collapsed,
            username: "",
            group: "",
            color: colors["企业普通员工"]
        };
    }
    // 生命周期，监听父级 props 的值变化
    componentWillReceiveProps({ collapsed }){
        this.setState({
            collapsed
        });
    }

    componentWillMount() {
        this.loadInfo();
    }
    
    loadInfo = () => {
        const data = {"token" : getToken()};
        UserInfoApi(data).then(response => {
            this.setState({ 
                username: response.data.user.display_name, 
                group: response.data.user.group, 
                color: colors[response.data.user.group] });
        }).catch(error => { message.error(error.toString()); });
        
    }
    toggleMenu = () => {
        this.props.toggle();
    }

    // 登出 
    onClick = ({key}) => {
        if (key === "1") {
            message.success("登出成功");
            this.props.history.push('');
            removeTokenCookie();
            removeUserCookie();
        }
        else if ( key === "2") {
            this.props.history.push("/main/about/index")
        }  
    }
    menu = (
        <Menu onClick={this.onClick}>
            <Menu.Item key="1" icon={<LogoutOutlined/>}> 退出登录 </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}> 个人信息 </Menu.Item>
        </Menu>
    );
    render(){
        const { collapsed, username, color } = this.state;
        return (
            <div className="header-wrap">
                <div className="collapse">
                    <div className={collapsed ? "collapsed-close" : "collapsed-open"}>
                        <div className="collapsed-icon" aria-hidden="true"
                            onClick={this.toggleMenu}
                            onKeyDown={this.toggleMenu}>
                            <MenuFoldOutlined/>
                        </div>
                    </div>
                </div>
                <div className="header-right-components">
                    {/* <Badge count={5}></Badge> */}
                    <Avatar className="header-avatar" style={{ backgroundColor: color }} icon={<UserOutlined/>}/>
                    <Dropdown className="header-dropdown-link" overlay={this.menu} >
                        <a href=" " onClick={e => e.preventDefault()}>
                        &nbsp; {/*({group})*/} { username }</a>
                    </Dropdown>
                </div>
            </div>
        );
    }
}
export default withRouter(LayoutHeader);