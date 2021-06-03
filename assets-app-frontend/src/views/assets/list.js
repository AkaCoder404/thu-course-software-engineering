import React, { Fragment } from "react";
import { Input, Button, Table, message, Divider, Tag} from "antd";
import { getToken } from "../../utils/cookies";
import { ListAssets, AssetsInfo, SearchAssets, 
    RepairAssetFinishApi, AssetsApply, AssetsDelete } from "../../api/assets";
import { GetAccountInfo } from "../../api/account";
import ModalAssetsEdit from "./components/ModalAssetsEdit";
import ModalAssetsAdd from "./components/ModalAssetsAdd";
import AssetInfoModal from "./components/AssetInfo";
import MultipleAssetAddModal from "./components/MultipleAssetAddModal";

import "./list.scss";

const { Search } = Input;

class AssetList extends React.Component {
    constructor(){
        super();
        this.state = {
            // 表头
            tableConfig: [
                { title: "品名",  dataIndex: "display_name", key: "display_name" },
                { title: "型号", dataIndex: "model", key: "model" },
                { title: "价值", dataIndex: "value_origin",  key: "value_origin",
                    sorter: {
                        compare: (a, b) => a.value_origin - b.value_origin,
                        multiple: 2,
                    },
                }, 
                { title: "状态", dataIndex: "tags", key: "tags",
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
                { title: "领用人",  dataIndex: "belongs_to_name", key: "belongs_to_name" },                    
                { title: "操作", dataIndex: "operation", key: "operation", 
                    render: (operation, rowData) => {
                        return (
                            <div className="inline-button">
                                <Button type="primary" onClick={() => this.loadData(rowData.unique_id,1)}>
                                    详情
                                </Button>
                                <Button onClick={() => this.loadData(rowData.unique_id,2)}>
                                    编辑
                                </Button>
                            </div>
                        );
                    }
                }
            ],
            newdata:[],
            data:[],
            selectedRowKeys:[],
            loading: true,
            visibleAssets:false,
            visibleAdd:false,
            visibleChange:false,
            multipleAssetAddModalVisible: false,
            
            // 资产弹框显示详情
            displayName:[],
            displayID:[],
            brand:[],
            model:[],
            under_name:[],
            serial_number:[],
            group_name:[],
            group_id:[],
            status_name:[],
            belongs_to_name:[],
            belongs_department_name:[],
            applicant_name:[],
            value_origin:[],
            value_worth:[],
            use_year:[],
            remarks:[],
        };
    }

    // 生命周期前
    componentDidMount() {  this.loadingData() };

    loadingData = () => {
        this.setState({ loading: true });
        const requestData = {
            "token" : getToken(),
        };
        let userGroup ="";
        // 获取用户身份，进行不同列表显示
        GetAccountInfo(requestData).then(response => {
            userGroup = response.data.user.group;
        }).catch(error => {
            // message.error("获取用户超级权限失败")
        })
        // 获取所有资产列表信息
        ListAssets(requestData).then(response => {
            
            if(response.data.code === 0) {
                if(userGroup === "企业资产管理员")
                {
                    const temp = [];
                    for (let i=0; i < response.data.data.length; i++) {
                        if (response.data.data[i].status_id !== "deleted")
                            temp.push({...response.data.data[i], key: response.data.data[i].unique_id, "tags": [response.data.data[i].status_name]})
                    }
                    this.setState({
                        data: temp,
                        loading: false,
                    })
                } 
                else 
                {
                    // const temp = response.data.data.map(item => ({...item, key: item.unique_id}));
                    const temp = [];
                    const arr = [];
                    for (let i=0; i < response.data.data.length; i++) {
                        if (response.data.data[i].status_id === "unused")
                        {
                            let flag = true;
                            for (let j=0; j < arr.length; j++)
                            {
                                if (arr[j] === response.data.data[i].model)
                                {
                                    flag = false;
                                    break;
                                }
                            }
                            if (flag)
                            {
                                arr.push(response.data.data[i].model)
                                temp.push({...response.data.data[i], key: response.data.data[i].unique_id, "tags": [response.data.data[i].status_name]})
                            }
                        }
                    }
                    this.setState({
                        data: temp,
                        loading: false,
                    })
                }
            }
            else message.error(response.data.message);
        }).catch(error => {
            message.error(error.toString()); 
        })
    }

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
        SearchAssets(requestData).then(response => {
            if (response.data.code === 0) {
                const temp = response.data.data.map(item => ({...item, key: item.unique_id}));
                this.setState({
                    loading: false,
                    data:temp,
                })
            }
            else { 
                message.error (response.data.message);
                this.setState({loading: false});
            }
        }).catch(error => { message.error (error.toString()); });
    }
    
