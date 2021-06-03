import React, { Component } from "react";
import {message, Form, Modal, Input, Button, Space, TreeSelect} from "antd";
import { getToken } from "../../../utils/cookies";
import { DepartmentCreateApi  } from "../../../api/department";
import { traverseTree } from "../../../utils/departments";
import "./addDepModal.scss";

class AddDepartmentModal extends Component {
    constructor(props) {
        super();
        this.state = {
            parent_id: null,
            department_loc: null,
            department_name: null,
            loading: false,
        };
    }
    componentDidMount = () => {this.loadData(); }
    loadData = () => {  }

    hideModalAfterChange = (value) => {   
        this.setState({ loading: true});
        const data = {
            "token" : getToken(),
            "parent_id" : this.state.parent_id,
            "new_id" :  value.department_id,
            "new_name" : value.department_name,
            "location" : value.department_location,
        };
        DepartmentCreateApi(data).then(response=>{
            if (response.data.code === 0) {
                message.success( response.data.message );
                this.props.onClose();
            }
            else {message.error( response.data.message); }
            this.setState({ loading: false});
        }).catch(error=>{});
        
        
    }
    cancelChange = () => {
        this.props.onCancel();
        this.clearForm();   
    }
    // clear form
    clearForm = () => { this.refs.form.resetFields(); }
    // delete
    deleteDepartment = () => { this.props.onClose(); }

    // selection of tree dropdown
    onChange = (value) => {     
        const node = (value === null) ? null: traverseTree(JSON.parse(JSON.stringify(this.props.value)), value, 0);
        this.setState({ 
            parent_id : node["unique_id"],
            department_loc: node["location"],
            department_name: node["title"],
        });
    };
    
    render() {
        const { parent_id, /*department_name, department_loc,*/ loading} = this.state;
        return (
            <Modal className="modal-add-department"
            title="添加部门" 
            centered
            visible={this.props.visibility}
            footer={false}
            onCancel={this.cancelChange}
            >
           <Form ref="form"
                onFinish={this.hideModalAfterChange}
                preserve={false}>    
                <Form.Item label="部门名字" name= "department_name"
                     rules={[{ required: true, message: '请输入用部门名字!'}]}>
                    <Input placeholder="部门名字"/>
                </Form.Item>
                <Form.Item label="独特编号" name="department_id"  rules={[{ required: true, message: '请输入用部编号!'}]}> 
                    <Input placeholder="部门的编号"/> 
                </Form.Item>
                <Form.Item label="父部门号" name="parent_id"  style={{paddingLeft:11}}>                   
                    <TreeSelect
                          style={{ width: '100%' }}
                          value={parent_id}
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          treeData={this.props.value}
                          placeholder="父部门的编号"
                          treeDefaultExpandAll
                          onChange={this.onChange}>
                    </TreeSelect>
                </Form.Item>
                <Form.Item label="部门地址" name="department_location"
                    rules={[{ required: true, message: '请输入用部门明!'}]}>
                    <Input placeholder="部门地址" />
                </Form.Item>     
                <div className="model-footer">
                    <Form.Item>
                        <Space>
                            <Button className="button-clear-department-form" danger onClick={this.clearForm}> 重置 </Button>
                            <Button className="button-cancel-add" danger onClick={this.cancelChange}> 取消 </Button>
                            <Button className="button-add-department" loading={loading} type="primary" htmlType="submit" > 确定 </Button>
                        </Space>
                    </Form.Item>
                </div>
            </Form>              
        </Modal>
        );
    }
}
export default AddDepartmentModal