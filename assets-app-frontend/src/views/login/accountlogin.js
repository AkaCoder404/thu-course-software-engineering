import React, {Component}  from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Input, Button, /*Checkbox,*/ message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {Login} from "../../api/account";
import {UserInfoApi} from "../../api/users";
import { setToken, setUsername } from "../../utils/cookies";

class LoginForm extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
            sign_in_loading: "false"
        };
    }  
    //登录
    onFinish = (values) => {
        // for development only
        // if (this.state.username === "username" && this.state.password === "password") {
        //     setToken("12345");
        //     setUsername(this.state.username);
        //     this.props.history.push('/main/dashboard/index');
        //     return;
        // }
        const requestData = {
            "username": this.state.username,
            "password": this.state.password
        };
        Login(requestData).then(response => { 
            if (response.data.message === "Login successful") {
                const data = {"token": response.data.token};                
                UserInfoApi(data).then(accountResponse => {
                    if (accountResponse.data.user.locked === true) {
                        message.error("账号锁住");
                    }
                    else {
                        message.success("登录成功");
                        setToken(response.data.token);
                        setUsername(this.state.username);
                        this.props.history.push('/main/dashboard/index');
                    }
                });
            }
            else { message.error(response.data.message);}
        }).catch(error => { message.error(error.toString()); });  
    };
    // input 输入处理 username
    inputChangeUsername = (e) => {
        let value = e.target.value;
        this.setState({ username: value });
    }
    // input 输入处理 password
    inputChangePassword = (e) => {
        let value = e.target.value;
        this.setState({ password: value});
    }
    
    render() {
        const { username, password } = this.state;
        return (
            <Form name="normal_login" className="login-form"
                initialValues={{ remember: true, }}
                onFinish={this.onFinish} >
                <Form.Item name="username"
                    rules={[{ required: true, message: '请输入用户号!',},]}>
                    <Input value = {username} onChange={this.inputChangeUsername} 
                        prefix={<UserOutlined className="site-form-item-icon" />} 
                        placeholder="用户号" />
                </Form.Item>
                
                <Form.Item name="password"
                    rules={[ { required: true, message: '请输入密码!',},
                        // 确认密码是正确
                        ({getFieldValue}) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve(); //验证过
                                }
                                return Promise.reject("没输入任何密码");
                            }
                        })
                    ]}>
                    <Input value= {password} onChange={this.inputChangePassword} 
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="密码"
                    />
                </Form.Item>
                {/* <Form.Item>
                    <Form.Item name="remember" valuePropName="unchecked" noStyle>
                        <Checkbox>记得我</Checkbox>
                    </Form.Item>
                    <a className="login-form-forgot" href=" "> 忘记密码 </a>
                </Form.Item> */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" 
                        className="login-form-button"> 登录 </Button>
                </Form.Item>
            </Form>
        );
    }
}
export default withRouter(LoginForm);