    // 关闭弹框
    modalClose = () => {
        this.setState({
            visibleAssets:false,
            visibleAdd:false,
            visibleChange:false,

            displayName:"",
            displayID:"",
            brand:"",
            model:"",
            under_name:"",
            serial_number:"",
            group_name:"",
            group_id:[],
            status_name:"",
            belongs_to_name:"",
            belongs_department_name:"",
            applicant_name:"",
            value_origin:"",
            value_worth:"",
            use_year:"",
            date:"",

            remarks:" ",
        })
        this.loadingData()
    }
    modalMore = () => {
        this.setState({
            visibleAssets:false,
            visibleAdd:false,
            visibleChange:false,
        })
        // TODO:全视图完善
        alert("功能暂未开放")
    }
    // 打开添加表单
    assetsAdd = () => {
        this.setState({visibleAdd:true})
    }
    // 资产领用申请
    assetsApply = () =>{
        if (this.state.selectedRowKeys.length === 0) {
            message.error("没有选资产");
            return;
        }
        const requestData ={
            "token" : getToken(),   
            "data" : this.state.selectedRowKeys.map(item=>({"asset_id":item})),
        }
        AssetsApply(requestData).then(response => {
            if( response.data.code === 0 )
                message.success(response.data.message);
            else message.error(response.data.message); 
        }
        ).catch(error => {
            message.error(error.toString()); 
        })
        this.loadingData()
    }
    // 资产清退申请
    assetsDelete = () =>{
        const requestData ={
            "token" : getToken(),   
            "data" : this.state.selectedRowKeys.map(item=>({"asset_id":item})),
        }
        AssetsDelete(requestData).then(response => {
            if( response.data.code === 0 )
                message.success(response.data.message);
            else message.error(response.data.message); 
        }
        ).catch(error =>{
            message.error(error.toString()); 
        })
        this.loadingData()
    }

    assetsFinishFix = () => {
        const requestData ={
            "token" : getToken(),   
            // "data" : this.state.selectedRowKeys.map(item=>({"asset_id":item})),
            "asset_id" : this.state.selectedRowKeys[0],
        }
        RepairAssetFinishApi(requestData).then(response => {
            if (response.data.code === 0) {
                message.success(response.data.message);
                this.loadingData();
            }
            else (message.error(response.data.message));
        }).catch(error=>{message.error(error.toString())});

    }


