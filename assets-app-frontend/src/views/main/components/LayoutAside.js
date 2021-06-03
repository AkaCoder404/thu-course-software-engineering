import React, {Component} from 'react';
import AsideMenu from "../../../components/asideMenu/index";
import "./aside.scss";

class LayoutAside extends Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        return (
            <div className="layout-aside-menu" >
                 <div className="logo">华为</div>
                <AsideMenu/>
            </div>    
        );
    }
}
export default LayoutAside;
