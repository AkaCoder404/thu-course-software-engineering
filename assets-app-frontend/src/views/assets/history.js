import React, { Component, Fragment} from "react";
// Antd
import {Form, Input, Button, Table, message} from "antd";
// Token
import { getToken } from "../../utils/cookies";
// API
import { SearchAssetHistoryApi } from "../../api/assets";
// style
import "./list.scss";
// components
import ModalHistory from "../../components/assetsDisplay/ModalHistory";

const { Search } = Input;


class AssetHistory extends Component {
    constructor(props){
        super();
        this.state = {
            // 表头
            tableConfig: [
                {
                    title: "资产名称", 
                    dataIndex: "asset_name", 
                    key: "asset_name" 
                },
                { 
                    title: "相关人员", 
                    dataIndex: "related_user_name", 
                    key: "related_user_name" 
                },
                { 
                    title: "操作类型", 
                    dataIndex: "type",  
                    key: "type",
                    
                },
                { 
                    title: "操作时间", 
                    dataIndex: "datetime", 
                    key: "datetime" ,
                    // sorter: {
                    //     compare: (a, b) => a.value_origin - b.value_origin,
                    //     multiple: 2,
                    //   },
                },                   
                { 
                    title: "操作", 
                    dataIndex: "operation", 
                    key: "operation", 
                    render: (operation, rowData) => {
                        return (
                            <div className="inline-button">
                                <Button type="primary" onClick={() => this.watchAsset(rowData)}>
                                    详情
                                </Button>
                                
                            </div>
                        );
                    }
                }
            ],
            data:[],
            loading: true,
            visibleAssets:false,
            visibleAdd:false,
            visibleChange:false,
            
            // 弹框显示详情
            assetID:[],
            assetName:[],
            relatedUserID:[],
            relatedUserName:[],
            type:[],
            description:[],
            datetime:[]

            
        };
    }

    // 生命周期前
    componentDidMount() { 
        // 从API求数据
        this.setState({ loading: true });
        const requestData =
        {
            "token" : getToken(),
            "search_string": ""
        }
        SearchAssetHistoryApi(requestData).then(response => {
            if (response.data.code === 0) {
                const temp = response.data.data.map(info => ( {...info, key: info.description}));
                this.setState({ data: temp,  loading: false })
            }
            else { message.error(response.data.message); }
        }).catch(error => {alert(error)});
    };

    // 搜索list或者送给api搜索, api/assetList.js
    onSearch = (value) => {
        this.setState({ 
            loading: true,
            keyWork: value,
        });
        const requestData = {
            "token" : getToken(),
            "search_string": value,
        }
        SearchAssetHistoryApi(requestData).then(response => {
            this.setState({
                loading: false,
                data:response.data.data,
            })
        }).catch(error => { alert(error)})
    }
    // 每一次搜索一个字母，更新table
    handleChange = (e) => {}

    // 查看单个资产实例详细信息
    watchAsset = (rowData) => {
        this.setState({
            assetID:rowData.asset_id,
            assetName:rowData.asset_name,
            relatedUserID:rowData.related_user_id,
            relatedUserName:rowData.related_user_name,
            type:rowData.type,
            description:rowData.description,
            datetime:rowData.datetime,
            visibleAssets:true
        })
    }
    // 关闭弹框
    modalClose = () => {
        this.setState({
            visibleAssets:false,
            visibleAdd:false,
            visibleChange:false,
        })
    }

    render(){
        return (
            <div>
                <Fragment>
                    <Form layout="inline">
                    <Form.Item> 日志搜索 </Form.Item>
                    <Form.Item>
                        <Search placeholder="搜索日志" 
                                onSearch={this.onSearch}
                                onChange={this.handleChange}
                                style={{ width: 200 }}
                                />
                    </Form.Item> <br></br> <br></br>
                    
                    </Form>
                    <Table loading={this.state.loading} columns={this.state.tableConfig} dataSource={this.state.data}/>
                    {/* 资产单个显示 */}
                    <ModalHistory
                        visible={this.state.visibleAssets}
                        closeModal={this.modalClose}
                        description={this.state.description}
                    />
                </Fragment>
            </div>
        )
    }
}
export default AssetHistory;