import React, {Component} from "react";
import { Table, message, Button, Divider, Input, Tag, Tooltip} from 'antd';
import { SwapOutlined, InfoOutlined, RollbackOutlined, HistoryOutlined, ToolOutlined} from "@ant-design/icons";
import { getToken } from "../../../utils/cookies";
import { StaffAssetApi, ReturnAssetApi, RepairAssetApplyApi,
    SingleAssetHistoryApi} from "../../../api/assets";
import AssetTransferModal from "../../assets/components/AssetTransferModal";
import AssetHistoryModal from  "../../assets/components/AssetHistoryModal";
import AssetInfoModal from "./AssetInfo";
const { Search } = Input;

class PersonalAssetListTable extends Component {
    constructor(props) {
        super();
        this.state = { 
            dataSource: [], 
            columns: [
                { title: '资产名字', dataIndex: 'name', key: 'name', },
                { title: '资产品牌', dataIndex: 'brand', key: 'brand', },
                { title: '资产型号', dataIndex: 'model', key: 'model',},
                { title: '资产状态', dataIndex: 'tags', key: 'tags',
                    render: tags => (
                        <>
                            {tags.map(tag => {
                            var color = "";
                            switch(tag) {
                                case "未使用": { color='rgba(255, 99, 132, 1)';  break;}
                                case "使用中": { color='rgba(54, 162, 235, 1)'; break;}
                                case "领用待確認": {color='rgba(255, 206, 86, 1)'; break;} 
                                case "已清退": {color='rgba(75, 192, 192, 1)'; break;} 
                                case "退库待确认": {color='rgba(153, 102, 255, 1)'; break;}
                                case "转移待确认" : {color='rgba(255, 159, 64, 1)'; break;}
                                case "维保申请": {color='rgba(0, 0, 0, 1)'; break;}
                                default : color='rbga(150, 75, 0, 1)';
                            }
                            return (<Tag color={color} key={tag}> {tag}</Tag>);
                            })}
                        </>
                    )
                },
                { title: '资产操作', dataIndex: 'operation', key: 'operation',
                    render: (operation, rowData) => (
                        <div className="inline-button">
                            <Tooltip placement="top" title={"退"} >
                            <Button type="primary" shape="circle" onClick={() => 
                                this.returnAsset(operation, rowData)} icon={<RollbackOutlined/>}/>
                            </Tooltip>
                            <Tooltip placement="top" title={"转移"} >
                            <Button type="primary" shape="circle" onClick={() => 
                                this.transferAsset(operation, rowData)}icon={<SwapOutlined/>} />
                            </Tooltip>
                            <Tooltip placement="top" title={"信息"} >
                            <Button type="primary" shape="circle" onClick={() => 
                                this.infoAsset(operation, rowData)} icon={<InfoOutlined/>} />
                            </Tooltip>
                            <Tooltip placement="top" title={"历史"} >
                            <Button type="primary" shape="circle" onClick={() => 
                                this.historyAsset(operation, rowData)} icon={<HistoryOutlined/>} />
                            </Tooltip>
                            <Tooltip placement="top" title={"申请维保"} >
                            <Button type="primary" shape="circle" onClick={() => 
                                this.alertAsset(operation, rowData)} icon={<ToolOutlined/>}/>
                            </Tooltip>
                        </div>
                    )
                }
            ],
            selectedRowKeys: [],        
            unique_id: "",
            data: [], 
            transferAssetModalVisible: false,
            returnAssetModalVisible: false,
            infoAssetModalVisible: false,
            historyAssetModalVisible: false,
            search: [],
            expandedRowKeys: [],
        };
    }
    componentDidMount = () => {this.loadData(); };
    loadData = async () => {
        const data = {
            "token" : getToken(),
            "unique_id": this.props.userInfo.unique_id,
        }
        const temp = [];
        await StaffAssetApi(data).then(response => {
            if (response.data.code === 0) {
                // message.success(response.data.message);
                for (let i = 0; i < response.data.data.length; i = i + 1) {
                    temp.push({"key": response.data.data[i].asset_id,
                        "name": response.data.data[i].display_name,
                        "brand": response.data.data[i].brand,
                        "model": response.data.data[i].model,
                        "status": response.data.data[i].status_name,
                        "tags": [response.data.data[i].status_name], 
                        "data": response.data.data[i]
                    });
                }
                this.setState ({
                    dataSource : temp, search: temp             
                });
            } else { message.error(response.data.message);}     
        }).catch(error=>{ message.error(error.toString());});       
    };

    returnAsset = (operation, rowData) => {
        const data = { "token" : getToken(), "data" : [{"asset_id": rowData.key}]}
        ReturnAssetApi(data).then(response => {
            if (response.data.code === 0) {
                message.success(response.data.message)
                this.loadData()
            }
            else { message.error(response.data.message)}
        }).catch(error=> {message.error(error.toString());});
    };

    transferAsset = (operation, rowData) => {
        this.setState({ data: rowData});
        this.showTransferAssetModal();
    }

    infoAsset = (operation, rowData) => {
        this.setState({data : rowData.data, unique_id: rowData.key});
        this.showAssetInfoModal();
    }

    historyAsset = (operation, rowData) => {
        const data = { 
            "token": getToken(),
            "unique_id": rowData.key
        }
        SingleAssetHistoryApi(data).then(response => {
            const temp = [];
            if (response.data.code === 0) {
                for (let i = 0; i < response.data.data.length; i = i + 1) {
                    temp.push({"key": response.data.data[i].datetime,
                        "type": response.data.data[i].type,
                        "description": response.data.data[i].description});
                }
                this.setState({ data: temp });    
            }
            this.showAssetHistoryModal();
        }).catch(error => { message.error(error.toString());});
        // this.setState({data: temp })
    }

