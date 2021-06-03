import React, { Component } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { UserAddApi } from "../../api/users";
import { getToken } from "../../utils/cookies";

const { Option } = Select;

class UserAdd extends Component {
    constructor(){
        super();
        this.state = {
            loading: false
        };
    }
    // submit information to api/userAdd.js
    onSubmit = (value) => {
        // 连接接口
        if(!value.username) { message.error("用户名字不能为空"); return false;}
        if(!value.password) { message.error("用户密码不能为空"); return false;}
        this.setState({
            loading:true
        });
        const tempdata = {
            "token" : getToken(),
            "group" : value.group,
            "department" : value.department,
            "display_name" : value.display_name,
            "username" : value.username,
            "password" : value.password,
        };

        UserAddApi(tempdata).then(response => {
            if (response.data.code === "0"){
                message.success(response.data.message);
            }
            else {
                message.error(response.data.message);
            }
            // const data = response.data;
            this.setState({ loading:false });
            this.refs.form.resetFields();
        }).catch(error => {
            message.error(error.toString());
            this.setState({ loading:false });
        });
    }
    // clear form
    clearForm = (value) => {
        this.refs.form.resetFields();
    }

    render(){
        return (
            <Form
                ref="form"
                onFinish={this.onSubmit}
                >
                <Form.Item label="姓名" name= "display_name">
                    <Input placeholder="display name"/>
                </Form.Item>
                <Form.Item label="账号" name="username">
                    <Input placeholder="username"/>
                </Form.Item>
                <Form.Item label="密码" name="password">
                    <Input.Password/>
                </Form.Item>
                <Form.Item label="部门" name="department">
                    <Input placeholder="department"/>
                </Form.Item>
                <Form.Item label="类型" name="group">
                    <Select>
                        <Option value="generalstaff">企业普通员工</Option>
                        <Option value="assetadmin">企业资产管理员</Option>
                        <Option value="systemadmin">企业系统管理员</Option>
                        <Option value="itadmin">企业IT管理员</Option>
                    </Select>
                </Form.Item>
                <Form.Item type="inline">
                    <Button loading={this.state.loading} type="primary" htmlType="submit"> 确定 </Button>
                </Form.Item>
                <Form.Item type="inline">
                    <Button type="danger" onClick={this.clearForm}> 重置 </Button>
                </Form.Item>
            </Form>
        );
    }
}
export default UserAdd;