import React, {Component} from 'react';
import LayoutAside from "./components/LayoutAside";
import LayoutHeader from "./components/globalheader";
import LayoutContainerMain from "../../components/containerMain/index";
import LayoutPageHeader from "./components/LayoutPageHeader";
import "./index.scss";
import {Layout} from 'antd';

const {Sider, Header, Content} = Layout;

class MainPageLayout extends Component {
    constructor() {
        super();
        this.state = {
            collapsed: false
        };
    }
    // save open/close state when refresh
    componentDidMount(){
        const collapsed = JSON.parse(sessionStorage.getItem("collapsed"));
        this.setState({ collapsed });
    }
    // toggle sidebar 
    toggleCollapsed = () => {
        const collapsed = !this.state.collapsed;
        this.setState({ collapsed });
        sessionStorage.setItem("collapsed", collapsed);
    }

    render() {
        const {collapsed} = this.state;
        return (
            <Layout className="layout-wrap">
                <Sider width="200px" collapsed={collapsed}><LayoutAside/></Sider>
                <Layout>
                    <Header className="layout-header">
                        <LayoutHeader toggle={this.toggleCollapsed} collapsed={collapsed}>  </LayoutHeader>
                    </Header>
                    <LayoutPageHeader className="layout-page-header"></LayoutPageHeader>
                    <Content className="layout-content">
                        <LayoutContainerMain></LayoutContainerMain>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
export default MainPageLayout;