    returnAssetAll = () => {
        const data = {
            "token" : getToken(),
            "data" : this.state.selectedRowKeys.map(assetId => ({"asset_id" : assetId}))
        }
        ReturnAssetApi(data).then(response => {
            if (response.data.code === 0) {
                message.success(response.data.message)
                this.loadData()
                this.setState({selectedRowKeys : []});
            } 
            else message.error(response.data.message);
        }).catch(error => { message.error(error.toString());});
    }

    repairAssetAll = () => {
        const data = {
            "token" : getToken(),
            "data" : this.state.selectedRowKeys.map(assetId => ({"asset_id" : assetId}))
        }
        RepairAssetApplyApi(data).then(response => {
            if (response.data.code === 0) {
                message.success(response.data.message)
                this.loadData()
                this.setState({selectedRowKeys : []});
            }
            else message.error(response.data.message);
        }).catch(error => {message.error(error.toString());});
    }




    // 维保
    alertAsset = (operation, rowData) => {
        const data = { "token": getToken(), "data": [{"asset_id": rowData.key}]};
        RepairAssetApplyApi(data).then(request => {
            if(request.data.code === 0) {
                message.success(request.data.message);
                this.loadData();
            } else message.error(request.data.message);
        }).catch(error => { message.error(error.toString());});
    }

    transferAssetAll = () => {
        this.setState({data : this.state.selectedRowKeys.map(assetId => ({"asset_id" : assetId}))})
        this.showTransferAssetModal();
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    showTransferAssetModal = () => {
        if (this.state.transferAssetModalVisible === true) this.loadData();
        this.setState({ transferAssetModalVisible : !this.state.transferAssetModalVisible })
    }
    closeTransferAssetModal = () => {
        this.setState({ transferAssetModalVisible : !this.state.transferAssetModalVisible})
    }

    showAssetInfoModal = () => {
        this.setState({ infoAssetModalVisible : !this.state.infoAssetModalVisible});
    }
    closeAssetInfoModal = () => {
        this.setState({ infoAssetModalVisible : !this.state.infoAssetModalVisible});
    }
    showAssetHistoryModal = () => {
        this.setState({ historyAssetModalVisible: !this.state.historyAssetModalVisible});
    }
    closeAssetHistoryModal = () => {
        this.setState({ historyAssetModalVisible: !this.state.historyAssetModalVisible})
    }

    onSearch = (value) => {
        var searchVal = value;
        var temp = [];
        if (searchVal !== "" && this.state.search.length !== 0) {
            for(var i = 0; i < this.state.search.length; i = i + 1) {
                if(this.state.search[i].name.includes(searchVal) 
                    || this.state.search[i].brand.includes(searchVal)
                    || this.state.search[i].model.includes(searchVal)) {
                    temp.push(this.state.search[i]);
                }
            }
            this.setState({ dataSource : temp })
        }
        else { this.setState({dataSource: this.state.search})}
    }

    onChange = (value) => {
        const searchValue = value.target.value
        if (searchValue === "") this.setState({ dataSource: this.state.search })
    };

    onTableRowExpand = (expanded, record) => {
        const keys = [];
        if(expanded){ keys.push(record.key); }
        this.setState({expandedRowKeys: keys});
    }

    render() {
        const { dataSource, columns, data, unique_id} = this.state;
        const { transferAssetModalVisible, infoAssetModalVisible, historyAssetModalVisible} = this.state;
        const { selectedRowKeys, /*expanded,*/ expandedRowKeys} = this.state;        
        const rowSelection = { selectedRowKeys, onChange: this.onSelectChange };
        return (
            <div className="personal-asset-table">
                <Search placeholder="搜索用户"  style={{ width: 200 }} 
                onSearch={this.onSearch} onChange={this.onChange} />
                <Button className="button-add return" type="primary" 
                    onClick={this.returnAssetAll}> 批量退库 </Button>
                <Button className="button-add transfer" type="primary"
                    onClick={this.transferAssetAll} 
                    style={{marginRight: 10}}> 批量转移 </Button>
                <Button className="button-add repair" type="primary"
                    onClick={this.repairAssetAll} 
                    style={{marginRight: 10}}> 批量维保 </Button>
                <Divider/>
                <Table dataSource={dataSource} 
                    columns={columns}
                    rowSelection={rowSelection}
                    expandedRowKeys={expandedRowKeys}
                    onExpand={this.onTableRowExpand}
                    pagination="buttonRight">
                </Table>
                <AssetTransferModal onClose={this.showTransferAssetModal}
                    onCancel={this.closeTransferAssetModal}
                    visibility={transferAssetModalVisible}
                    value={data}
                    userList={this.props.userList}
                ></AssetTransferModal>
                <AssetInfoModal onClose={this.showAssetInfoModal}
                    onCancel={this.closeAssetInfoModal}
                    visibility={infoAssetModalVisible}
                    value={data}
                    id={unique_id}
                ></AssetInfoModal>
                <AssetHistoryModal onClose={this.showAssetHistoryModal}
                    oncancel={this.closeAssetHistoryModal}
                    visibility={historyAssetModalVisible}
                    value={data}>
                </AssetHistoryModal>
            </div>
        );
    }
}
export default PersonalAssetListTable;