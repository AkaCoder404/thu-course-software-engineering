import React, { Component } from "react";
import { Modal, Form, Input, Space, Button, Select, message, TreeSelect} from "antd";
import { UserAddApi } from "../../../api/users";
import { loadTreeDatas, traverseTree } from "../../../utils/departments";
import { getToken } from "../../../utils/cookies";

const { Option } = Select;

class AddUserModal extends Component {
    constructor(props){
        super();
        this.state = {
            departmentUniqueId: "",
            departments: [],
        };
    }
    componentDidMount = () => { this.loadData(); }
    loadData = () => {
        loadTreeDatas().then(response => { 
            this.setState ({ departments : response["departmentOnly"]});
        })
    }

    hideModalAfterChange = (value) => {
        const tempdata = {
            "token" : getToken(),
            "group" : value.group,
            "department" : this.state.departmentUniqueId.unique_id,
            "display_name" : value.display_name,
            "username" : value.username,
            "password" : value.password,
        };
        UserAddApi(tempdata).then(response => {
            if (response.data.code === "0") {
                message.success(response.data.message);
                this.clearForm();
                this.props.onClose();
            }
            else message.error(response.data.message);  
        }).catch(error => { message.error(error.toString()); });  
    }
    cancelChange = () => {
        this.props.onClose();
        this.clearForm();
    }
    clearForm = () => { this.refs.form.resetFields(); }

    onChange = (value) => {     
        const departmentUniqueId = (value === null) ? null: traverseTree(JSON.parse(JSON.stringify(this.state.departments)), value, 0);
        this.setState({ departmentUniqueId : departmentUniqueId });
    };

    render() {
        const { departments} = this.state;
        return(
            <Modal className="modal-add-user"
                title = "添加用户"
                centered
                visible={this.props.visibility}
                footer={false}
                onCancel={this.cancelChange}
                >
                <Form ref="form" preserve={false} onFinish={this.hideModalAfterChange}>
                <Form.Item label="姓名" name= "display_name"  rules={[{ required: true, message: '请输入用名字!'}]}>
                    <Input placeholder="用户名字"/>
                </Form.Item>
                <Form.Item label="账号" name="username" rules={[{ required: true, message: '请输用户号!'}]}>
                    <Input placeholder="新用户名"/>
                </Form.Item>
                <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输用密码!'}]}>
                    <Input.Password/>
                </Form.Item>
                <Form.Item label="部门" name="department" style={{paddingLeft:11}}>
                    <TreeSelect
                          style={{ width: '100%' }}
                          value={this.state.parent_id}
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          treeData={departments}
                          placeholder="父部门的编号"
                          treeDefaultExpandAll
                          onChange={this.onChange}>
                    </TreeSelect>
                </Form.Item>
                <Form.Item label="类型" name="group" style={{paddingLeft:11}}>
                    <Select>
                        <Option value="generalstaff">   企业普通员工</Option>
                        <Option value="assetadmin">     企业资产管理员</Option>
                        <Option value="systemadmin">    企业系统管理员</Option>
                        <Option value="itadmin">        企业IT管理员</Option>
                    </Select>
                </Form.Item>            
                <div className="model-footer">
                    <Form.Item>
                        <Space>
                            <Button className="button-clear-department-form" danger onClick={this.clearForm}> 重置 </Button>
                            <Button className="button-cancel-add" danger onClick={this.cancelChange}> 取消 </Button>
                            <Button className="button-add-department" type="primary" htmlType="submit" > 确定 </Button>
                        </Space>
                    </Form.Item>
                </div>
                </Form>
            </Modal>
        );
    }
}
export default AddUserModal; 