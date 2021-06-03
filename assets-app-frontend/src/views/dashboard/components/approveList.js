import React from 'react';
import { Table, message, Button } from "antd";
import { AssetsPendingList, AssetsTransferAgree, AssetsApplyAgree, AssetsReturnAgree } from "../../../api/assets"
import { getToken } from "../../../utils/cookies";


class ApproveList extends React.Component
{
    constructor( )
    {
        super( );
        this.state = {
            // 表头
            tableConfig: [
            {
                title: "资产名称", 
                dataIndex: "display_name", 
                key: "display_name" 
            },
            { 
                title: "审批状态", 
                dataIndex: "status_name", 
                key: "status_name" 
            },
            { 
                title: "领用人", 
                dataIndex: "applicant_name", 
                key: "applicant_name" 
            },                    
            { 
                title: "审批操作", 
                dataIndex: "operation", 
                key: "operation", 
                render: (operation, rowData) => {
                    return (
                        <div className="inline-button">
                            <Button type="danger" onClick={() => this.agreeChange(rowData.unique_id,rowData.status_id,"no")}>
                                拒绝申请
                            </Button>
                            <Button type="primary" onClick={() => this.agreeChange(rowData.unique_id,rowData.status_id,"yes")}>
                                审批通过
                            </Button>
                        </div>
                    );
                }
            }
            ],
            data:[],
            loading: true,
        };
    }
    componentDidMount = () => {  this.loadData(); }
    // 加载数据
    loadData = () => {
        this.setState({ loading: true });
        const token = {"token" : getToken()};      
        AssetsPendingList(token).then(response => {
            if(response.data.code === 0) {
                const temp = response.data.data.map(info => ( {...info, key: info.unique_id}));
                this.setState({ 
                    data: temp,
                    loading: false,
                });                      
            }
            else this.setState({ loading: false, });  
        }).catch(error => { message.error(error.toString());});
    }

    agreeChange = (id, statu,YN) =>{
        const requestData ={
            "token" : getToken(),   
            "asset_id":id,
            "result":YN
        }
        if(statu === 'return_confirming'){
            AssetsReturnAgree(requestData).then(response => {
                if( response.data.code === 0 ){
                    message.success(response.data.message);
                    this.loadData();
                }
                else message.error(response.data.message); 
            }).catch(error =>{ message.error(error.toString());})
        }
        else if(statu === 'transfer_confirming'){
            AssetsTransferAgree(requestData).then(response => {
                if( response.data.code === 0 ){
                    message.success(response.data.message);
                    this.loadData();
                }
                else message.error(response.data.message); 
            }).catch(error =>{
        
                message.error(error.toString()); 
            })
        }
        else if(statu === 'get_confirming') {
            AssetsApplyAgree(requestData).then(response => {
                if( response.data.code === 0 ){
                    message.success(response.data.message);
                    this.loadData();
                }
                else message.error(response.data.message); 
            }).catch(error =>{
                message.error(error.toString()); 
            })
        }
    }
    render() {
        return( 
            <Table 
                bordered="true"
                loading={this.state.loading} 
                columns={this.state.tableConfig} 
                dataSource={this.state.data}
            />
        )
    }
}

export default ApproveList;