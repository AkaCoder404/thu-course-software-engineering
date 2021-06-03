import React, { Component } from "react";
import { PageHeader } from 'antd';
import router from "../../../router/index";
import "./pageheader.css";

let routes;
let titles; 
   
class LayoutPageHeader extends Component {
    constructor(){
        super();
        this.state = {
        };
    }
    render(){       
        const currUrl = window.location.href;
        for (var i = 0; i < router.length; i = i + 1) {
            if(router[i].child.length > 0 ) {
                for (var j = 0; j < router[i].child.length; j = j + 1)
                {
                    if (currUrl.includes(router[i].child[j].key)) 
                    {
                        routes = router[i].child[j].route;
                        titles = router[i].child[j].title;
                    }        
                }
            }
            else if (currUrl.includes(router[i].key)) {
                routes = router[i].route;
                titles = router[i].title;
            }
        } 
        return (
            <PageHeader className="site-page-header"
                title={titles}
                breadcrumb={{ routes }}
                // subTitle="This is subtitle"> 
                >
                <h3>欢迎使用~</h3>
            </PageHeader>
        );
    }
}

export default LayoutPageHeader;
