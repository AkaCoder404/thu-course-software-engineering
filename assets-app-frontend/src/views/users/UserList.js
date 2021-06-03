import React, { Component, Fragment } from "react";
import {Input, Table, message, Button, Switch, Divider} from "antd";
import {GetUserListApi, LockUserApi} from "../../api/users";
import AddUserModal from "./components/addUserModal";
import DeleteUserModal from "./components/deleteUserModal";
import ManipulateUserModal from "./components/manipulateUserModal";
import "../../styles/main.scss";
import { getToken } from "../../utils/cookies";

const { Search } = Input;
const group = {"企业普通员工": "generalstaff", "企业资产管理员": "assetadmin", "企业系统管理员": "systemadmin", "企业IT管理员":"itadmin"};

class UserList extends Component {
    constructor(){
        super();
        this.state = {
            // 表的headers
            columns: [{ title:"姓名", dataIndex: "name", key: "name"},
                { title:"账号", dataIndex: "username", key: "username"},
                { title:"部门", dataIndex: "department", key: "department"},
                { title:"身份", dataIndex: "group", key: "group"},
                { title:"状态", dataIndex: "status", key: "status",
                    render: (status, rowData) => (
                    <Switch onChange={() => this.onHandlerSwitch(rowData)} checkedChildren="锁住" unCheckedChildren="正常" defaultChecked={status === true ? true : false}/> 
                    ),},
                { width: 180, title:"操作", dataIndex: "operation", key: "operation", render: (text,rowData) => (
                  <div className="inline-button">
                      <Button className="userManipulateButton" type="primary" onClick={() => this.onHandlerManipulate(rowData)}>修改</Button>
                      <Button danger onClick={() => this.onHandlerDelete(rowData)}>删除</Button>
                    </div>
                    ),}
            ],
        // 用户数据 
        data: [],
        search: [],
        loading: true,
        // pass information to modals
        Id: "",
        username: "",
        // modals
        addUserModalVisible: false,
        deleteUserModalVisible: false,
        manipulateUserModalVisible: false,

        };
    }
    // 打开修改用户信息modal
    onHandlerManipulate = (value) => {
        this.showManipulateUserModal();
        this.setState({
            Id: value.key,
            password: value.password,
            username: value.username,
            userCategory: group[value.group]
        });
    }
    // 打开确认delete user的modal
    onHandlerDelete = (value) => {
        this.showDeleteUserModal();
        this.setState({
            Id: value.key, 
            username: value.username,
        });
    }
   
    // 搜索list或者送给api搜索
    onSearch = (value) => {
        var searchVal = value;
        var temp = [];
        if (searchVal !== "" && this.state.search.length !== 0) {
            for(var i = 0; i < this.state.search.length; i = i + 1) {
                if(this.state.search[i].username.includes(searchVal) 
                    || this.state.search[i].name.includes(searchVal)) {
                    temp.push(this.state.search[i]);
                }
            }
            this.setState({
                data : temp
            })
        }
        else {
            this.setState({data: this.state.search})
        }
    }

    onChange = (value) => {
        const searchValue = value.target.value
        if (searchValue === "") this.setState({ data: this.state.search })
    }

    // realization of page
    componentDidMount() { this.loadData();}
    // 从API求数据
    loadData = () => {
        const token = {"token" : getToken()}
        const temp = [];
        this.setState({ loading: true })
          
        GetUserListApi(token).then(response =>{
            // succes at getting user list
            if (response.data.message === "成功获取用户列表") {
                for(var i = 0; i < response.data.data.length; i = i + 1) {
                    temp.push({"key": response.data.data[i].unique_id, 
                                "name": response.data.data[i].display_name, 
                                "username": response.data.data[i].username,
                                "status": response.data.data[i].locked,
                                "department" : response.data.data[i].department_name,
                                "group": response.data.data[i].group_name});
                }
                this.setState({ data: temp, search: temp});
            }
            else { message.error(response.data.message) }
            this.setState({ loading: false });
        }).catch( error => {message.error(error.toString());
        });
    }
    // 解锁user账号
    onHandlerSwitch = (value) => {
        const locked = { true: "unlock", false:"lock" }
        const data = {
            "token": getToken(),
            "unique_id": value.key,
            "locked": locked[value.status]
        };
        LockUserApi(data).then(response => {
            if (response.data.code === "0"){
                message.success(response.data.message);
                this.loadData();
            } 
            else { message.error(response.data.message); }
        }).catch(error => { message.error(error.toString())});
    }
    // user add modal controls
    showAddUserModal = () => {
        this.loadData();
        this.setState({ addUserModalVisible: !this.state.addUserModalVisible });
    };
    closeAddUserModal = () => {
        this.setState({ addUserModalVisible: !this.state.addUserModalVisible });
    };
    // user delete modal controls
    showDeleteUserModal = () => {
        this.loadData();
        this.setState({ deleteUserModalVisible: !this.state.deleteUserModalVisible });
    }
    closeDeleteUserModal = () => {
        this.setState({ deleteUserModalVisible: !this.state.deleteUserModalVisible });
    }
    // manipulate user modal controls
    showManipulateUserModal = () => {
        this.loadData();
        this.setState({ manipulateUserModalVisible: !this.state.manipulateUserModalVisible});
    }
    closeManipulateUserModal = () => {
        this.setState({ manipulateUserModalVisible: !this.state.manipulateUserModalVisible});
    }


    // delete modal 
    render() { 
        const {columns, data, loading} = this.state;
        const {addUserModalVisible, deleteUserModalVisible, manipulateUserModalVisible} = this.state;
        const {Id, username} =  this.state
        return (
            <Fragment>
                <Search placeholder="搜索用户"  onSearch={this.onSearch} onChange={this.onChange} style={{ width: 200 }} />
                <Button className="button-add" type="primary" onClick={this.showAddUserModal}> 添加用户</Button>
                <Divider/>
                <Table className="table" loading={loading} columns={columns} dataSource={data} pagination="bottomRight"> </Table>
                <ManipulateUserModal onClose={this.showManipulateUserModal} onCancel={this.closeManipulateUserModal}
                            visibility={manipulateUserModalVisible} id={Id}> </ManipulateUserModal>
                <DeleteUserModal onClose={this.showDeleteUserModal} onCancel={this.closeDeleteUserModal} 
                            visibility={deleteUserModalVisible} username={username} id={Id}> </DeleteUserModal>
                <AddUserModal onClose={this.showAddUserModal} onCancel={this.closeAddUserModal} visibility={addUserModalVisible}></AddUserModal>
            </Fragment>   
        );
    }
}
export default UserList;