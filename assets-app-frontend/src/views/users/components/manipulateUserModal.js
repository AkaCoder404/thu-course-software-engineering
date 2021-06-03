import React, { Component} from "react";
import {Modal, Form, Input, Select, Space, Button, Alert, message} from "antd";
import { ChangePasswordApi, ChangeGroupApi } from "../../../api/users";
import {getToken} from "../../../utils/cookies";

const { Option } = Select;

class ManipulateUserModal extends Component {
    constructor(props){
        super();
        this.state = {
            visibility: true,
        };
    }

    hideModalAfterChange = (value) => {
        if (value.change_password !== undefined) {
            const passData = {
                "token" : getToken(),
                "unique_id": this.props.id,
                "new_password": value.change_password
            }
            ChangePasswordApi(passData).then(response => {
                if (response.data.code === "0") {
                    message.success(response.data.message);
                }
                else message.error(response.data.message);
            }).catch(error => { message.error(error.toString());});
        }
        if (value.change_user_type !== undefined) {
            const changeData = {
                "token" : getToken(),
                "unique_id": this.props.id,
                "group": value.change_user_type
            };
            ChangeGroupApi(changeData).then(response => {
                if (response.data.code === 0) message.success(response.data.message);
                else message.error(response.data.message);
            }).catch(error=>{ message.error(error)});
        }
        this.props.onClose();
        this.clearForm();
    }

    cancelChange = () => { this.props.onCancel(); }
    clearForm = () => { this.refs.form.resetFields(); }

    render() {
        return (
            <Modal className="model-manipulate-user"
                title="修改用户信息" 
                centered
                visible={this.props.visibility}
                footer={false}
                onCancel={this.cancelChange}>
                <Form ref="form" preserve={false} onFinish={this.hideModalAfterChange}> 
                    <Form.Item>
                        <Alert message="如果不想改变部分, 不用填" type="warning" showIcon />
                    </Form.Item>
                    <Form.Item label="修改密码" name="change_password">
                        <Input.Password placeholder="新的密码" />   
                    </Form.Item>
                    <Form.Item label="身份类型" name="change_user_type">
                        <Select
                            showSearch
                            placeholder="请选择一个身份类型"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }>
                                <Option value="generalstaff">企业普通员工</Option>
                                <Option value="assetadmin">企业资产管理员</Option>
                                <Option value="systemadmin">企业系统管理员</Option>
                                <Option value="itadmin">企业IT管理员</Option>
                        </Select>
                    </Form.Item>
                    <div className="model-footer">
                    <Form.Item>
                        <Space>
                            <Button className="button-clear-department-form" danger 
                                onClick={this.clearForm}> 重置 </Button>
                            <Button className="button-cancel-add" danger 
                                onClick={this.cancelChange}> 取消 </Button>
                            <Button className="button-add-department" 
                                type="primary" htmlType="submit" > 确定 </Button>
                        </Space>
                    </Form.Item>
                    </div>              
                </Form>
            </Modal>
        );
    }
}
export default ManipulateUserModal;
