import React, { Component} from "react";
import {Modal, Form, Input, Space, Button, Alert, message, TreeSelect} from "antd";
import {getToken} from "../../../utils/cookies";
import {DepartmentModifyApi, DepartmentDeleteApi} from "../../../api/department";
import {traverseTree} from "../../../utils/departments";

class ManipulateDepartmentModal extends Component {
    constructor(props) {
        super();
        this.state = {
            parent_id: null,
            department_loc: "请给部门新的地址",
            department_name: "请给部门新的名字"
        };
    }
    
    hideModalAfterChange= (value) => {
        const data = {
            "token" : getToken(),
            "department_id" : this.props.departmentId,
        }
        if (value !== undefined) {
            if (value.new_location !== undefined) data["new_location"] = value.new_location;
            if (value.new_parent_id !== undefined) data["new_parent_id"] = this.state.parent_id;
            if (value.new_name !== undefined) data["new_name"] = value.new_name;
        }
        console.log("change department info", data); 
        DepartmentModifyApi(data).then(response => {
            if (response.data.code === 0) {
                message.success(response.data.message);
                this.clearForm();
                this.props.onClose();
            }
            else (message.error(response.data.message))
        }).catch ( error => { message.error(error.toString()); })
    }
    cancelChange = () => { this.props.onCancel(); this.clearForm(); }
    clearForm = () => { this.refs.form.resetFields(); }
    deleteDepartment = () => { 
        const data = {
            token : getToken(),
            department_id : this.props.departmentId,
        }
        DepartmentDeleteApi(data).then(response => {
            if (response.data.code === 0) {
                message.success(response.data.message);
                this.clearForm();
                this.props.onClose();
            }
            else (message.error(response.data.message))
        }).catch(error => { message.error (error.toString());})
    }

     // selection of tree dropdown
    onChange = (value) => {     
        const node = (value === null) ? null:traverseTree(JSON.parse(JSON.stringify(this.props.value)), value, 0);
        console.log(node);
        this.setState({ 
            parent_id : node["unique_id"],
            department_loc : node["location"],
        });
    };

    render() {
        const { parent_id } = this.state;
        return (
            <Modal 
                title={"修改部门"}
                centered
                visible={this.props.visibility}
                footer={false}
                onCancel={this.cancelChange}>
                <Form ref="form" preserve={false} onFinish={this.hideModalAfterChange}>
                    <Form.Item>
                        <Alert message={"修改 ["+ this.props.departmentName + "] 部门的信息" } 
                            type="warning" showIcon />
                    </Form.Item>
                    <Form.Item label="新部门地址" name= "new_location">
                        <Input placeholder={this.props.departmentLoc}/>
                    </Form.Item>
                    <Form.Item label="新部门父部" name= "new_parent_id">
                        <TreeSelect
                            style={{ width: '100%' }}
                            value={parent_id}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={this.props.value}
                            placeholder={this.props.departmentParentId}
                            treeDefaultExpandAll
                            onChange={this.onChange}>
                        </TreeSelect>
                    </Form.Item>
                    <Form.Item label="新部门名字" name="new_name" >
                        <Input placeholder={this.props.departmentName}/>
                    </Form.Item>
                    <div className="model-footer">
                        <Form.Item>
                            <Space>
                                <Button className="button-clear-department-form" danger onClick={this.clearForm}> 重置 </Button>
                                <Button className="button-delete-department" type="danger" onClick={this.deleteDepartment}> 删除</Button>
                                <Button className="button-cancel-add" danger onClick={this.cancelChange}> 取消 </Button>
                                <Button className="button-add-department" type="primary" htmlType="submit" > 确定 </Button>
                            </Space>
                        </Form.Item>
                    </div>     
                </Form>
            </Modal>
        )
    }
}

export default ManipulateDepartmentModal;