    loadData = (value, select) =>{
        const requestData =
        {
            "token" : getToken(),
            "unique_id" : value,
        }
        AssetsInfo(requestData).then(response => 
        {
            localStorage.setItem("displayID",value);
            this.setState({
                newdata:response.data.data,
                displayName:response.data.data.display_name,
                displayID:value,
                brand:response.data.data.brand,
                model:response.data.data.model,
                under_name:response.data.data.under_name,
                serial_number:response.data.data.serial_number,
                group_name:response.data.data.group_name,
                group_id: response.data.data.group_id,
                status_name:response.data.data.status_name,
                belongs_to_name:response.data.data.belongs_to_name,
                belongs_department_name:response.data.data.belongs_department_name,
                applicant_name:response.data.data.applicant_name,
                value_origin:response.data.data.value_origin,
                value_worth:response.data.data.value_worth,
                use_year:response.data.data.use_year,
                date:response.data.data.date,
                remarks:response.data.data.remarks,
            })
            if(select === 1)
                this.setState({visibleAssets:true});
            else if(select === 2)
                this.setState({visibleChange:true});     
        }).catch(error => { 
            message.error(error.toString());
            // TODO:网络错误处理
        })
    } 
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }


    /* add multiple assets through excel file */
    assetsAddMultiple = () => {
        this.showMultipleAssetAddModal();
    }
    showMultipleAssetAddModal = () => {
        if (this.state.multipleAssetAddModalVisible === true) this.loadingData();
        this.setState({ multipleAssetAddModalVisible: !this.state.multipleAssetAddModalVisible });
    }
    closeMultipleAssetAddModal = () => {
        this.setState({ multipleAssetAddModalVisible: !this.state.multipleAssetAddModalVisible });
    }













    render(){
        const { selectedRowKeys } = this.state;   
        const rowSelection = { selectedRowKeys, onChange: this.onSelectChange };
        const { multipleAssetAddModalVisible } = this.state; 
        return (
            <div>
                <Fragment>
                <Search placeholder="搜索用户"  onSearch={this.onSearch} style={{ width: 200 }} />
                {/* <Button className="button-add" type="primary" onClick={this.showAddUserModal}> 加用户</Button> */}
                <Button className="buttonApply"type="primary"
                        onClick={this.assetsApply} style={{marginLeft: 10}} align="end"> 资产领用 </Button>
                <Button className="buttonDelete" type="primary"
                        onClick={this.assetsDelete} style={{marginLeft: 10}}> 资产清退 </Button>
                <Button className="buttonDelete" type="primary"
                        onClick={this.assetsFinishFix} style={{marginLeft: 10}}> 维保完成 </Button>
                <Button className="buttonAdd" style={{backgroundColor: 'rgba(153, 102, 255, 1)', color: "white"}}
                        onClick={this.assetsAdd} align="end"> 资产添加 </Button>
                <Button className="buttonAddMultiple" style={{backgroundColor:'rgba(75, 192, 192, 1)',  color: "white"}}
                        onClick={this.assetsAddMultiple} align="end"> 批量上传 </Button>
                <br></br> 
                <Divider/>
                    <Table 
                        rowSelection={rowSelection}
                        loading={this.state.loading} 
                        columns={this.state.tableConfig} 
                        dataSource={this.state.data}
                    />
                    {/* 资产单个显示 */}
                    <AssetInfoModal 
                        onClose={this.modalClose}
                        onCancel={this.modalClose}
                        visibility={this.state.visibleAssets}
                        value={this.state.newdata}
                        id={this.state.displayID}
                    />
                    {/* 资产添加 */}
                    <ModalAssetsAdd
                        visible={this.state.visibleAdd}
                        closeModal={this.modalClose}
                        name="资产添加"
                        displayName={this.state.displayName}
                        StageDisabled='false'
                    />
                    {/* 资产编辑 */}
                    <ModalAssetsEdit
                        visible={this.state.visibleChange}
                        closeModal={this.modalClose}
                        id={this.state.displayID}
                        name="资产编辑"
                        displayName={this.state.displayName}
                        brand={this.state.brand}
                        model={this.state.model}
                        serial_number={this.state.serial_number}
                        group_name={this.state.group_name}
                        group_id={this.state.group_id}
                        status_name={this.state.status_name}
                        belongs_to_name={this.state.belongs_to_name}
                        belongs_department_name={this.state.belongs_department_name}
                        applicant_name={this.state.applicant_name}
                        value_origin={this.state.value_origin}
                        value_worth={this.state.value_worth}
                        under_name={this.state.under_name}
                        use_year={this.state.use_year}
                        date={this.state.date}
                        remarks={this.state.remarks}
                        StageDisabled='true'
                    />

                    <MultipleAssetAddModal 
                        onClose={this.showMultipleAssetAddModal}
                        onCancel={this.closeMultipleAssetAddModal}
                        visible={ multipleAssetAddModalVisible }
                    />
                    
                </Fragment>
            </div>
        )
    }
}
export default AssetList;